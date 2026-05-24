# 🤖 ZEPHYR APK Build Instructions (AI-Automated Workflow)

This document provides a comprehensive, step-by-step guide to building the **ZEPHYR Boxing App** into an Android APK. It is designed to be parsed and executed by AI agents or developers using a headless terminal environment.

---

## 🛠 1. Prerequisites (Environment Setup)

Before running any commands, ensure the following are installed and configured in the system's PATH:

1.  **Node.js (v18+):** Required for building the web assets and running Capacitor.
2.  **JDK 17:** Android Gradle requires Java Development Kit 17 (or newer).
3.  **Android SDK:** Specifically `build-tools`, `platform-tools`, and `platforms;android-34` (or latest).
4.  **Environment Variables:**
    - `JAVA_HOME`: Path to your JDK installation.
    - `ANDROID_HOME`: Path to your Android SDK folder.
    - `PATH`: Must include `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\cmdline-tools\latest\bin`.

---

## 🏗 2. Core Build Workflow (The "Quick-Build")

Run these commands in order from the project root (`e:\boxing app\app project`):

### Step A: Clean & Install Dependencies
Reset the environment to ensure no version conflicts.
```powershell
npm install
```

### Step B: Build Web Assets
Compile the Vanilla JS/HTML/CSS into the optimized `dist/` folder using Vite.
```powershell
npm run build
```

### Step C: Sync Capacitor
Copy the build assets into the Android native project and update any plugins.
```powershell
npx cap sync android
```

### Step D: Compile the APK (Debug Mode)
Use Gradle to build the APK directly from the terminal without opening Android Studio.
```powershell
cd android
./gradlew assembleDebug
```

---

## 📦 3. Locating the Output
Once the build completes, the APK file will be located at:
`[Project Root]\android\app\build\outputs\apk\debug\app-debug.apk`

---

## 🔐 4. Production / Signed APK (For Distribution)

To build a Release APK that can be uploaded to a phone or store:

### Step 1: Generate Keystore (One-time only)
If you don't have a keystore file, generate one:
```powershell
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### Step 2: Build Release Bundle
```powershell
cd android
./gradlew assembleRelease
```
*Note: This generates an unsigned APK at `android\app\build\outputs\apk\release\app-release-unsigned.apk`.*

### Step 3: Sign the APK
```powershell
apksigner sign --ks my-release-key.jks --out ZEPHYR-v1-Final.apk android\app\build\outputs\apk\release\app-release-unsigned.apk
```

---

## 🛠 5. Adding New Permissions (Camera, Bio, etc.)

If you add a feature that requires a new permission (e.g., Biometrics, Bluetooth):

1.  **Edit AndroidManifest.xml**: Open `android/app/src/main/AndroidManifest.xml`.
2.  **Add Usage Permission**: Add `<uses-permission android:name="android.permission.YOUR_PERMISSION" />` inside the `<manifest>` tag.
3.  **App Permissions**: In Capacitor, you may also need to prompt the user in JavaScript using the `Permissions` plugin.

---

## 🐞 6. Troubleshooting & AI Logic

### Common Issue: "dist" folder not found
**Cause:** `npm run build` failed or was skipped.
**Fix:** Run `npm run build` and ensure `capacitor.config.json` has `"webDir": "dist"`.

### Common Issue: Gradle Sync Fail
**Cause:** Missing JDK or Android SDK mismatch.
**Fix:** Update `android/variables.gradle` to match the installed SDK version and ensure `JAVA_HOME` is set.

### AI Context for building:
- **Build Tool:** Vite
- **Native Bridge:** Capacitor 8.x
- **App ID:** `com.zephyr.boxing`
- **Permissions:** Already configured for Camera, Audio, and Internet in `AndroidManifest.xml`.
- **Z-Index Notice:** If UI elements are hidden in the APK, check `style.css` for high z-index overrides (Standard is 200,000+ for nav).

---

## 🚀 6. Automation Script (Batch)

For one-click builds, use this logic in a `.bat` file:
```batch
@echo off
echo [1/4] Building Web Assets...
call npm run build
echo [2/4] Syncing Capacitor...
call npx cap sync android
echo [3/4] Compiling APK...
cd android
call gradlew assembleDebug
echo [4/4] Done! APK is in android\app\build\outputs\apk\debug\
pause
```
