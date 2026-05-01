# Contributing Guide

Developer setup

1. Install dependencies

```bash
npm install
```

2. Initialize husky hooks

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

3. Run checks

```bash
npm run typecheck
npm run lint
npm test
npm run format
```

4. Running benchmarks

```bash
npm run bench 2000
```

5. Creating a PR

- Ensure `npm run typecheck` and `npm test` pass locally
- Run `npm run lint:fix` and `npm run format` before committing

Notes
- CI will run on push/PR and validate typecheck, lint, tests, build, and smoke tests.
