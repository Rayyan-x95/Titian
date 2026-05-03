# Security Policy

## Supported Versions

Titan is currently in active development (Beta). We support the following versions for security updates:

| Version | Supported          |
| ------- | ------------------ |
| v0.1.x  | :white_check_mark: |
| < v0.1  | :x:                |

## Reporting a Vulnerability

We take the security and privacy of Titan users very seriously. Titan is a **100% local-first** application, meaning your data never leaves your device. Our security model focuses on protecting this local data and preventing client-side attacks.

## Security Features

- **Content Security Policy (CSP)**: We enforce a strict CSP to prevent XSS and unauthorized script execution.
- **Advanced PIN Protection**: App PINs are hashed using **PBKDF2-HMAC-SHA256** with **100,000 iterations**, providing strong protection against local brute-force attacks.
- **Robust Sanitization**: All user inputs are sanitized using browser-native DOM parsing to ensure no malicious HTML is executed.
- **Privacy-First Diagnostics**: System logs and metrics are stored in RAM/IndexedDB and are never transmitted to external servers.

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**. Instead, follow these steps:

1. Email your findings to [INSERT SECURITY EMAIL OR GITHUB USERNAME].
2. Provide a detailed description of the vulnerability and steps to reproduce it.
3. We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Our Commitment

- We will not disclose your identity without your permission.
- We will work with you to understand and resolve the issue.
- We will give you credit for the discovery in our release notes (if desired).

Thank you for helping keep Titan secure!
