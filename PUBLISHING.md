# Pickleball Team Flow - App Store Publishing Guide

Your PWA is now configured for publishing to both iOS App Store and Google Play Store!

## Project Structure

- `www/` - Your web app files (copied from root)
- `android/` - Android native project
- `ios/` - iOS native project (requires Mac to build)

## Development Workflow

### Making Changes to Your App

1. Edit your files in the root directory (`default.html`, `service-worker.js`, etc.)
2. Run `npm run sync` to copy changes to both platforms
3. Test on Android/iOS

### Quick Commands

```bash
# Copy web files and sync to both platforms
npm run sync

# Open Android Studio to build/run Android app
npm run android

# Open Xcode to build/run iOS app (Mac only)
npm run ios

# Sync only Android
npm run build:android

# Sync only iOS
npm run build:ios
```

## Publishing to Google Play Store

### Prerequisites
- Google Play Developer account ($25 one-time fee)
- Android Studio installed

### Steps

1. **Open Android Studio**
   ```bash
   npm run android
   ```

2. **Configure App Signing**
   - In Android Studio, go to Build → Generate Signed Bundle/APK
   - Create a new keystore (save it securely!)
   - Fill in keystore details

3. **Update App Details**
   - Edit `android/app/src/main/res/values/strings.xml` for app name
   - Edit `capacitor.config.json` to change `appId` if needed
   - Update version in `android/app/build.gradle`

4. **Build Release APK/AAB**
   - Build → Generate Signed Bundle/APK
   - Choose "Android App Bundle" (recommended)
   - Select "release" variant
   - Sign with your keystore

5. **Upload to Google Play Console**
   - Go to https://play.google.com/console
   - Create new app
   - Upload the AAB file
   - Fill in store listing, screenshots, etc.
   - Submit for review

## Publishing to iOS App Store

### Prerequisites
- Apple Developer account ($99/year)
- Mac with Xcode installed
- Valid Developer Certificate and Provisioning Profile

### Steps

1. **Open Xcode (on Mac)**
   ```bash
   npm run ios
   ```

2. **Configure Signing**
   - In Xcode, select the "App" target
   - Go to "Signing & Capabilities"
   - Select your Team
   - Xcode will automatically manage provisioning

3. **Update App Details**
   - Edit `ios/App/App/Info.plist` for display name, version
   - Update Bundle Identifier if needed (must match Apple Developer portal)

4. **Add App Icons**
   - The PNG icons are already configured
   - Xcode may require additional icon sizes in the asset catalog

5. **Build and Archive**
   - Product → Archive
   - Once archived, click "Distribute App"
   - Choose "App Store Connect"
   - Follow the wizard to upload

6. **Submit via App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Fill in app metadata, screenshots, description
   - Submit for review

## Testing Before Publishing

### Android
- Use Android Studio's built-in emulator or connect a physical device
- Click the "Run" button in Android Studio

### iOS
- Use Xcode's simulator or connect a physical iOS device
- Click the "Run" button in Xcode

## Important Notes

- **App IDs**: Change `com.pickleballteamflow.app` in `capacitor.config.json` to your own unique ID
- **Icons**: PNG icons are already created and configured
- **Permissions**: Add any needed permissions to `AndroidManifest.xml` or `Info.plist`
- **Version Numbers**: Update version in both `android/app/build.gradle` and `ios/App/App.xcodeproj` before each release

## Requirements Checklist

### Google Play Store
- ✅ PNG icons (192x192, 512x512)
- ✅ Android project created
- ⬜ Google Play Developer account
- ⬜ App screenshots (minimum 2)
- ⬜ Feature graphic (1024x500)
- ⬜ Privacy policy URL (if app collects data)

### iOS App Store
- ✅ PNG icons
- ✅ iOS project created
- ⬜ Apple Developer account
- ⬜ Mac with Xcode
- ⬜ App screenshots for all required device sizes
- ⬜ Privacy policy URL (if app collects data)

## Support

- Capacitor Docs: https://capacitorjs.com/docs
- Android Publishing: https://developer.android.com/studio/publish
- iOS Publishing: https://developer.apple.com/app-store/submissions/
