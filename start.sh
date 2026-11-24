#!/bin/bash
# GirlfriendGPT - Start script for Unix/Linux/Mac

echo "========================================"
echo "   GirlfriendGPT - Starting System    "
echo "========================================"
echo

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Check for and stop any existing processes on port 3000
echo -e "${YELLOW}Checking for existing processes...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping existing process on port 3000...${NC}"
    kill -9 $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null
    sleep 2
fi

echo
echo -e "${GREEN}Starting GirlfriendGPT...${NC}"
echo

# Set environment variables
export NODE_ENV=development
export NEXT_TELEMETRY_DISABLED=1

# Start the Next.js dev server
echo -e "${GREEN}[1/2] Starting Next.js development server...${NC}"
npm run dev > logs/next-dev.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to initialize..."
sleep 8

# Open browser automatically
echo
echo -e "${GREEN}[2/2] Opening browser...${NC}"
echo

# Function to open browser
open_browser() {
    local url="http://localhost:3000"
    
    # Try Chrome
    if command -v google-chrome &> /dev/null; then
        echo -e "${CYAN}Opening in Chrome...${NC}"
        google-chrome --new-window "$url" --auto-open-devtools-for-tabs 2>/dev/null &
        return 0
    fi
    
    # Try Chromium
    if command -v chromium-browser &> /dev/null; then
        echo -e "${CYAN}Opening in Chromium...${NC}"
        chromium-browser --new-window "$url" --auto-open-devtools-for-tabs 2>/dev/null &
        return 0
    fi
    
    # Try Chromium
    if command -v chromium &> /dev/null; then
        echo -e "${CYAN}Opening in Chromium...${NC}"
        chromium --new-window "$url" --auto-open-devtools-for-tabs 2>/dev/null &
        return 0
    fi
    
    # Try Firefox
    if command -v firefox &> /dev/null; then
        echo -e "${CYAN}Opening in Firefox...${NC}"
        firefox "$url" 2>/dev/null &
        return 0
    fi
    
    # Try Safari (Mac)
    if command -v safari &> /dev/null; then
        echo -e "${CYAN}Opening in Safari...${NC}"
        safari "$url" 2>/dev/null &
        return 0
    fi
    
    # Use xdg-open (Linux)
    if command -v xdg-open &> /dev/null; then
        echo -e "${CYAN}Opening in default browser...${NC}"
        xdg-open "$url" 2>/dev/null &
        return 0
    fi
    
    return 1
}

if open_browser; then
    : # Success
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo
echo "========================================"
echo -e "${GREEN}     System Started Successfully!     ${NC}"
echo "========================================"
echo
echo -e "Frontend: \033[1mhttp://localhost:3000\033[0m"
echo
echo -e "Logs: logs/"
echo
echo -e "${YELLOW}Press Ctrl+C to stop the server(s)${NC}"
echo

# Function to handle exit
cleanup() {
    echo
    echo -e "${YELLOW}Stopping server...${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Set trap for Ctrl+C
trap cleanup SIGINT SIGTERM

# Monitor server
while true; do
    sleep 10
    if ! ps -p $SERVER_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}Server process died. Check logs/next-dev.log for details.${NC}"
        exit 1
    fi
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Server is running..."
done