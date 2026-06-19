/** @type {import('next').NextConfig} */

// On GitHub Pages a project site is served under /<repo>, so assets need that prefix.
// The deploy workflow sets GITHUB_PAGES=true; local dev/build leaves paths at root.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "rwa-solana-dashboard";

const nextConfig = {
  reactStrictMode: true,
  output: "export", // static HTML export to ./out (no server needed)
  trailingSlash: true, // /issuers -> /issuers/index.html, plays well with Pages
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
};

export default nextConfig;
