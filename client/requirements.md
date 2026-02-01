## Packages
ethers | Blockchain interaction library
@neondatabase/serverless | Direct serverless Postgres connection from browser
framer-motion | Smooth animations for the feed

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
This app runs entirely in the browser.
It connects to Polygon Amoy testnet via ethers.js.
It connects to Neon Postgres via @neondatabase/serverless using VITE_DATABASE_URL.
