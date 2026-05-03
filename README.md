# Titan 🦅

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0--beta-orange.svg)](https://github.com/Rayyan-x95/Titan/releases)
[![Build Status](https://github.com/Rayyan-x95/Titan/actions/workflows/ci.yml/badge.svg)](https://github.com/Rayyan-x95/Titan/actions)

**Titan** is a purely open-source, "Privacy-First" Personal Life Operating System. It unifies tasks, notes, and financial tracking into a high-performance, offline-first Progressive Web App (PWA).

## 🎯 Our Mission

To provide a professional-grade workspace that works everywhere, costs nothing, and respects your privacy by default. Titan stores **100% of your data locally** using IndexedDB—no cloud, no tracking, no silos.

## ✨ Features

- **🦅 Unified Intelligence**: Contextual linking between Tasks, Notes, and Expenses.
- **⚡ Offline Core**: Built for speed and reliability, even without a network.
- **💰 Precision Finance**: Integer-based money math with native currency support.
- **📝 Contextual Notes**: Markdown-ready notes with bidirectional task linking.
- **📱 PWA Native**: Installable on iOS, Android, and Desktop with platform-specific optimizations.

## 🏗️ Architecture

Titan is built with a modern, modular stack designed for maintainability and performance:

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State**: [Zustand](https://docs.pmnd.rs/zustand) (Normalized state slices)
- **Database**: [Dexie.js](https://dexie.org/) (Local-first IndexedDB storage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Business Logic**: Pure logic engines located in `src/lib/core/`

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+
- npm 9+

### 2. Installation
```bash
git clone https://github.com/Rayyan-x95/Titan.git
cd Titan
npm install
```

### 3. Development
```bash
npm run dev
```

### 4. Testing & Quality
```bash
npm test              # Run unit tests
npm run typecheck     # Validate TypeScript
npm run lint          # Run ESLint checks
```

## 🤝 Contributing

We love contributors! Whether you are fixing a bug, adding a feature, or improving documentation, your help is welcome.

1. Read our [Contributing Guide](CONTRIBUTING.md).
2. Check out the [Roadmap](ROADMAP.md) (coming soon).
3. Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## 🛡️ Security

If you discover a security vulnerability, please refer to our [Security Policy](SECURITY.md).

## 📄 License

Titan is open-source software licensed under the **[MIT License](LICENSE)**.

---
*Built with precision for the modern professional.*
