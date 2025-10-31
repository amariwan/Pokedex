# 🎃 Pokedex - Hacktoberfest 2025

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-blueviolet.svg)](https://hacktoberfest.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, feature-rich Pokedex application built with Next.js 15, TypeScript, and TailwindCSS. Explore, search, and compare Pokemon with a beautiful, responsive interface!

## 🎯 Hacktoberfest Participation

This project is participating in **Hacktoberfest 2025**! We welcome contributions from developers of all skill levels. Whether you're a seasoned developer or just starting out, there's something for everyone.

### How to Participate

1. **Sign up** for [Hacktoberfest](https://hacktoberfest.com/)
2. **Fork** this repository
3. **Find an issue** labeled with `hacktoberfest` or `good-first-issue`
4. **Create a pull request** with your contribution
5. **Wait for review** - we'll review your PR as soon as possible!

### Contribution Guidelines

- ✅ Check existing issues and PRs to avoid duplicates
- ✅ Follow the code style and conventions used in the project
- ✅ Write clear, concise commit messages
- ✅ Test your changes thoroughly
- ✅ Update documentation if needed
- ✅ Be respectful and constructive in discussions

### Areas for Contribution

- 🐛 **Bug Fixes**: Help us squash bugs!
- ✨ **New Features**: Add exciting new functionality
- 📚 **Documentation**: Improve or expand documentation
- 🎨 **UI/UX**: Enhance the user interface and experience
- ♿ **Accessibility**: Make the app more accessible
- 🧪 **Testing**: Add or improve tests
- 🚀 **Performance**: Optimize code and improve performance
- 🌐 **Internationalization**: Add support for more languages

## ✨ Features

- 🔍 **Advanced Search**: Search Pokemon by name, type, or abilities
- 📊 **Detailed Stats**: View comprehensive Pokemon statistics
- 🎨 **Type-based Themes**: Dynamic color schemes based on Pokemon types
- ⭐ **Favorites**: Save your favorite Pokemon
- 🔄 **Compare Mode**: Compare multiple Pokemon side by side
- 📱 **PWA Support**: Install as a Progressive Web App
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🎵 **Sound Effects**: Interactive sound feedback (toggleable)
- ⚡ **Lightning Fast**: Built with Next.js 15 and Turbopack
- 📈 **Evolution Chains**: Visualize Pokemon evolution paths
- 🎯 **Shiny Forms**: View shiny variants of Pokemon
- 🎭 **Smooth Animations**: GSAP-powered animations

## 🚀 Getting Started

### Prerequisites

- Node.js >= 24.11.0
- pnpm >= 10.20.0

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/amariwan/Pokedex.git
   cd Pokedex
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **API**: [PokeAPI](https://pokeapi.co/)

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
pnpm type-check   # Run TypeScript type checking

# Testing
pnpm test         # Run unit tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
pnpm test:e2e     # Run E2E tests
pnpm test:all     # Run all tests

# Maintenance
pnpm clean        # Clean Next.js cache
pnpm clean:all    # Clean all generated files
pnpm refresh      # Clean and reinstall dependencies
```

## 🏗️ Project Structure

```text
Pokedex/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── pokemon/         # Pokemon-specific components
│   │   ├── store/           # State management
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and helpers
│   │   ├── data/            # Static data
│   │   └── __tests__/       # Unit tests
│   ├── stores/              # Zustand stores
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── tests/                   # E2E tests
└── coverage/                # Test coverage reports
```

## 🧪 Testing

We use **Vitest** for unit testing and **Playwright** for end-to-end testing.

```bash
# Run unit tests
pnpm test

# Run unit tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 🐳 Docker Support

```bash
# Build and run with Docker Compose
docker-compose up
```

## 🤝 Contributing

We love contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

### Quick Start for Contributors

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `pnpm test:all`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Code Quality Standards

Before submitting a PR, ensure:

- ✅ All tests pass
- ✅ No ESLint warnings or errors
- ✅ Code is properly formatted
- ✅ TypeScript types are correct

Run this command to check everything:

```bash
pnpm check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing the Pokemon data
- [Vercel](https://vercel.com/) for hosting
- All our amazing contributors!

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/amariwan/Pokedex/issues)
- **Discussions**: [GitHub Discussions](https://github.com/amariwan/Pokedex/discussions)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you or you find it interesting!

---

## Happy Hacking! 🎃👨‍💻👩‍💻

Made with ❤️ for Hacktoberfest 2025
