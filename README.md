# VividWealth App

![CI Status](https://github.com/vividwealth/vividwealth-app/workflows/VividWealth%20CI/badge.svg)
![CD Status](https://github.com/vividwealth/vividwealth-app/workflows/VividWealth%20CD/badge.svg)
![Deploy Status](https://github.com/vividwealth/vividwealth-app/workflows/VividWealth%20Deploy/badge.svg)

VividWealth is a luxurious, minimalist financial application built with Expo and TypeScript.

## Features

- 🔐 Elegant authentication flow with email and social login
- 💰 Personal finance dashboard with intuitive visualizations
- 🎬 Studio experience for creating financial content
- 👤 Personalized user profiles
- ⚙️ Customizable settings

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) with TypeScript
- **UI**: [NativeWind](https://nativewind.dev/) (Tailwind CSS for React Native)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **State Management**: [React Query](https://tanstack.com/query/latest) for server state
- **Form Validation**: [Zod](https://zod.dev/)
- **Media**: [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- **Animations**: [Lottie](https://github.com/lottie-react-native/lottie-react-native)
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: ESLint + Prettier

## Project Structure

```
src/
  ├─ assets/        # Fonts, icons, images, animations
  ├─ components/    # Reusable UI elements
  ├─ constants/     # Colors, typography, spacing, breakpoints
  ├─ contexts/      # Auth, Subscription, UserGoal, Progress
  ├─ hooks/         # Custom hooks for API, audio, video, AI
  ├─ navigation/    # Stack and Tab navigators
  ├─ screens/       # Auth, Onboarding, Dashboard, Studio, Profile, Settings
  ├─ services/      # API, AI, VideoGen, Voice, Analytics
  ├─ types/         # TypeScript interfaces and enums
  └─ utils/         # Helpers, formatters, validators
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your physical device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run on device:
```bash
npm run dev
```

3. Scan the QR code with Expo Go app on your device

### Development Options

```bash
# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on Web
npm run web

# Run with Expo Go (scan QR code with your device)
npm start
```

## Branching Strategy

We follow a structured branching model:

- **`main`**: Production-ready code. Protected branch - requires PR and approval.
- **`develop`**: Integration branch for features. Protected branch - requires PR and approval.
- **`feature/*`**: Feature-specific branches for development work.
- **`hotfix/*`**: Emergency fixes for production issues.

### Working on Features

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create a feature branch
git checkout -b feature/my-new-feature

# After work is complete
git push origin feature/my-new-feature

# Then create a PR to merge into develop
```

### Hotfix Process

```bash
# Start from main
git checkout main
git pull origin main

# Create a hotfix branch
git checkout -b hotfix/critical-fix

# After fix is complete
git push origin hotfix/critical-fix

# Then create a PR to merge into main AND develop
```

## CI/CD Pipeline

Our project uses GitHub Actions for continuous integration and deployment:

1. **CI**: On every push to `main`, `develop`, or pull request:
   - Installs dependencies
   - Runs linting and type checking
   - Runs unit tests
   - Performs security scanning
   - Builds a test version of the app

2. **CD**: On tagged releases:
   - Builds production version
   - Creates GitHub Release
   - Archives build artifacts

## Rollback Process

If a deployment causes issues, you can roll back using our built-in recovery tools:

### Using the Rollback Script

```bash
# Run the rollback script
./scripts/rollback.sh

# Follow the interactive prompts to select a stable version
```

### Manual Rollback

```bash
# View available tags
git tag -l "v*" --sort=-v:refname

# Checkout a specific version
git checkout v1.0.0

# Install dependencies for that version
npm install
```

### Accessing Previous Builds

Previous build artifacts are stored in GitHub Actions and can be downloaded from:

1. Go to the Actions tab in the repository
2. Select the specific workflow run
3. Download the artifacts from the Artifacts section

## Contribution Guidelines

### Code Style

We use ESLint and Prettier for code quality. Before submitting a PR:

```bash
# Run linting
npm run lint

# Fix autodetectable issues
npm run lint:fix

# Run type checking
npm run typescript

# Run tests
npm run test
```

### Pull Request Process

1. Ensure your code passes all tests and linting checks
2. Update documentation as necessary
3. Get at least one approval from a code owner
4. Ensure CI checks pass before merging

### Commit Messages

We follow Conventional Commits format:

```
feat: add user authentication
fix: resolve login screen layout on small devices
docs: update README with new API endpoints
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Expo Team](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://nativewind.dev/)
- [TanStack Query](https://tanstack.com/query/latest) 