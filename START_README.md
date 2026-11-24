# GirlfriendGPT Start Scripts

This project includes multiple start scripts for different operating systems.

## 🚀 Quick Start

### Windows

#### Option 1: Command Prompt (Recommended)
```cmd
start.bat
```

#### Option 2: PowerShell
```powershell
.\start.ps1
```

**Note:** If you get an execution policy error on PowerShell, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Linux / macOS

```bash
chmod +x start.sh
./start.sh
```

---

## 📋 What the Scripts Do

1. **Install Dependencies** - Automatically runs `npm install` if `node_modules` is missing
2. **Port Check** - Kills any existing processes on port 3000
3. **Start Dev Server** - Runs `npm run dev` in a separate process
4. **Open Browser** - Automatically opens Chrome, Edge, Brave, or default browser
5. **Monitor Status** - Shows server status every 10 seconds

---

## 📁 Log Files

All output is logged to the `logs/` directory:
- `next-dev.log` - Next.js development server output

---

## 🛠️ Manual Start (Alternative)

If you prefer to start components separately:

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: (Optional) Run database migration
npm run db:push

# Open in browser
http://localhost:3000
```

---

## ⚙️ Configuration

The scripts use these environment variables:
- `NODE_ENV=development`
- `NEXT_TELEMETRY_DISABLED=1`

---

## 🐛 Troubleshooting

### Port in Use
The scripts automatically detect and kill processes using port 3000. If issues persist:
```cmd
taskkill /F /IM node.exe
```

### Browser Not Opening
If the browser doesn't open automatically, navigate to:
```
http://localhost:3000
```

### 3D Performance Issues
On older machines, the 3D effects may cause performance issues. Open browser DevTools and disable WebGL if needed.

---

## 📝 Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Modern browser with WebGL support (Chrome, Edge, Firefox, Brave)
- Optional: Chrome/Edge/Brave for automatic DevTools opening