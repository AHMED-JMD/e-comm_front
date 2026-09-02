import { readFileSync } from "fs";
import { basename, resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * The storefront and the dashboard are separate entry points of one project:
 * `index.html` is served on the apex host, `admin.html` on the admin subdomain.
 * Vite's dev/preview servers only know about paths, so this plugin does the
 * host-based routing that `vercel.json` does in production.
 */
function adminSubdomainRouter(adminSubdomain) {
  const rewriteAdminHtml = (req) => {
    const host = (req.headers.host || "").split(":")[0];
    const isAdminHost = host.startsWith(`${adminSubdomain}.`);
    const wantsHtml = (req.headers.accept || "").includes("text/html");

    // Only navigation requests are rewritten; module and asset requests must
    // still resolve to their real paths.
    if (isAdminHost && wantsHtml) {
      req.url = "/admin.html";
    }
  };

  return {
    name: "admin-subdomain-router",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewriteAdminHtml(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewriteAdminHtml(req);
        next();
      });
    },
  };
}

/**
 * Inlines the pre-boot loader (`src/boot/loader.{css,html}`) into both entry
 * points, so the branded veil paints on the first frame instead of waiting for
 * the React bundle. Kept as one shared partial rather than copy-pasted markup:
 * `index.html` and `admin.html` only differ by the caption under the wordmark.
 */
function brandLoader(captions) {
  const stylePath = resolve(__dirname, "src/boot/loader.css");
  const markupPath = resolve(__dirname, "src/boot/loader.html");

  return {
    name: "luma-brand-loader",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const entry = basename(ctx.filename || ctx.path || "");
        const caption = captions[entry];
        if (!caption) return html;

        const style = `<style data-luma-boot>\n${readFileSync(stylePath, "utf8")}</style>`;
        const markup = readFileSync(markupPath, "utf8").replace(
          "__LOADER_CAPTION__",
          caption,
        );

        return html
          .replace("</head>", `${style}\n  </head>`)
          .replace(/(<body[^>]*>)/i, `$1\n${markup}`);
      },
    },
    handleHotUpdate({ file, server }) {
      if (file === stylePath || file === markupPath) {
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminSubdomain = env.VITE_ADMIN_SUBDOMAIN || "admin";

  return {
    plugins: [
      react(),
      adminSubdomainRouter(adminSubdomain),
      brandLoader({
        "index.html": "منصة لوما الإلكترونية",
        "admin.html": "لوحة تحكم لُوما",
      }),
    ],
    server: {
      port: 3000,
      strictPort: false,
      open: true,
      // Lets `admin.localhost:3000` (and any custom dev domain) reach the server.
      host: true,
      allowedHosts: true,
    },
    preview: {
      port: 3000,
      host: true,
      allowedHosts: true,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          admin: resolve(__dirname, "admin.html"),
        },
      },
    },
  };
});
