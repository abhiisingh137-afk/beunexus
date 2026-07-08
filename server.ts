import express from "express";
import path from "path";
import http from "http";
import https from "https";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

// Utility to fetch page source securely bypassing potential SSL issues on university servers
function fetchWithHttps(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      rejectUnauthorized: false, // Bypass SSL cert errors common on Indian university domains
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 6000
    };
    
    const req = https.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith("http") 
          ? res.headers.location 
          : new URL(res.headers.location, url).toString();
        fetchWithHttps(redirectUrl).then(resolve).catch(reject);
        return;
      }
      
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });
    
    req.on("error", (err) => {
      reject(err);
    });
    
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });
  });
}

// Telegram integration helpers
function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function callTelegram(token: string, method: string, payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/bot${token}/${method}`;
    const payloadStr = JSON.stringify(payload);
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payloadStr)
      },
      timeout: 8000
    };
    
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on("error", (err) => {
      reject(err);
    });
    
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Telegram API request timed out (8s)"));
    });
    
    req.write(payloadStr);
    req.end();
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyAXOWcw5FcDjwjjAheiOAyx_t209Npv5C4",
  authDomain: "studycrate-3ecf8.firebaseapp.com",
  projectId: "studycrate-3ecf8",
  storageBucket: "studycrate-3ecf8.firebasestorage.app",
  messagingSenderId: "588351424129",
  appId: "1:588351424129:web:c61e77740168b166e2ef80"
};

const firebaseApp = initializeApp(firebaseConfig);
const serverDb = getFirestore(firebaseApp, "ai-studio-6ed392ca-dab3-4677-b296-362ab4a0f8f3");

const DEFAULT_BOT_TOKEN = "8876998350:AAGIJk0Cb7pX5dPGqeqdyzhx1Qv2hy6pZSM";
const DEFAULT_CHANNEL_ID = "-1003994463295";
const WEBHOOK_HOST = "ais-pre-ydxy5mpstxonppjiauw2lm-387554138614.asia-southeast1.run.app";
const DEFAULT_WEBHOOK_URL = `https://${WEBHOOK_HOST}/api/telegram/webhook`;

async function getOrSeedTelegramConfig() {
  try {
    const configDocRef = doc(serverDb, "settings", "telegram");
    
    // Always overwrite with the current correct/valid default config on boot to keep it completely functional
    const activeConfig = {
      botToken: DEFAULT_BOT_TOKEN,
      channelId: DEFAULT_CHANNEL_ID,
      webhookUrl: DEFAULT_WEBHOOK_URL,
      secretCode: "apnaBEU@admin2026",
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(configDocRef, activeConfig);
    console.log("[Auto-Seed] Successfully set/updated settings/telegram to active credentials:", DEFAULT_BOT_TOKEN.substring(0, 8) + "...");
    return {
      botToken: DEFAULT_BOT_TOKEN,
      channelId: DEFAULT_CHANNEL_ID,
      webhookUrl: DEFAULT_WEBHOOK_URL
    };
  } catch (error) {
    console.error("[getOrSeedTelegramConfig] Error seeding active config:", error);
    return {
      botToken: DEFAULT_BOT_TOKEN,
      channelId: DEFAULT_CHANNEL_ID,
      webhookUrl: DEFAULT_WEBHOOK_URL
    };
  }
}

let pollingActive = false;
let lastUpdateId = 0;

async function processTelegramUpdate(update: any): Promise<void> {
  const message = update.message || update.edited_message;
  if (!message) {
    console.log("No message or edited_message found in the update payload.");
    return;
  }

  const chatId = message.chat?.id;
  if (!chatId) {
    console.log("No chat ID available in message payload.");
    return;
  }

  const messageId = message.message_id;
  const document = message.document;
  const photo = message.photo;
  const caption = message.caption || "";

  // Load config dynamically with fallback auto-seeding
  const { botToken, channelId } = await getOrSeedTelegramConfig();

  const text = (message.text || "").trim();
  const isLectureCmd = text.toLowerCase().startsWith("/lecture");

  if (isLectureCmd) {
    if (!botToken) {
      console.error("Bot token is blank.");
      return;
    }

    let branch = "";
    let semester = 0;
    let subject = "";
    let chapter = "";
    let title = "";
    let videoUrl = "";

    // 1. First, check multi-line format
    const lines = text.split("\n");
    if (lines.length >= 4) {
      for (const line of lines) {
        const lowerLine = line.toLowerCase().trim();
        if (lowerLine.startsWith("branch:") || lowerLine.startsWith("branch -") || lowerLine.startsWith("branch =")) {
          branch = line.substring(line.indexOf(":") + 1 || line.indexOf("-") + 1 || line.indexOf("=") + 1).trim();
        } else if (lowerLine.startsWith("sem:") || lowerLine.startsWith("semester:") || lowerLine.startsWith("sem -") || lowerLine.startsWith("sem =") || lowerLine.startsWith("semester =")) {
          const semStr = line.substring(line.indexOf(":") + 1 || line.indexOf("-") + 1 || line.indexOf("=") + 1).trim();
          const m = semStr.match(/\b([1-8])\b/);
          if (m) semester = parseInt(m[1]);
        } else if (lowerLine.startsWith("subject:") || lowerLine.startsWith("course:") || lowerLine.startsWith("subject -") || lowerLine.startsWith("subject =")) {
          subject = line.substring(line.indexOf(":") + 1 || line.indexOf("-") + 1 || line.indexOf("=") + 1).trim();
        } else if (lowerLine.startsWith("chapter:") || lowerLine.startsWith("unit:") || lowerLine.startsWith("chapter -") || lowerLine.startsWith("chapter =")) {
          chapter = line.substring(line.indexOf(":") + 1 || line.indexOf("-") + 1 || line.indexOf("=") + 1).trim();
        } else if (lowerLine.startsWith("lecture:") || lowerLine.startsWith("title:") || lowerLine.startsWith("lecture name:") || lowerLine.startsWith("lecture -") || lowerLine.startsWith("lecture =") || lowerLine.startsWith("lesson:")) {
          title = line.substring(line.indexOf(":") + 1 || line.indexOf("-") + 1 || line.indexOf("=") + 1).trim();
        } else if (lowerLine.startsWith("url:") || lowerLine.startsWith("link:") || lowerLine.startsWith("youtube:") || lowerLine.startsWith("video:") || lowerLine.startsWith("url =") || lowerLine.startsWith("link =")) {
          videoUrl = line.substring(line.indexOf(":") + 1 || line.indexOf("-") + 1 || line.indexOf("=") + 1).trim();
        }
      }
    }

    // 2. If fields are not fully extracted, check single-line delimited with pipe '|'
    if (!branch || !semester || !subject || !chapter || !title || !videoUrl) {
      const rawContent = text.substring(8).trim(); // Skip "/lecture"
      const parts = rawContent.split("|");
      if (parts.length >= 6) {
        branch = parts[0].trim();
        const semM = parts[1].trim().match(/\b([1-8])\b/);
        if (semM) semester = parseInt(semM[1]);
        subject = parts[2].trim();
        chapter = parts[3].trim();
        title = parts[4].trim();
        videoUrl = parts[5].trim();
      }
    }

    // 3. If still not fully extracted, check single-line delimited with hyphen '-'
    if (!branch || !semester || !subject || !chapter || !title || !videoUrl) {
      const rawContent = text.substring(8).trim(); // Skip "/lecture"
      const parts = rawContent.split("-");
      if (parts.length >= 6) {
        branch = parts[0].trim();
        const semM = parts[1].trim().match(/\b([1-8])\b/);
        if (semM) semester = parseInt(semM[1]);
        subject = parts[2].trim();
        chapter = parts[3].trim();
        title = parts[4].trim();
        videoUrl = parts[5].trim();
      }
    }

    // Extract videoId from videoUrl
    let videoId = videoUrl.trim();
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoId.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
    }

    // Clean branch
    const upperBranch = branch.toUpperCase().trim();
    const branchMatches = upperBranch.match(/\b(CSE|ECE|ME|CE|EE|IT|CS)\b/);
    if (branchMatches) {
      branch = branchMatches[0] === "CS" ? "CSE" : branchMatches[0];
    } else {
      branch = ""; // invalidate to trigger helper
    }

    const uploaderName = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") || "Student Contributor";

    // Validate we have all required fields
    if (branch && semester >= 1 && semester <= 8 && subject.trim() && chapter.trim() && title.trim() && videoId.length === 11) {
      try {
        const payload = {
          branch,
          semester,
          subject: subject.trim(),
          chapter: chapter.trim(),
          title: title.trim(),
          videoId,
          order: 1,
          description: `Uploaded via Telegram Bot by ${uploaderName}`,
          secretCode: "apnaBEU@admin2026",
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(serverDb, "lectures"), payload);

        const uploaderUser = message.from?.username ? `@${message.from.username}` : uploaderName;
        const successResponse = `🎉 <b>Lecture Uploaded Successfully!</b> 🚀\n\n` +
          `Your video lecture has been added to our portal directory instantly!\n\n` +
          `📚 <b>Details:</b>\n` +
          `• <b>Branch:</b> ${branch}\n` +
          `• <b>Semester:</b> ${semester}rd/th Sem\n` +
          `• <b>Subject:</b> ${subject.trim()}\n` +
          `• <b>Chapter:</b> ${chapter.trim()}\n` +
          `• <b>Lesson:</b> ${title.trim()}\n` +
          `• <b>YouTube Watch ID:</b> <code>${videoId}</code>\n` +
          `• <b>Contributor:</b> ${uploaderUser}\n\n` +
          `Thank you for contributing to your peers! Watch it live on the website! 🌟`;

        await callTelegram(botToken, "sendMessage", {
          chat_id: chatId,
          text: successResponse,
          parse_mode: "HTML"
        });
      } catch (err: any) {
        console.error("Error writing telegram lecture to database:", err);
        await callTelegram(botToken, "sendMessage", {
          chat_id: chatId,
          text: `❌ <b>Database Error:</b> Failed to register lecture. Please try again later.`,
          parse_mode: "HTML"
        });
      }
    } else {
      // Send helpful formatting instructions
      const helpText = `🎥 <b>How to Upload/Add Video Lectures via Bot:</b>\n\n` +
        `You can instantly add curated YouTube lectures to our website directory! Please send the details using one of these two easy formats:\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 <b>OPTION A: Multi-line Format (Recommended)</b>\n` +
        `<i>Copy, paste, edit the fields, and send to the bot:</i>\n\n` +
        `<code>/lecture\n` +
        `Branch: CSE\n` +
        `Sem: 3rd\n` +
        `Subject: Data Structures\n` +
        `Chapter: Chapter 1: Introduction\n` +
        `Lecture: Big O Notation and Complexity\n` +
        `URL: https://www.youtube.com/watch?v=V39Z-VepnBY</code>\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 <b>OPTION B: Single-line Format</b>\n` +
        `<i>Send a single message using "|" (pipes) to separate details:</i>\n\n` +
        `<code>/lecture CSE | 3rd Sem | Data Structures | Chapter 1 | Big O Notation | https://www.youtube.com/watch?v=V39Z-VepnBY</code>\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💡 <b>IMPORTANT RULES:</b>\n` +
        `• <b>Branch</b> must be one of: CSE, ECE, ME, CE, EE, IT\n` +
        `• <b>Sem</b> must be from 1st to 8th\n` +
        `• A valid YouTube link is required so students can watch it directly on our portal!\n\n` +
        `Your input had:\n` +
        `• Branch: ${branch || "❌ missing or invalid"}\n` +
        `• Sem: ${semester || "❌ missing or invalid"}\n` +
        `• Subject: ${subject.trim() || "❌ missing"}\n` +
        `• Chapter: ${chapter.trim() || "❌ missing"}\n` +
        `• Title: ${title.trim() || "❌ missing"}\n` +
        `• Video Link: ${videoId ? "✅ valid" : "❌ missing or invalid link"}`;

      await callTelegram(botToken, "sendMessage", {
        chat_id: chatId,
        text: helpText,
        parse_mode: "HTML"
      });
    }
    return;
  }

  if (!document && !photo) {
    const isStart = message.text && message.text.startsWith("/start");
    
    const welcomeText = `👋 <b>Welcome to the NexusBEU Student Materials Bot!</b> 🚀\n\nI will help you instantly upload and list your study materials (such as hand-written notes, syllabus, reference books, past year papers (PYQs), or college sheets) on our website directory!\n\n--------------------------------------------\n\n📥 <b>HOW TO UPLOAD MATERIALS THE RIGHT WAY:</b>\n\n1️⃣ <b>Attach your file:</b>\n   • Send any document (PDF, DOCX, ZIP) or a high-quality photo/image directly to me.\n   \n2️⃣ <b>Include details in the CAPTION (CRITICAL):</b>\n   • You must specify the <b>Branch</b> (e.g., CSE, ECE, ME, CE, EE, IT) and <b>Semester</b> (1st to 8th) in the caption text of the file before hitting send.\n   • Add the subject name and details so other students can find it easily!\n\n--------------------------------------------\n\n📝 <b>CAPTION FORMAT EXAMPLES:</b>\n\n✅ <i>"CSE 5th Sem - Compiler Design unit 3 notes by Neha"</i>\n✅ <i>"ECE 3rd Semester - Network Theory PYQs 2024"</i>\n✅ <i>"ME 4th Sem - Fluid Mechanics handbook"</i>\n\n--------------------------------------------\n\n🎥 <b>NEW: UPLOAD VIDEO LECTURES:</b>\n• You can also add curated YouTube lectures via the bot! Just send the keyword <b>/lecture</b> to get step-by-step instructions and templates.\n\n--------------------------------------------\n\n💡 <b>WHAT HAPPENS NEXT?</b>\n• Once you send the file or lecture, our bot automatically extracts details and publishes it instantly on our website!\n\nLet's keep the peer contribution growing! Thank you for supporting your fellow students! 🌟`;
    
    const responseText = isStart 
      ? welcomeText 
      : `ℹ️ <b>To upload study materials or lectures to NexusBEU correctly:</b>\n\n📁 <b>For study materials:</b>\n1️⃣ Attach a document (PDF, DOCX, ZIP) or an image.\n2️⃣ In the caption, specify the <b>Branch</b>, <b>Semester</b>, and <b>Subject</b>.\n\n🎥 <b>For video lectures:</b>\nSend <code>/lecture</code> to receive easy upload templates and examples.`;
    
    if (botToken) {
      const sendRes = await callTelegram(botToken, "sendMessage", { 
        chat_id: chatId, 
        text: responseText,
        parse_mode: "HTML"
      });
      console.log("Telegram welcome/guide sendMessage API response:", sendRes);
    } else {
      console.error("Bot token is blank.");
    }
    return;
  }

  if (!botToken || !channelId) {
    console.error("Webhook/Polling missing token or channelId configuration.");
    return;
  }

  let fileId = "";
  let fileName = "";
  let fileSize = 0;
  let mimeType = "";

  if (document) {
    fileId = document.file_id;
    fileName = document.file_name || "Document.pdf";
    fileSize = document.file_size || 0;
    mimeType = document.mime_type || "application/pdf";
  } else if (photo && photo.length > 0) {
    const largestPhoto = photo[photo.length - 1];
    fileId = largestPhoto.file_id;
    fileName = `Photo_${Date.now()}.jpg`;
    fileSize = largestPhoto.file_size || 0;
    mimeType = "image/jpeg";
  }

  let branch = "";
  let semester = 0;

  const upperCaption = caption.toUpperCase();
  const branchMatches = upperCaption.match(/\b(CSE|ECE|ME|CE|EE|IT|CS)\b/);
  if (branchMatches) {
    branch = branchMatches[0] === "CS" ? "CSE" : branchMatches[0];
  }

  const semMatches = upperCaption.match(/\b([1-8])(?:ST|ND|RD|TH)?\s*(?:SEM|SEMESTER)?\b/i);
  if (semMatches) {
    semester = parseInt(semMatches[1]);
  }

  const errors: string[] = [];

  // Check if caption is completely empty
  if (!caption.trim()) {
    errors.push("<b>No Caption Provided:</b> You sent a file without any caption description. The bot needs a caption specifying your <b>Branch</b> and <b>Semester</b> to organize the resource.");
  } else {
    // If we have a caption, check if branch and semester were found
    if (!branch) {
      errors.push("<b>Branch Missing or Invalid:</b> We couldn't detect your Branch (must be CSE, ECE, ME, CE, EE, or IT) in the caption message. Please include a clear branch tag.");
    }
    if (!semester) {
      errors.push("<b>Semester Missing or Invalid:</b> We couldn't detect your Semester (must be from 1st Sem to 8th Sem) in the caption message. Please include a clear semester tag.");
    }
  }

  // Check if the filename is generic / wrong method
  const lowerName = fileName.toLowerCase();
  const genericKeywords = [
    "untitled", "document", "screenshot", "scan_", "camscanner", "vflat", 
    "adobescan", "image_", "photo_", "img_", "whatsapp image", "telegram", "unnamed"
  ];
  const isGeneric = genericKeywords.some(kw => lowerName.includes(kw));
  // also check if base name is purely numbers (e.g. unix timestamp or date sequence)
  const baseName = fileName.includes(".") ? fileName.substring(0, fileName.lastIndexOf(".")) : fileName;
  const isNumericOnly = /^\d+$/.test(baseName) || /^[0-9_\-]+$/.test(baseName);

  if (isGeneric || isNumericOnly) {
    errors.push(`<b>Improper File Name ("${escapeHtml(fileName)}"):</b> Your file name is using a generic, default scanner or screenshot name. Please rename your file to describe the course and subject using our standard CamelCase formula before sending!`);
  }

  // If there are validation errors, reject and send detailed instruction
  if (errors.length > 0) {
    const rejectText = `❌ <b>Resource Upload Rejected!</b> ⚠️\n\n` +
      `We couldn't accept your contribution <b>"${escapeHtml(fileName)}"</b> because it was sent in an incorrect or incomplete format.\n\n` +
      `🔍 <b>Identified Issues:</b>\n` +
      errors.map((err, idx) => `${idx + 1}. ${err}`).join("\n\n") + `\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📂 <b>HOW TO UPLOAD PROPERLY (3 simple rules):</b>\n\n` +
      `1️⃣ <b>Rename your file (CRITICAL):</b>\n` +
      `Before uploading, rename your PDF file using our standard CamelCase format:\n` +
      `<code>[Branch]_[Sem]_[Subject]_[Topic]_[Uploader].pdf</code>\n` +
      `• <i>Good Name: <b>CSE_5thSem_CompilerDesign_Notes_Neha.pdf</b></i>\n` +
      `• <i>Avoid names like "Document.pdf", "CamScanner_Scan.pdf", "Screenshot.png", or simple numbers!</i>\n\n` +
      `2️⃣ <b>Include a descriptive CAPTION:</b>\n` +
      `Type a caption with your file before clicking send. It MUST mention your <b>Branch</b> and <b>Semester</b>.\n` +
      `• <i>Good Caption: <b>"CSE 5th Sem - Compiler Design unit 3 notes by Neha"</b></i>\n\n` +
      `3️⃣ <b>Ensure clear, high-quality material:</b>\n` +
      `Make sure sheets are clearly scanned and cropped using applications like Adobe Scan, Microsoft Lens, or vFlat.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👉 <b>Please rename your file, write a proper caption, and resubmit it to the bot! Thank you for supporting your peers!</b> 🌟`;

    await callTelegram(botToken, "sendMessage", {
      chat_id: chatId,
      text: rejectText,
      parse_mode: "HTML"
    });
    return;
  }

  const uploaderName = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") || "Student Contributor";
  const uploaderUsername = message.from?.username || "";

  // 1. Forward to the target channel
  const forwardRes = await callTelegram(botToken, "forwardMessage", {
    chat_id: channelId,
    from_chat_id: chatId,
    message_id: messageId
  });

  let channelPostId: number | undefined;
  if (forwardRes.ok && forwardRes.result) {
    channelPostId = forwardRes.result.message_id;
  }

  // 2. Save material metadata to Firestore
  await addDoc(collection(serverDb, "telegram_materials"), {
    fileName,
    fileSize,
    mimeType,
    fileId,
    caption,
    uploaderName,
    uploaderUsername,
    channelPostId,
    branch,
    semester,
    secretCode: "apnaBEU@admin2026",
    createdAt: new Date().toISOString()
  });

  // 3. Confirm to uploader
  const safeFileName = escapeHtml(fileName);
  const successText = `🎉 <b>Success!</b> Your study material <b>"${safeFileName}"</b> has been received, stored in our database, and forwarded to our official private channel.\n\nThank you for contributing! Your upload will appear live on our website under "Bot Uploads". 🚀`;
  
  const sendRes = await callTelegram(botToken, "sendMessage", {
    chat_id: chatId,
    text: successText,
    parse_mode: "HTML"
  });
  console.log("Telegram upload confirmation sendMessage API response:", sendRes);
}

async function startPolling(token: string) {
  if (pollingActive) return;
  pollingActive = true;
  console.log("[Polling] Starting background long polling loop...");
  
  while (pollingActive) {
    try {
      const response = await callTelegram(token, "getUpdates", {
        offset: lastUpdateId + 1,
        timeout: 10,
        allowed_updates: ["message"]
      });
      
      if (response && response.ok && Array.isArray(response.result)) {
        for (const update of response.result) {
          lastUpdateId = update.update_id;
          console.log("[Polling] Processing update ID:", update.update_id);
          try {
            await processTelegramUpdate(update);
          } catch (err: any) {
            console.error("[Polling] Error processing update:", err.message);
          }
        }
      } else {
        if (response && response.error_code === 409) {
          console.log("[Polling] Conflict (webhook active). Retrying in 10s...");
          await new Promise(resolve => setTimeout(resolve, 10000));
        } else {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    } catch (error: any) {
      console.error("[Polling] Polling loop request exception:", error.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  const PORT = 3000;

  // ==================== TELEGRAM WEBHOOK PIPELINE ENDPOINTS ====================
  
  // Endpoint to query current webhook setup details and API queue status
  app.get("/api/telegram/status", async (req, res) => {
    try {
      const { botToken, channelId, webhookUrl } = await getOrSeedTelegramConfig();
      const isDev = process.env.NODE_ENV !== "production";

      try {
        const info = await callTelegram(botToken, "getWebhookInfo", {});
        if (info.ok && info.result) {
          const registered = !!info.result.url;
          const expectedWebhookUrl = webhookUrl;

          // Only auto-repair webhook registration in production if it is missing or incorrect
          if (!isDev && (!registered || info.result.url !== expectedWebhookUrl)) {
            console.log("[Auto-Repair] Webhook is missing or incorrect in production. Repairing in progress...");
            const repairResult = await callTelegram(botToken, "setWebhook", { url: expectedWebhookUrl });
            console.log("[Auto-Repair] Telegram setWebhook response:", repairResult);
            if (repairResult.ok) {
              await setDoc(doc(serverDb, "settings", "telegram"), {
                botToken,
                channelId,
                webhookUrl: expectedWebhookUrl,
                secretCode: "apnaBEU@admin2026",
                updatedAt: new Date().toISOString()
              }, { merge: true });
              
              const freshInfo = await callTelegram(botToken, "getWebhookInfo", {});
              if (freshInfo.ok && freshInfo.result) {
                return res.json({
                  webhookRegistered: !!freshInfo.result.url || pollingActive,
                  isPolling: pollingActive,
                  url: freshInfo.result.url || "Polling Fallback Active",
                  pendingUpdateCount: freshInfo.result.pending_update_count,
                  lastErrorMessage: freshInfo.result.last_error_message || null,
                  lastErrorDate: freshInfo.result.last_error_date || null,
                  repaired: true
                });
              }
            }
          }

          res.json({
            webhookRegistered: registered || pollingActive,
            isPolling: pollingActive,
            url: info.result.url || "Polling Fallback Active",
            pendingUpdateCount: info.result.pending_update_count,
            lastErrorMessage: info.result.last_error_message || null,
            lastErrorDate: info.result.last_error_date || null
          });
        } else {
          res.json({
            webhookRegistered: pollingActive,
            isPolling: pollingActive,
            url: "Polling Fallback Active",
            pendingUpdateCount: 0,
            error: info.description || "Invalid response from Telegram API"
          });
        }
      } catch (err: any) {
        res.json({
          webhookRegistered: pollingActive,
          isPolling: pollingActive,
          url: "Polling Fallback Active",
          pendingUpdateCount: 0,
          error: "Telegram API check failed: " + err.message
        });
      }
    } catch (error: any) {
      res.json({
        webhookRegistered: pollingActive,
        isPolling: pollingActive,
        error: error.message
      });
    }
  });

  // Setup Webhook: Register and save Telegram bot token and target Channel ID
  app.post("/api/telegram/setup", async (req, res) => {
    try {
      const { botToken, channelId, secretCode } = req.body;
      if (!botToken || !channelId) {
        return res.status(400).json({ success: false, error: "Bot token and channel ID are required" });
      }

      if (secretCode !== "apnaBEU@admin2026") {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid Admin Secret Code" });
      }

      // Force protocol to ALWAYS be https because Telegram webhook only accepts HTTPS
      const protocol = "https";
      let host = "";

      // 1. Try to extract host from the Referer header (most reliable as it comes directly from the admin's browser session)
      if (req.headers.referer) {
        try {
          const refUrl = new URL(req.headers.referer as string);
          if (refUrl.hostname && !refUrl.hostname.includes("localhost") && !refUrl.hostname.includes("127.0.0.1") && !refUrl.hostname.startsWith("0.0.0.0")) {
            host = refUrl.host; // This includes port if non-standard, but we will strip it below
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      // 2. Fallback to x-forwarded-host or standard host header
      if (!host) {
        host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "";
      }

      // 3. Strip port if present (Telegram webhooks do not support non-standard ports like :3000)
      if (host.includes(":")) {
        host = host.split(":")[0];
      }

      // 4. Fallback if still local/sandboxed or blank
      if (!host || host.includes("localhost") || host.includes("127.0.0.1") || host.startsWith("0.0.0.0") || host === "3000") {
        host = "ais-pre-ydxy5mpstxonppjiauw2lm-387554138614.asia-southeast1.run.app";
      }

      // 5. Convert private development domain (ais-dev) to public shared preview domain (ais-pre) so Telegram can access it without login auth
      if (host.includes("ais-dev-")) {
        host = host.replace("ais-dev-", "ais-pre-");
      }

      const webhookUrl = `${protocol}://${host}/api/telegram/webhook`;
      console.log("Setting Telegram webhook URL to:", webhookUrl);

      try {
        const result = await callTelegram(botToken, "setWebhook", { url: webhookUrl });
        console.log("Telegram setWebhook API response:", result);
        if (result.ok) {
          await setDoc(doc(serverDb, "settings", "telegram"), {
            botToken,
            channelId,
            webhookUrl,
            secretCode: "apnaBEU@admin2026",
            updatedAt: new Date().toISOString()
          });
          res.json({ success: true, message: result.description || "Webhook registered successfully" });
        } else {
          res.status(400).json({ success: false, error: result.description || "Failed to set up Telegram webhook connection" });
        }
      } catch (err: any) {
        console.error("Webhook registration call error: ", err);
        res.status(500).json({ success: false, error: "Telegram API registration failed: " + err.message });
      }

    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Webhook Receiver: Handles all incoming student messages from Telegram
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      const update = req.body;
      console.log("Incoming Telegram webhook update payload:", JSON.stringify(update));
      if (update) {
        await processTelegramUpdate(update);
      }
      res.status(200).send("OK");
    } catch (err) {
      console.error("Webhook process exception: ", err);
      res.status(200).send("OK"); // Avoid retries from Telegram even on error
    }
  });

  // High-Speed Telegram Download Proxy Streaming Endpoint
  app.get("/api/telegram/file/:file_id", async (req, res) => {
    try {
      const { file_id } = req.params;
      if (!file_id) return res.status(400).send("File ID required");

      const { botToken } = await getOrSeedTelegramConfig();
      if (!botToken) {
        return res.status(500).send("Bot credentials are blank");
      }

      const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${file_id}`;
      
      https.get(getFileUrl, (telRes) => {
        let body = "";
        telRes.on("data", (chunk) => body += chunk);
        telRes.on("end", () => {
          try {
            const data = JSON.parse(body);
            if (!data.ok || !data.result || !data.result.file_path) {
              return res.status(404).send("File path not found on Telegram servers");
            }
            
            const filePath = data.result.file_path;
            const directFileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
            
            https.get(directFileUrl, (fileRes) => {
              if (fileRes.headers["content-type"]) {
                res.setHeader("Content-Type", fileRes.headers["content-type"]);
              }
              if (fileRes.headers["content-length"]) {
                res.setHeader("Content-Length", fileRes.headers["content-length"]);
              }
              
              const filename = path.basename(filePath);
              res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
              
              fileRes.pipe(res);
            }).on("error", (err) => {
              res.status(500).send("Failed to stream file: " + err.message);
            });

          } catch (e: any) {
            res.status(500).send("Failed to parse Telegram file info: " + e.message);
          }
        });
      }).on("error", (err) => {
        res.status(500).send("Failed to get file from Telegram: " + err.message);
      });

    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // API Route for notices
  app.get("/api/notices", async (req, res) => {
    try {
      const fallbackNotices = [
        {
          id: "notice-1",
          title: "Regarding online examination form fill-up for B.Tech 8th Semester Exam 2026",
          content: "All candidates of B.Tech 8th Semester are directed to fill their examination forms online. The portal will be open from July 10, 2026, to July 20, 2026. Late fees will apply after July 20.",
          date: "04 July 2026",
          link: "http://beu-bih.ac.in/BEU_Exam/ExamForm",
          category: "Exam"
        },
        {
          id: "notice-2",
          title: "Declaration of Results: B.Tech 5th & 7th Semester (Regular/Back) Exam 2025",
          content: "The Bihar Engineering University has declared the results for B.Tech 5th and 7th Semester Examinations. Students can check their results on the official exam portal under the 'Result' section.",
          date: "28 June 2026",
          link: "http://beu-bih.ac.in/BEU_Exam/Result/",
          category: "Exam"
        },
        {
          id: "notice-3",
          title: "Syllabus Revision Circular for B.Tech Computer Science (IoT & Cyber Security) 2026",
          content: "The Academic Council has approved minor revisions in the syllabus of B.Tech CSE (IoT & Cyber Security Specialization) starting from the academic session 2026-27. Modified modules are active.",
          date: "15 June 2026",
          link: "http://beu-bih.ac.in/",
          category: "Academic"
        },
        {
          id: "notice-4",
          title: "Summer Vacation Schedule and Academic Calendar 2026-2027",
          content: "The summer vacations for all affiliated colleges of Bihar Engineering University will commence from June 1st to June 30th, 2026. Colleges will reopen on July 1st, 2026. Regular classes commence.",
          date: "20 May 2026",
          link: "http://beu-bih.ac.in/",
          category: "General"
        },
        {
          id: "notice-5",
          title: "Notification regarding registration of newly admitted B.Tech lateral entry students",
          content: "All newly admitted lateral entry B.Tech students in BEU-affiliated colleges are directed to complete their university registration portal details by June 15, 2026.",
          date: "10 May 2026",
          link: "http://beu-bih.ac.in/Registration",
          category: "Academic"
        },
        {
          id: "notice-6",
          title: "Instructions for Mid-Semester Examinations & Marks Submission Guidelines",
          content: "All colleges affiliated with BEU must conduct their Mid-Semester (Internal) exams by the end of July and submit the internal marks on the online college log portal on or before August 5, 2026.",
          date: "02 May 2026",
          link: "http://beu-bih.ac.in/",
          category: "Academic"
        }
      ];

      try {
        const html = await fetchWithHttps("https://beu-bih.ac.in/notification");
        const noticesList: any[] = [];
        
        // Strategy A: Find table rows (<tr>) as most notice boards are structured as tables
        const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let trMatch;
        let count = 0;
        
        while ((trMatch = trRegex.exec(html)) !== null && count < 15) {
          const rowHtml = trMatch[1];
          
          // Match any anchor linking to a pdf, circular, notice or exam-related page
          const linkRegex = /<a[^>]+href=["']([^"']*(?:\.pdf|Notification|Notice|circular|Exam)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/i;
          const linkMatch = linkRegex.exec(rowHtml);
          
          if (linkMatch) {
            const fileUrl = linkMatch[1];
            let titleText = linkMatch[2].replace(/<[^>]+>/g, "").trim();
            
            // If the anchor text itself is empty or just generic words like "Download" or "PDF"
            if (titleText.length < 5 || /download|click|view|here|pdf/i.test(titleText)) {
              const cleanRowText = rowHtml
                .replace(/<a[^>]*>[\s\S]*?<\/a>/gi, "") // strip anchors
                .replace(/<[^>]+>/g, " ") // strip elements
                .replace(/[\n\t\r]/g, " ")
                .replace(/\s+/g, " ")
                .trim();
              if (cleanRowText.length > 10) {
                titleText = cleanRowText;
              }
            }
            
            titleText = titleText
              .replace(/[\n\t\r]/g, " ")
              .replace(/\s+/g, " ")
              .trim();
              
            if (titleText.length > 15) {
              // Attempt to parse date within the table row
              const dateRegex = /(\d{1,2})[-/.](\d{1,2}|[a-zA-Z]{3,9})[-/.](\d{2,4})/;
              const dateMatch = dateRegex.exec(rowHtml);
              let noticeDate = "";
              
              if (dateMatch) {
                noticeDate = dateMatch[0].trim();
              } else {
                const today = new Date();
                noticeDate = today.toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' });
              }
              
              const fullLink = fileUrl.startsWith("http") 
                ? fileUrl 
                : `https://beu-bih.ac.in/${fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl}`;
              
              // Categorize
              let category = "Academic";
              const lowerTitle = titleText.toLowerCase();
              if (lowerTitle.includes("exam") || lowerTitle.includes("result") || lowerTitle.includes("fee") || lowerTitle.includes("practical")) {
                category = "Exam";
              } else if (lowerTitle.includes("holiday") || lowerTitle.includes("tender") || lowerTitle.includes("meeting") || lowerTitle.includes("vacation")) {
                category = "General";
              }
              
              noticesList.push({
                id: `scraped-beu-${count}`,
                title: titleText,
                content: `This is an official notice scraped directly from the Bihar Engineering University (BEU) notifications panel. Please open the official circular document for full guidelines, schedule details, and signatures.`,
                date: noticeDate,
                link: fullLink,
                category: category
              });
              count++;
            }
          }
        }
        
        // Strategy B: Anchor fallback (if row-based strategy yielded nothing)
        if (noticesList.length === 0) {
          const anchorRegex = /<a[^>]+href=["']([^"']*(?:\.pdf|Notification|Notice|circular|Exam)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
          let anchorMatch;
          let count = 0;
          while ((anchorMatch = anchorRegex.exec(html)) !== null && count < 15) {
            const fileUrl = anchorMatch[1];
            const titleText = anchorMatch[2].replace(/<[^>]+>/g, "").replace(/[\n\t\r]/g, " ").replace(/\s+/g, " ").trim();
            
            if (titleText.length > 20 && !/download|click|view|here|pdf/i.test(titleText)) {
              const fullLink = fileUrl.startsWith("http") 
                ? fileUrl 
                : `https://beu-bih.ac.in/${fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl}`;
              
              let category = "Academic";
              const lowerTitle = titleText.toLowerCase();
              if (lowerTitle.includes("exam") || lowerTitle.includes("result") || lowerTitle.includes("fee") || lowerTitle.includes("practical")) {
                category = "Exam";
              } else if (lowerTitle.includes("holiday") || lowerTitle.includes("tender") || lowerTitle.includes("meeting") || lowerTitle.includes("vacation")) {
                category = "General";
              }
              
              noticesList.push({
                id: `scraped-beu-fb-${count}`,
                title: titleText,
                content: `Official announcement published on the BEU notification platform. Check the circular link to read the complete notification.`,
                date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' }),
                link: fullLink,
                category: category
              });
              count++;
            }
          }
        }
        
        // Remove duplicate items
        const uniqueNotices = noticesList.filter((notice, index, self) =>
          index === self.findIndex((n) => n.title.toLowerCase() === notice.title.toLowerCase())
        );

        if (uniqueNotices.length > 0) {
          return res.json({ notices: [...uniqueNotices, ...fallbackNotices], source: "live" });
        }
      } catch (err) {
        console.log("BEU Notification scraper skipped/failed:", err);
      }

      res.json({ notices: fallbackNotices, source: "fallback" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to load notices" });
    }
  });

  // Server-side proxy for emulating BEU portal with device headers and asset mapping
  app.use("/api/beu-proxy", async (req, res) => {
    // Check mode (desktop or mobile)
    const mode = req.query.mode === "mobile" ? "mobile" : "desktop";
    const userAgent = mode === "mobile"
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
      : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    // Build the target URL for Bihar Engineering University server
    let targetPath = req.path;
    if (targetPath === "/" || targetPath === "") {
      const page = req.query.page || "result-one";
      targetPath = `/${page}`;
    }

    // Build the query string dynamically, preserving parameters while stripping out app-specific routing parameters
    const queryParams = new URLSearchParams();
    for (const [key, val] of Object.entries(req.query)) {
      if (key !== "mode" && key !== "v") {
        queryParams.append(key, String(val));
      }
    }
    const queryString = queryParams.toString();
    const targetUrl = `https://beu-bih.ac.in${targetPath}${queryString ? "?" + queryString : ""}`;

    // Clean up request headers before forwarding - use a minimal safe set to prevent remote crashes (e.g. cookie parsing, or cloud WAF block)
    const headers: Record<string, string> = {};
    const allowedHeaders = [
      "accept", "accept-language", "content-type", "content-length", "user-agent",
      "sec-ch-ua", "sec-ch-ua-mobile", "sec-ch-ua-platform", "sec-fetch-dest", "sec-fetch-mode", "sec-fetch-site"
    ];
    
    allowedHeaders.forEach((key) => {
      if (req.headers[key] !== undefined) {
        headers[key] = String(req.headers[key]);
      }
    });

    // Set referer and origin to point to the university itself so WAF/CSRF protection doesn't block us
    headers["referer"] = "https://beu-bih.ac.in/result-one";
    headers["origin"] = "https://beu-bih.ac.in";
    headers["host"] = "beu-bih.ac.in";
    
    // Request plain uncompressed content so we can parse and rewrite URLs
    headers["accept-encoding"] = "identity";
    headers["user-agent"] = userAgent;

    // Handle POST body serialization and length calculation BEFORE sending request
    let bodyData: string | Buffer | null = null;
    const reqContentType = req.headers["content-type"] || "";
    const method = req.method.toUpperCase();
    
    if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
      if (req.body && Object.keys(req.body).length > 0) {
        if (reqContentType.includes("application/x-www-form-urlencoded")) {
          bodyData = new URLSearchParams(req.body as any).toString();
        } else if (reqContentType.includes("application/json")) {
          bodyData = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        } else {
          bodyData = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        }
        headers["content-length"] = Buffer.byteLength(bodyData).toString();
      }
    }

    const options = {
      method: req.method,
      rejectUnauthorized: false,
      headers: headers,
      timeout: 25000
    };

    try {
      const isHttps = targetUrl.startsWith("https");
      const targetModule = isHttps ? https : http;

      const clientRequest = targetModule.request(targetUrl, options, (resTarget) => {
        // Handle redirect
        if (resTarget.statusCode && resTarget.statusCode >= 300 && resTarget.statusCode < 400 && resTarget.headers.location) {
          let redirectLocation = resTarget.headers.location;
          
          if (!redirectLocation.startsWith("http")) {
            redirectLocation = new URL(redirectLocation, `https://beu-bih.ac.in`).toString();
          }

          try {
            const parsedUrl = new URL(redirectLocation);
            if (parsedUrl.hostname === "beu-bih.ac.in") {
              // Stay inside the secure proxy routing
              redirectLocation = `/api/beu-proxy${parsedUrl.pathname}${parsedUrl.search}`;
            }
          } catch (_) {}

          res.writeHead(resTarget.statusCode, {
            "Location": redirectLocation,
            "X-Frame-Options": "ALLOWALL",
            "Content-Security-Policy": "frame-ancestors *"
          });
          res.end();
          return;
        }

        const contentType = resTarget.headers["content-type"] || "";
        const lowerContentType = contentType.toLowerCase();
        const isHtml = lowerContentType.includes("text/html");
        const isJs = lowerContentType.includes("javascript") || lowerContentType.includes("application/x-javascript");
        const isCss = lowerContentType.includes("text/css");
        const isJson = lowerContentType.includes("application/json");
        const isRewriteType = isHtml || isJs || isCss || isJson;

        // Set response headers, skipping original safety restrictors to permit embedding in iframe
        Object.keys(resTarget.headers).forEach((key) => {
          const lowerKey = key.toLowerCase();
          if (
            lowerKey !== "x-frame-options" &&
            lowerKey !== "content-security-policy" &&
            lowerKey !== "content-security-policy-report-only" &&
            lowerKey !== "cross-origin-resource-policy" &&
            lowerKey !== "cross-origin-embedder-policy" &&
            !(lowerKey === "content-length" && isRewriteType) // Don't copy Content-Length if we are rewriting
          ) {
            res.setHeader(key, resTarget.headers[key]!);
          }
        });

        // Inject headers to allow iframe rendering
        res.setHeader("X-Frame-Options", "ALLOWALL");
        res.setHeader("Content-Security-Policy", "frame-ancestors *");

        if (isRewriteType) {
          let data = "";
          resTarget.on("data", (chunk) => {
            data += chunk;
          });
          resTarget.on("end", () => {
            let bodyStr = data;

            // Remove content-length header so Express can recalculate it correctly
            res.removeHeader("content-length");

            // 1. HTML Specific Rewriting
            if (isHtml) {
              const baseTag = `<base href="/api/beu-proxy/" />`;
              if (bodyStr.toLowerCase().includes("<head>")) {
                bodyStr = bodyStr.replace(/<head>/i, `<head>\n  ${baseTag}`);
              } else {
                bodyStr = `<head>\n  ${baseTag}\n</head>\n${bodyStr}`;
              }

              // Rewrite root-relative links/sources inside the HTML to point to the proxy
              bodyStr = bodyStr.replace(/(href|src|action|data-url)=(["'])\/([^\s"'>]+)\2/gi, (match, attr, quote, path) => {
                if (path.startsWith("api/") || path.startsWith("http")) {
                  return match;
                }
                return `${attr}=${quote}/api/beu-proxy/${path}${quote}`;
              });

              // Fallback unquoted attributes rewrite:
              bodyStr = bodyStr.replace(/(href|src|action|data-url)=\/([^\s"'>]+)/gi, (match, attr, path) => {
                if (path.startsWith("api/") || path.startsWith("http")) {
                  return match;
                }
                return `${attr}="/api/beu-proxy/${path}"`;
              });

              // Rewrite CSS urls starting with "/"
              bodyStr = bodyStr.replace(/url\(["']?\/([^\s"')]+)["']?\)/gi, "url('/api/beu-proxy/$1')");

              // Eliminate Frame-Busting scripts from running and breaking the layout
              bodyStr = bodyStr.replace(/top\.location\s*=/gi, "self.location =");
              bodyStr = bodyStr.replace(/parent\.location\s*=/gi, "self.location =");
              bodyStr = bodyStr.replace(/window\.top\s*=/gi, "window.self =");
              bodyStr = bodyStr.replace(/window\.parent\s*=/gi, "window.self =");
              bodyStr = bodyStr.replace(/if\s*\(\s*top\s*!==?\s*self\s*\)/gi, "if (false)");
              bodyStr = bodyStr.replace(/if\s*\(\s*self\s*!==?\s*top\s*\)/gi, "if (false)");
              bodyStr = bodyStr.replace(/if\s*\(\s*window\.top\s*!==?\s*window\.self\s*\)/gi, "if (false)");
              bodyStr = bodyStr.replace(/if\s*\(\s*window\.self\s*!==?\s*window\.top\s*\)/gi, "if (false)");
            }

            // 2. Global API Endpoints and hardcoded URL Rewriting (CORS bypass)
            // Replace absolute BEU URLs with relative paths pointing back to our proxy
            bodyStr = bodyStr.replace(/https?:\/\/beu-bih\.ac\.in\//gi, "/api/beu-proxy/");
            bodyStr = bodyStr.replace(/https?:\/\/beu-bih\.ac\.in/gi, "/api/beu-proxy");

            // 3. Javascript Specific Frame-Busting / Iframe Sandbox Bypass
            if (isJs) {
              bodyStr = bodyStr.replace(/window\.top\s*!==?\s*window\.self/gi, "false");
              bodyStr = bodyStr.replace(/window\.self\s*!==?\s*window\.top/gi, "false");
              bodyStr = bodyStr.replace(/top\s*!==?\s*self/gi, "false");
              bodyStr = bodyStr.replace(/self\s*!==?\s*top/gi, "false");
            }

            res.send(bodyStr);
          });
        } else {
          // For binary assets (styles, scripts, images, fonts), stream them directly
          resTarget.pipe(res);
        }
      });

      clientRequest.on("error", (err) => {
        console.error("Proxy connection error: ", err);
        res.status(500).send("Proxy connection failed");
      });

      clientRequest.on("timeout", () => {
        clientRequest.destroy();
        res.status(504).send("Proxy timeout");
      });

      // Write request body if present, else finish the request
      if (bodyData !== null) {
        clientRequest.write(bodyData);
        clientRequest.end();
      } else if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
        req.pipe(clientRequest);
      } else {
        clientRequest.end();
      }

    } catch (error) {
      console.error("Proxy exception: ", error);
      res.status(500).send("Proxy error exception");
    }
  });

  // Dynamic Sitemap.xml Feed
  app.get("/sitemap.xml", (req, res) => {
    res.header("Content-Type", "application/xml");
    const host = req.headers.host || "nexusbeu.vercel.app";
    const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
    const baseUrl = `${protocol}://${host}`;
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/syllabus</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/notes</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/pyqs</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/lectures</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/results</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/notices</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/sgpa</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/routine</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/sitemap</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
    res.send(sitemapXml.trim());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", async () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      
      // Auto-register webhook or fallback to long polling on startup
      try {
        console.log("[Auto-Webhook] Verification of Telegram Bot Pipeline started...");
        const { botToken, channelId, webhookUrl } = await getOrSeedTelegramConfig();
        if (botToken && channelId) {
          const isDev = process.env.NODE_ENV !== "production";
          if (isDev) {
            console.log("[Auto-Webhook] Detected DEVELOPMENT environment. Starting Long Polling Fallback...");
            const delRes = await callTelegram(botToken, "deleteWebhook", {});
            console.log("[Auto-Webhook] Telegram deleteWebhook response:", delRes);
            startPolling(botToken);
          } else {
            console.log(`[Auto-Webhook] Detected PRODUCTION environment. Registering Webhook to: ${webhookUrl}`);
            const result = await callTelegram(botToken, "setWebhook", { url: webhookUrl });
            console.log("[Auto-Webhook] Telegram setWebhook response:", result);
            if (result.ok) {
              console.log("[Auto-Webhook] Webhook registered successfully!");
            } else {
              console.error("[Auto-Webhook] Webhook registration failed:", result.description);
              console.log("[Auto-Webhook] Falling back to Long Polling...");
              await callTelegram(botToken, "deleteWebhook", {});
              startPolling(botToken);
            }
          }
        }
      } catch (e: any) {
        console.error("[Auto-Webhook] Critical exception during startup:", e.message);
      }
    });
  }
}

startServer();

export default app;
