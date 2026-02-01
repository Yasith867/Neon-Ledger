## Packages
ethers | Blockchain interaction
@neondatabase/serverless | Direct serverless Postgres connection
framer-motion | Smooth animations
date-fns | Date formatting
clsx | Class name utilities
tailwind-merge | Class merging

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["'Inter'", "sans-serif"],
  mono: ["'JetBrains Mono'", "monospace"],
}
Colors:
Background: #0B0F14
Cards: #121826
Borders: #1F2937
Primary: #8B5CF6
Secondary: #22D3EE

App is frontend-only.
Database connection via VITE_DATABASE_URL environment variable.
Blockchain connection to Polygon Amoy.
