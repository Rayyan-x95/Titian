# Contributing to Titan 🦅

First off, thank you for considering contributing to Titan! It's people like you that make open source such a great community.

## 🚀 Quick Start

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally.
3. **Install** dependencies: `npm install`.
4. **Create** a feature branch: `git checkout -b feat/my-awesome-feature`.
5. **Develop**: `npm run dev`.
6. **Verify**: Ensure `npm run check:ci` passes.
7. **Commit**: Use descriptive commit messages.
8. **Push** to your fork and **Submit a PR**.

## 🛠️ Development Standards

### 🛡️ Privacy First
Titan is a privacy-first app. **Never** introduce third-party trackers, external fonts (unless self-hosted), or any logic that transmits personal user data to a remote server without explicit, transparent user consent.

### 🧠 Logic Engines
All business logic (math, validation, recurrence) should live in `src/lib/core/` as **pure functions**. This ensures the logic is easily testable and decoupled from the UI.

### 🎨 UI & Styling
- Use **Tailwind CSS** for all styling.
- Follow the existing **Dark Mode** design tokens.
- Use **Lucide React** for icons.
- Ensure components are accessible (ARIA labels, focus states).

### 🧪 Testing
We use **Vitest** for unit testing. Every new engine function or core store action should have a corresponding `.test.ts` file.

## 📋 Pull Request Guidelines

- **Keep it focused**: One PR per feature or bug fix.
- **Link issues**: Mention relevant issues in the description (e.g., `Fixes #123`).
- **Tests**: PRs that improve or maintain test coverage are prioritized.
- **Linting**: Ensure `npm run lint` and `npm run format` have been run.

## 🤝 Code of Conduct
By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## ❓ Need Help?
Open an [Issue](https://github.com/Rayyan-x95/Titan/issues) with the `question` label.

---
*Happy coding!*
