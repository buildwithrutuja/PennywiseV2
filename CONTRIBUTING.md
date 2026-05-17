# Contributing to PennyWise

Thank you for considering contributing! PennyWise is a student-built, open-source project and every contribution helps.

## 🔖 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be kind, constructive, and respectful. We welcome contributors of all experience levels.

---

## How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/your-feature`)
3. **Make** your changes, following the conventions below
4. **Commit** with a descriptive message
5. **Push** to your fork and open a **Pull Request** against `main`

---

## Development Setup

See [README.md](README.md#-getting-started) for the full setup guide.

Quick checklist:
- [ ] `npm install` for frontend deps
- [ ] Python venv created and activated
- [ ] `pip install -r backend/requirements.txt`
- [ ] `backend/.env` file created from `.env.example` with your Gemini API key

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready code |
| `feat/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation-only changes |
| `refactor/*` | Code refactoring without feature changes |
| `chore/*` | Tooling, CI, dependency updates |

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(dashboard): add monthly spending trend chart
fix(backend): handle empty PDF gracefully
docs(readme): update setup instructions for Windows
chore(deps): upgrade framer-motion to v12
```

---

## Pull Request Process

1. Ensure your branch is up-to-date with `main` before opening a PR
2. Fill in the PR template completely
3. Link any related issues with `Closes #123`
4. Request a review — maintainers aim to respond within 48 hours
5. All checks must pass before merging

### PR Checklist

- [ ] Feature works as described
- [ ] No hardcoded secrets, API keys, or real bank statements committed
- [ ] `npm run lint` passes
- [ ] Code is self-documenting or includes comments for non-obvious logic
- [ ] README / docs updated if behaviour changed

---

## Reporting Bugs

Please use the **Bug Report** issue template. Include:
- Steps to reproduce
- Expected vs. actual behaviour
- Your OS, Node version, Python version
- Screenshots or error logs if applicable

---

## Suggesting Features

Open a **Feature Request** issue. Describe:
- The problem you're solving
- Your proposed solution
- Any alternatives you considered

---

## ⚠️ Security Note

**Never commit:**
- `.env` files or real API keys
- Bank statements or any personal financial documents (`.pdf` files are gitignored)
- Any personally identifiable information (PII)

If you discover a security vulnerability, please report it privately by emailing the maintainer rather than opening a public issue.
