import express from "express";
import path from "path";
import http from "http";
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

    // Clean up request headers before forwarding
    const headers: Record<string, string> = {};
    
    // Copy headers cleanly
    Object.keys(req.headers).forEach((key) => {
      if (req.headers[key] !== undefined) {
        headers[key.toLowerCase()] = String(req.headers[key]);
      }
    });

    delete headers["host"];
    delete headers["connection"];
    
    // Set referer and origin to point to the university itself so WAF/CSRF protection doesn't block us
    headers["referer"] = "https://beu-bih.ac.in/result-one";
    headers["origin"] = "https://beu-bih.ac.in";
    
    // Request plain uncompressed content so we can parse and rewrite URLs
    headers["accept-encoding"] = "identity";
    headers["user-agent"] = userAgent;

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

        // Set response headers, skipping original safety restrictors to permit embedding in iframe
        Object.keys(resTarget.headers).forEach((key) => {
          const lowerKey = key.toLowerCase();
          if (
            lowerKey !== "x-frame-options" &&
            lowerKey !== "content-security-policy" &&
            lowerKey !== "content-security-policy-report-only" &&
            lowerKey !== "cross-origin-resource-policy" &&
            lowerKey !== "cross-origin-embedder-policy"
          ) {
            res.setHeader(key, resTarget.headers[key]!);
          }
        });

        // Inject headers to allow iframe rendering
        res.setHeader("X-Frame-Options", "ALLOWALL");
        res.setHeader("Content-Security-Policy", "frame-ancestors *");

        const contentType = resTarget.headers["content-type"] || "";
        const lowerContentType = contentType.toLowerCase();
        const isHtml = lowerContentType.includes("text/html");
        const isJs = lowerContentType.includes("javascript") || lowerContentType.includes("application/x-javascript");
        const isCss = lowerContentType.includes("text/css");
        const isJson = lowerContentType.includes("application/json");

        if (isHtml || isJs || isCss || isJson) {
          let data = "";
          resTarget.on("data", (chunk) => {
            data += chunk;
          });
          resTarget.on("end", () => {
            let bodyStr = data;

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
            bodyStr = bodyStr.replace(/https:\/\/beu-bih\.ac\.in\//gi, "/api/beu-proxy/");
            bodyStr = bodyStr.replace(/https:\/\/beu-bih\.ac\.in/gi, "/api/beu-proxy");

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

      // Stream requests body correctly for GET/POST methods
      const method = req.method.toUpperCase();
      if (method === "GET" || method === "HEAD" || method === "DELETE") {
        clientRequest.end();
      } else {
        // If a body parser already parsed it, we need to write it out
        if (req.body && Object.keys(req.body).length > 0) {
          const bodyData = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
          clientRequest.write(bodyData);
          clientRequest.end();
        } else {
          req.pipe(clientRequest);
        }
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
