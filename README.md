# IceMelter

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.79-blue.svg" alt="React Native Version" />
  <img src="https://img.shields.io/badge/Expo-53-green.svg" alt="Expo Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue.svg" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-green.svg" alt="License" />
</p>

## Description

IceMelter is a mobile application built with React Native and Expo that helps users spark meaningful conversations with anyone.
The application provides conversation starters, icebreaker questions, and interactive games to facilitate better communication and connection between people.

## Features

- **User-Friendly Interface**: Intuitive and engaging mobile experience
- **Conversation Starters**: Curated questions to break the ice in any situation
- **Multiple Languages**: Supports internationalization (i18n) for multiple languages
- **User Profiles**: Create and manage multiple conversation profiles
- **Categories**: Browse questions by different categories
- **Interactive Games**: Engage with conversation games
- **Cross-Platform**: Works on both iOS and Android devices

## Prerequisites

- Node.js (v24 or higher)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Run linting

## Project Structure

- `app/` - Main application screens using Expo Router
  - `(auth)/` - Authenticated screens (profiles, categories, games)
  - `index.tsx` - Entry point/landing page
  - `login.tsx`, `register.tsx` - Authentication screens
- `components/` - Reusable UI components
- `assets/` - Static assets like images and fonts
- `src/` - Source code
  - `config/` - Application configuration
  - `stores/` - State management with Zustand
  - `styles/` - Shared styles
- `constants/` - Application constants

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ice-breaker-frontend.git
   cd ice-breaker-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Follow the instructions in the terminal to open the app on your device or emulator

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you like this project, a coffee is always appreciated!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/anton_c)

## Author

- Anton Cherednichenko
