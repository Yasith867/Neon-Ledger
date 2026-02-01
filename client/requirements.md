## Packages
ethers | Blockchain interaction
@neondatabase/serverless | Direct serverless Postgres connection
framer-motion | Smooth animations
date-fns | Date formatting
clsx | Class utility
tailwind-merge | Class merging
lucide-react | Icons

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["'Inter'", "sans-serif"],
  mono: ["'JetBrains Mono'", "monospace"],
}
Colors:
Background: #0B0F14 (Deep dark blue/black)
Cards: #121826 (Slightly lighter dark blue)
Primary: #8B5CF6 (Purple)
Secondary: #22D3EE (Cyan)

App is frontend-only.
Database connection via VITE_DATABASE_URL environment variable.
Blockchain connection to Polygon Amoy.
