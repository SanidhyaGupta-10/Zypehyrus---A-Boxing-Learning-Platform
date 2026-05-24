# Share App Preview via Local Tunnel

This directive explains how to generate a temporary public link for the boxing app so a remote client can preview it.

## Goal
To create a secure tunnel from your local development server to the public internet using Ngrok.

## Prerequisites
- Node.js and npm installed.
- A free Ngrok account (recommended for persistent tunnels).
- Your authtoken from [ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken).

## Steps

### 1. Set Up Your Ngrok Authtoken (One-time)
If you haven't done this before, run the following command in your terminal:
```bash
npx ngrok config add-authtoken <YOUR_AUTH_TOKEN>
```
*Note: Replace `<YOUR_AUTH_TOKEN>` with the token from your ngrok dashboard.*

### 2. Start the Share Script
We have created a helper file `share-app.bat` in the root directory. To use it:
1. Double-click `share-app.bat`.
2. This will open two windows:
   - One running the **Vite Development Server**.
   - One running the **Ngrok Tunnel**.
3. Look for the line that says `Forwarding` in the Ngrok window. It will look something like `https://a1b2-c3d4.ngrok-free.app`.
4. Copy that URL and send it to your client.

### 3. Closing the Preview
- To stop the preview, simply close both command prompt windows.
- The link will immediately stop working once the windows are closed.

## Troubleshooting
- **Link not working?** Ensure your local server is running on port 5173.
- **Vite Error?** Make sure you have run `npm install` first.
- **Ngrok Account?** Ngrok now requires a free account and an authtoken to use tunnels.
