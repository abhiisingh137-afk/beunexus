import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      const page = req.query.page || "notification";
      targetPath = `/${page}`;
    }

    const targetUrl = `https://beu-bih.ac.in${targetPath}`;

    const options = {
      rejectUnauthorized: false,
      headers: {
        "User-Agent": userAgent,
        "Accept": req.headers["accept"] || "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity" // Disable compression so we can edit HTML
      },
      timeout: 15000
    };

    try {
      const request = https.get(targetUrl, options, (resTarget) => {
        // Handle redirect
        if (resTarget.statusCode && resTarget.statusCode >= 300 && resTarget.statusCode < 400 && resTarget.headers.location) {
          const redirectUrl = resTarget.headers.location.startsWith("http")
            ? resTarget.headers.location
            : new URL(resTarget.headers.location, targetUrl).toString();
          
          https.get(redirectUrl, options, (redRes) => {
            const contentType = redRes.headers["content-type"] || "";
            if (contentType) {
              res.setHeader("Content-Type", contentType);
            }
            
            const isResponseHtml = contentType.includes("text/html");
            if (isResponseHtml) {
              let data = "";
              redRes.on("data", (chunk) => data += chunk);
              redRes.on("end", () => {
                let finalPath = targetPath;
                try {
                  const redirectPathname = new URL(redirectUrl).pathname;
                  if (redirectPathname) finalPath = redirectPathname;
                } catch (_) {}

                const baseTag = `<base href="/api/beu-proxy/" />`;
                if (data.toLowerCase().includes("<head>")) {
                  data = data.replace(/<head>/i, `<head>\n  ${baseTag}`);
                } else {
                  data = `<head>\n  ${baseTag}\n</head>\n${data}`;
                }
                res.setHeader("X-Frame-Options", "ALLOWALL");
                res.setHeader("Content-Security-Policy", "frame-ancestors *");
                res.send(data);
              });
            } else {
              redRes.pipe(res);
            }
          }).on("error", (e) => {
            console.error("Redirect proxy fetch error: ", e);
            res.status(500).send("Error fetching redirected resource");
          });
          return;
        }

        // Set response headers
        const contentType = resTarget.headers["content-type"] || "";
        if (contentType) {
          res.setHeader("Content-Type", contentType);
        }

        const isResponseHtml = contentType.includes("text/html");
        if (isResponseHtml) {
          let data = "";
          resTarget.on("data", (chunk) => data += chunk);
          resTarget.on("end", () => {
            const baseTag = `<base href="/api/beu-proxy/" />`;
            if (data.toLowerCase().includes("<head>")) {
              data = data.replace(/<head>/i, `<head>\n  ${baseTag}`);
            } else {
              data = `<head>\n  ${baseTag}\n</head>\n${data}`;
            }
            res.setHeader("X-Frame-Options", "ALLOWALL");
            res.setHeader("Content-Security-Policy", "frame-ancestors *");
            res.send(data);
          });
        } else {
          resTarget.pipe(res);
        }
      });

      request.on("error", (err) => {
        console.error("Proxy connection error: ", err);
        res.status(500).send("Proxy error");
      });

      request.on("timeout", () => {
        request.destroy();
        res.status(504).send("Proxy timeout");
      });

    } catch (error) {
      console.error("Proxy exception: ", error);
      res.status(500).send("Proxy error");
    }
  });

  // Dynamic Sitemap.xml Feed
  app.get("/sitemap.xml", (req, res) => {
    res.header("Content-Type", "application/xml");
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nexusbeu.org/</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/syllabus</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/notes</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/pyqs</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/lectures</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/results</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/notices</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/sgpa</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/routine</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/about</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/privacy</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/contact</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://nexusbeu.org/sitemap</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
    res.send(sitemapXml);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
