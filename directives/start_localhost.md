# Start Local Development Server

This directive explains how to start the local development server for the Boxing App.

## Goal
Start a local server that serves the application files and allows for real-time development and testing.

## Prerequisites
- Node.js and npm installed.
- Dependencies installed (`npm install`).

## Steps

### 1. Using the Batch File (Recommended for Windows)
Double-click the `start-app.bat` file in the project root. This file runs the necessary command to start the Vite development server.

### 2. Using the Command Line
Run the following command in the project root:
```bash
npm run dev
```
Alternatively, to expose the server to your local network (e.g., to test on a mobile phone):
```bash
npm run dev -- --host
```

## Expected Output
The terminal will display the local URL, typically `http://localhost:5173/`.

## Troubleshooting
- **Port already in use**: If port 5173 is busy, Vite will automatically try the next available port (e.g., 5174).
- **Scripts disabled**: If you get a security error in PowerShell, try running the command through CMD or using `npm.cmd`.
