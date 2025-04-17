# VividWealth Project Configuration

## Tech Stack
- **Frontend Framework:** Expo with React Native and TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** React Context API, React Query
- **Form Validation:** Zod
- **Authentication:** Firebase Authentication
- **Secure Storage:** Expo Secure Store
- **Animations:** React Native Reanimated
- **Navigation:** React Navigation
- **Testing:** Jest with React Native Testing Library
- **CI/CD:** GitHub Actions
- **Deployment:** Expo Application Services (EAS)

## Environment Configuration
- **Development:** Local development environment with Expo Go
- **Staging:** Preview builds deployed through EAS for testing
- **Production:** Standalone app builds distributed through app stores

## Build Profiles
| Profile      | Purpose                                       | Target                  |
|--------------|-----------------------------------------------|-------------------------|
| development  | Local development with hot reloading          | Expo Go                 |
| preview      | Testing builds for QA and stakeholder review  | Internal distribution   |
| production   | Release builds for end users                  | App Store/Play Store    |

## GitHub Workflow
- **Main Branch:** Production-ready code, protected
- **Develop Branch:** Integration branch, protected
- **Feature Branches:** Feature-specific development, prefixed with `feature/`
- **Hotfix Branches:** Urgent fixes, prefixed with `hotfix/`

## Required Secrets
- `EXPO_TOKEN`: For EAS build and submission
- `SLACK_WEBHOOK_URL`: For CI/CD notifications
- `CODECOV_TOKEN`: For code coverage reporting

## NPM Scripts
- `npm run lint`: Run ESLint to check code quality
- `npm run typescript`: Type checking with TypeScript
- `npm run test`: Run tests with Jest
- `npm run deploy`: Build and deploy using EAS

## Version Control
- Using semantic versioning (MAJOR.MINOR.PATCH)
- Each release tagged in Git with `v` prefix (e.g., `v1.0.0`)
- Each tag automatically creates a GitHub Release with assets

## Rollback Procedure
In case of issues with a release:
1. Use the `scripts/rollback.sh` script to revert to a previous version
2. Or download artifacts from GitHub Actions for manual installation 