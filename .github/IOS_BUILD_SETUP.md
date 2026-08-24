# GitHub Actions iOS Build Setup

This project includes a GitHub Actions workflow that builds iOS `.ipa` files on macOS runners.

## Required GitHub Secrets

Add these secrets at: `https://github.com/marco-rodriguez59/pickleballteamflow/settings/secrets/actions`

### 1. BUILD_CERTIFICATE_BASE64
Your iOS Distribution Certificate (.p12 file) encoded in base64.

**How to get it:**
1. On a Mac, open Keychain Access
2. Find your "Apple Distribution" or "iOS Distribution" certificate
3. Right-click → Export → Save as .p12 with a password
4. Encode: `base64 -i YourCertificate.p12 | pbcopy`
5. Paste the base64 string as the secret value

**Alternative:** Download from [Apple Developer Portal](https://developer.apple.com/account/resources/certificates)

### 2. P12_PASSWORD
The password you set when exporting the .p12 certificate.

### 3. KEYCHAIN_PASSWORD
Any secure password for the temporary keychain (used during build).
Example: `TempKeychain2024!`

### 4. PROVISIONING_PROFILE_BASE64
Your iOS Provisioning Profile (.mobileprovision file) encoded in base64.

**How to get it:**
1. Download from [Apple Developer Portal](https://developer.apple.com/account/resources/profiles)
2. Choose "App Store" or "Ad Hoc" profile for your app
3. Encode: `base64 -i YourProfile.mobileprovision | pbcopy`
4. Paste the base64 string as the secret value

### 5. APPLE_TEAM_ID
Your Apple Developer Team ID (10-character string).

**How to find it:**
- Go to [Apple Developer](https://developer.apple.com/account)
- Click "Membership" in the sidebar
- Copy the Team ID (e.g., `ABC123XYZ4`)

### 6. APPLEID_USERNAME (Optional - for TestFlight upload)
Your Apple ID email address (e.g., `you@example.com`)

### 7. APPLEID_APP_PASSWORD (Optional - for TestFlight upload)
App-specific password for your Apple ID.

**How to create:**
1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in
3. Security → App-Specific Passwords
4. Generate a new password
5. Copy and save as secret

## Usage

### Automatic Build (on push)
Push to `master` branch and the workflow runs automatically:
```bash
git add .
git commit -m "Update app"
git push
```

### Manual Build
1. Go to Actions tab: `https://github.com/marco-rodriguez59/pickleballteamflow/actions`
2. Select "Build iOS App" workflow
3. Click "Run workflow" button
4. Select branch and click "Run workflow"

### Download IPA
1. Go to the completed workflow run
2. Scroll to "Artifacts" section at the bottom
3. Download "PickleballTeamFlow-iOS.zip"
4. Extract to get the `.ipa` file

## What the Workflow Does

1. ✅ Checks out your code
2. ✅ Installs Node.js and dependencies
3. ✅ Builds your Vue/Vite web app
4. ✅ Syncs to iOS Capacitor project
5. ✅ Sets up Xcode 16 with iOS 26 SDK
6. ✅ Imports code signing certificates
7. ✅ Builds and archives the iOS app
8. ✅ Exports .ipa file
9. ✅ Uploads .ipa as downloadable artifact
10. ✅ (Optional) Uploads directly to TestFlight

## Troubleshooting

### Build fails with "No signing certificate"
- Verify `BUILD_CERTIFICATE_BASE64` is set correctly
- Ensure certificate is valid and not expired
- Check that `P12_PASSWORD` is correct

### Build fails with "No provisioning profile"
- Verify `PROVISIONING_PROFILE_BASE64` is set correctly
- Ensure profile matches your app's Bundle ID
- Check that profile hasn't expired

### TestFlight upload fails
- Verify `APPLEID_USERNAME` and `APPLEID_APP_PASSWORD` are correct
- Ensure app is registered in App Store Connect
- Check that version/build number hasn't been used before

## Next Steps

1. ✅ Add all required secrets to GitHub
2. ✅ Push this workflow file to GitHub
3. ✅ Trigger a build (automatic or manual)
4. ✅ Download the .ipa artifact
5. ✅ Test on TestFlight or submit to App Store

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Apple Developer Portal](https://developer.apple.com/account)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
