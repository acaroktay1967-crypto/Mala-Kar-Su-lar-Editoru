# Mala-Kar-Su-lar-Editoru

TCK Mala Karşı İşlenen Suçlar Editörü - A desktop application for managing Turkish Criminal Code cases.

## CI/CD Pipeline

This repository includes an automated CI/CD pipeline using GitHub Actions that runs on every push and pull request.

### Pipeline Features

- **Code Quality Checks**: ESLint is run to ensure code quality and consistency
- **Automated Testing**: Tests are executed across multiple Node.js versions (16, 18, 20)
- **Multi-Platform Builds**: Application is built on Linux, Windows, and macOS
- **Error Reporting**: Automatic notifications on build failures
- **Build Artifacts**: Compiled applications are uploaded for each platform

### Running Locally

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Build the application
npm run build

# Start development mode
npm run dev
```

### GitHub Actions Workflow

The workflow is triggered on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

Build artifacts are retained for 7 days and can be downloaded from the Actions tab.
