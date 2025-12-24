# Android Keystore Setup Guide

## ✅ What's Already Done

- ✅ Keystore file created: `android/app/my-release-key.keystore`
- ✅ Build configuration updated to use release keystore
- ✅ `.gitignore` updated to exclude sensitive keystore properties

## 📋 What You Need to Provide

To complete the keystore setup, I need the following information from when you created the keystore:

1. **Keystore Password** - The password you used when creating the keystore file
2. **Key Alias** - The alias name you used for the key (usually something like "my-key-alias" or "release-key")
3. **Key Password** - The password for the specific key (can be same as keystore password or different)

## 🔧 Setup Steps

1. **Create `keystore.properties` file** in the `android/` directory:

```bash
cd android
cp keystore.properties.example keystore.properties
```

2. **Edit `keystore.properties`** and fill in your actual values:

```properties
storeFile=my-release-key.keystore
storePassword=YOUR_KEYSTORE_PASSWORD_HERE
keyAlias=YOUR_KEY_ALIAS_HERE
keyPassword=YOUR_KEY_PASSWORD_HERE
```

3. **Verify the keystore file location** - The file should be at:
   - `android/app/my-release-key.keystore` ✅ (already exists)

## 🔍 If You Don't Remember the Details

If you don't remember the keystore details, you can check them using:

```bash
keytool -list -v -keystore android/app/my-release-key.keystore
```

This will prompt for the keystore password and show you:

- The keystore information
- All key aliases in the keystore
- Key creation date

## ⚠️ Important Security Notes

- **NEVER commit `keystore.properties` to git** (already in `.gitignore`)
- **Keep your keystore file safe** - If you lose it, you won't be able to update your app on Google Play
- **Store keystore credentials securely** - Consider using a password manager
- **Backup your keystore** - Store it in a secure location (encrypted cloud storage, etc.)

## 🚀 Testing the Setup

After creating `keystore.properties`, you can test the release build:

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## 📝 Example keystore.properties

```properties
storeFile=my-release-key.keystore
storePassword=MySecurePassword123!
keyAlias=breathwork-release-key
keyPassword=MySecurePassword123!
```

---

**Once you provide the keystore details, I can help you create the `keystore.properties` file!**
