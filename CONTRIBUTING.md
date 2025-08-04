# Contributing to Sugary 🍭

Thank you for your interest in contributing to Sugary! We welcome contributions from the community and are excited to see what you'll build.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun
- Git

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/sugary.git
   cd sugary
   ```

3. **Add the original repository as upstream**:
   ```bash
   git remote add upstream https://github.com/original-owner/sugary.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

6. **Start the development servers**:
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend (Convex)
   npx convex dev
   ```

## 🛠️ Development Workflow

### Making Changes

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Run code quality checks**:
   ```bash
   npm run lint:fix
   ```

### Commit Guidelines

We follow conventional commit standards:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```bash
git commit -m "feat: add email notification preferences"
git commit -m "fix: resolve dashboard loading issue"
```

### Submitting Changes

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Screenshots or GIFs for UI changes
   - Reference to any related issues

## 📋 Code Standards

### TypeScript
- Use TypeScript for all new code
- Ensure type safety and avoid `any` types
- Add proper JSDoc comments for public APIs

### Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Test in both light and dark modes

### Code Quality
- All code must pass `npm run lint`
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### Testing
- Write tests for new features
- Update existing tests when modifying functionality
- Ensure all tests pass before submitting

## 🐛 Reporting Issues

### Bug Reports
Please include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error messages
- Browser/OS information

### Feature Requests
Please include:
- Clear description of the feature
- Use case or problem it solves
- Proposed implementation (if any)
- Examples from other tools (if applicable)

## 📚 Project Structure

```
sugary/
├── app/                    # Next.js App Router
│   ├── components/         # App-specific components
│   ├── dashboard/          # Dashboard pages and layouts
│   ├── auth/              # Authentication pages
│   └── [company]/         # Dynamic company feature pages
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── convex/               # Convex backend functions and schema
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
└── public/              # Static assets
```

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **UI/UX improvements** - Better user experience and design
- **Performance optimizations** - Faster loading and better performance
- **Accessibility** - Making Sugary more accessible to all users
- **Documentation** - Improving guides and documentation
- **Testing** - Adding more comprehensive tests
- **New features** - Check our roadmap and open issues

## 💬 Community

- **Questions?** Open a GitHub Discussion
- **Chat:** Join our community Discord (if available)
- **Email:** Reach out to [eric@gantstreet.com](mailto:eric@gantstreet.com)

## 📄 License

By contributing to Sugary, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Sugary better! 🚀