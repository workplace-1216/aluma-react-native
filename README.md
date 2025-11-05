# BreathWork Mobile App

**Brief description:**
BreathWork is a cross-platform React Native application that connects users with the BreathWork backend. It provides tools for mood tracking, guided breathing exercises, and personal wellness management — available on both Android and iOS.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Installation](#installation)
* [Usage](#usage)
* [Platform Setup](#platform-setup)

  * [Android Setup](#android-setup)
  * [iOS Setup](#ios-setup)
* [Configuration](#configuration)
* [Building & Release](#building--release)

  * [Android Release Build](#android-release-build)
  * [iOS Release Build](#ios-release-build)
* [Acknowledgements](#acknowledgements)

---

## Project Overview

BreathWork mobile app empowers users on their wellness journey by connecting to the backend’s role-based system, delivering features like mood logging, breathing exercise libraries, and notification management within a responsive and intuitive interface.

### Key Features

* **Cross-Platform Support:** Native-like experience on Android and iOS.
* **Mood Tracking:** Intuitive mood input and progress visualization.
* **Breathing Exercises:** Collection of guided routines.
* **Offline Persistence:** Local storage via AsyncStorage and Redux-Persist.
* **Navigation:** Seamless app flow with React Navigation.
* **State Management:** Scalable state architecture using Redux Toolkit.
* **Responsive UI:** Dynamic layouts with `react-native-responsive-screens`.
* **Secure API Integration:** Fast and secure communication via Axios.

---

## Installation

### Prerequisites

* **Node.js (>=18):** [Download](https://nodejs.org/en/download/)
* **Yarn (optional):** `npm install -g yarn`
* **React Native CLI:** Follow official [React Native CLI setup guide](https://reactnative.dev/docs/environment-setup) (important for native builds)
* **Xcode (macOS only):** Required for iOS builds.
* **Android Studio:** Required for Android emulator, build tools, and SDKs.

### Steps to Install

```bash
git clone https://github.com/yourusername/breathwork-mobile.git
cd breathwork-mobile
npm install        # or yarn install
```

---

## Usage

### Start Development Server

```bash
npm start          # or yarn start
```

### Run on Android

```bash
npm run android    # or yarn android
```

### Run on iOS (macOS only)

```bash
npm run ios        # or yarn ios
```

---

## Platform Setup

### Android Setup

#### 1. Install Android Studio

* Install Android Studio from [here](https://developer.android.com/studio).
* Open it and install:

  * Android SDK
  * Android SDK Platform Tools
  * Emulator tools
  * Java SDK 11 (for Gradle compatibility)

#### 2. Set Environment Variables

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.)

#### 3. Create Keystore for Release

```bash
keytool -genkeypair -v -keystore breathwork-release-key.keystore -alias breathwork -keyalg RSA -keysize 2048 -validity 10000
```

* Save the `breathwork-release-key.keystore` file to `android/app`.

#### 4. Configure `android/gradle.properties`

Add:

```
MYAPP_UPLOAD_STORE_FILE=breathwork-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=breathwork
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

#### 5. Update `android/app/build.gradle`

```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        ...
    }
}
```

---

### iOS Setup

#### 1. Install Xcode (from Mac App Store)

* Open Xcode and install command line tools.
* Ensure the simulator runs.

#### 2. Install CocoaPods Dependencies

```bash
cd ios && pod install && cd ..
```

#### 3. Setup Apple Developer Account

1. Enroll at: [https://developer.apple.com/account](https://developer.apple.com/account)
2. Create a new App ID and provisioning profile.
3. In Xcode:

   * Open `ios/BreathWork.xcworkspace`.
   * Select your team under *Signing & Capabilities*.
   * Set a unique Bundle Identifier.

#### 4. Set up iOS Environment

If using `.env` for API configuration, use the `react-native-dotenv` library or `react-native-config` for native access.

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
API_BASE_URL=https://api.breathworkapp.com
```

To access in JS:

```js
import Config from 'react-native-config';
console.log(Config.API_BASE_URL);
```

---

## Building & Release

### Android Release Build

#### 1. Build APK

```bash
cd android
./gradlew assembleRelease
```

Find the output at:

```
android/app/build/outputs/apk/release/app-release.apk
```

#### 2. Build AAB (Android App Bundle for Play Store)

```bash
./gradlew bundleRelease
```

Output at:

```
android/app/build/outputs/bundle/release/app-release.aab
```

Upload `.aab` to the Google Play Console.

---

### iOS Release Build

#### 1. Open Project in Xcode

```bash
open ios/BreathWork.xcworkspace
```

#### 2. Archive & Distribute

1. Select `Generic iOS Device` as the target.
2. Product → Archive.
3. Distribute via App Store or Ad Hoc using your Apple Developer credentials.

#### 3. Alternatively Use CLI (Optional)

```bash
xcodebuild -workspace ios/BreathWork.xcworkspace -scheme BreathWork -configuration Release -derivedDataPath ios/build
```

---

## Acknowledgements

### Libraries

* **React Native** – Framework for building native mobile apps.
* **React Navigation** – Handles routing and navigation.
* **Redux Toolkit** – Centralized state management.
* **Redux Persist** – Persistence for Redux state.
* **Axios** – HTTP requests.
* **Async Storage** – Local key-value storage.
* **Gesture Handler & Reanimated** – Native animations and gestures.
* **Responsive Screens** – Utility for responsive UIs.
* **Safe Area Context** – Manages device safe zones.
* **SVG Support** – Scalable vector graphics support.# alumaApp
