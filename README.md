# OrangeHRM Employee Lifecycle Automation

A comprehensive QA Automation framework built with **Playwright** and **TypeScript** for testing the Employee Lifecycle Management workflow on [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/).

## 📋 Test Scenario Coverage

This framework automates the complete Employee Lifecycle Management workflow:

1. **Login** - Valid credentials authentication
2. **Add Employee** - Create new employee with data-driven inputs (First Name, Last Name, Employee ID, Profile Picture)
3. **Edit Employee** - Update Job Title and Employment Status
4. **API Validation** - Cross-verify UI data with API (ReqRes public API)
5. **Delete Employee** - Remove employee and verify via UI and API
6. **Logout** - Confirm session invalidation

## 🏗️ Framework Structure

```
orangehrm-automation/
├── src/
│   ├── pages/              # Page Object Models (POM)
│   │   ├── BasePage.ts     # Base page with common utilities
│   │   ├── LoginPage.ts    # Login page interactions
│   │   ├── PIMPage.ts      # PIM module interactions
│   │   └── DashboardPage.ts # Dashboard/logout interactions
│   ├── tests/              # Test specifications
│   │   └── employee-lifecycle.spec.ts
│   ├── test-data/          # Data-driven test data
│   │   ├── employee-data.json
│   │   └── profile.jpg     # Test profile picture
│   ├── utils/              # Utility functions
│   │   ├── test-data.ts    # Test data manager
│   │   ├── global-setup.ts # Global test setup
│   │   └── global-teardown.ts # Global test teardown
│   ├── api/                # API clients
│   │   └── ApiClient.ts    # ReqRes & OrangeHRM API clients
│   └── types/              # TypeScript type definitions
│       └── index.ts
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Playwright | ^1.40.0 | UI Automation |
| TypeScript | ^5.3.0 | Type-safe JavaScript |
| Node.js | 18+ | Runtime environment |
| ReqRes API | - | Public API for validation |

## 📦 Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0"
  }
}
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js 18+** installed
- **Git** for version control
- **VS Code** (recommended) with Playwright extension

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd orangehrm-automation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

## ▶️ How to Run Tests

### Run All Tests (Headless)
```bash
npm test
```

### Run Tests with Browser UI (Headed)
```bash
npm run test:headed
```

### Debug Tests
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test src/tests/employee-lifecycle.spec.ts
```

### Run with Specific Browser
```bash
npx playwright test --project=chromium
```

## 📊 Test Reports

### HTML Report (Auto-generated)
```bash
# View last test run report
npm run test:report

# Or open manually
open playwright-report/index.html
```

The HTML report includes:
- Test execution summary
- Passed/Failed test details
- Screenshots on failure
- Trace viewer for debugging
- Video recordings (on failure)

### JSON Report
Generated at `test-results/results.json` for CI/CD integration.

## 🎬 Video Recordings

Videos are automatically recorded for **failed tests** and stored in:
```
test-results/<test-name>/video.webm
```

To record videos for all tests, modify `playwright.config.ts`:
```typescript
use: {
  video: 'on',  // Record all tests
}
```

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

Key settings:
- **Base URL**: `https://opensource-demo.orangehrmlive.com`
- **Timeout**: 30 seconds for actions/navigation
- **Retries**: 2 on CI, 0 locally
- **Reporters**: HTML, List, JSON
- **Video**: Retain on failure
- **Screenshot**: On failure
- **Trace**: On first retry

### Test Data (`src/test-data/employee-data.json`)

```json
{
  "validCredentials": {
    "username": "Admin",
    "password": "admin123"
  },
  "employees": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "employeeId": "EMP001",
      "profilePicture": "test-data/profile.jpg",
      "jobTitle": "Software Engineer",
      "employmentStatus": "Full-Time Permanent"
    }
  ],
  "updatedEmployee": {
    "jobTitle": "Senior Software Engineer",
    "employmentStatus": "Full-Time Permanent"
  }
}
```

## 🏛️ Design Patterns

### Page Object Model (POM)
Each page has a dedicated class encapsulating:
- Locators
- Actions
- Verifications

```typescript
// Example usage
const loginPage = new LoginPage(page);
await loginPage.login({ username: 'Admin', password: 'admin123' });
await loginPage.verifyLoginSuccess();
```

### Data-Driven Testing
Test data externalized in JSON files for:
- Easy maintenance
- Multiple test scenarios
- Environment-specific configurations

### API Validation
Cross-browser verification using ReqRes public API:
- Create employee via UI → Verify via API
- Update via UI → Verify via API
- Delete via UI → Verify via API

## 🧪 Test Features

| Feature | Implementation |
|---------|----------------|
| **Assertions** | Descriptive messages with `expect()` |
| **Error Handling** | Try-catch with meaningful logs |
| **Screenshots** | Auto-capture on failure |
| **Video Recording** | Native Playwright video on failure |
| **Trace Viewer** | Detailed debugging on retry |
| **Parallel Execution** | Configured for CI/CD |
| **Retry Logic** | Automatic retry on flaky tests |

## 📝 Best Practices Implemented

1. **Clean Code**: Consistent naming, modular structure
2. **Reusability**: Base page with common methods
3. **Maintainability**: Separation of concerns (POM)
4. **Reliability**: Explicit waits, proper timeouts
5. **Reporting**: Rich HTML reports with traces
6. **Type Safety**: Full TypeScript coverage
7. **Data Isolation**: Unique employee IDs per run

## 🔍 Debugging Tips

### View Trace on Failure
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

### Run Single Test in Debug Mode
```bash
npx playwright test -g "Login" --debug
```

### Generate Codegen (Record Actions)
```bash
npx playwright codegen https://opensource-demo.orangehrmlive.com
```

## 🤝 CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

## 📈 Extending the Framework

### Add New Page Object
1. Create `src/pages/NewPage.ts` extending `BasePage`
2. Add locators and methods
3. Import in test file

### Add New Test Data
1. Update `src/test-data/employee-data.json`
2. Access via `TestDataManager.getInstance()`

### Add New API Endpoint
1. Extend `ApiClient` class in `src/api/ApiClient.ts`
2. Use in test steps

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Browser not found | Run `npx playwright install chromium` |
| Timeout errors | Increase timeout in config or test |
| Element not found | Check locators, add explicit waits |
| Login fails | Verify credentials, check network |
| API errors | Check ReqRes API status |

### Logs and Artifacts
- Test logs: Console output
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/<test-name>/video.webm`
- Traces: `test-results/<test-name>/trace.zip`

## 📄 License

MIT License - Feel free to use for learning and assessment purposes.

## 👨‍💻 Author

**QA Automation Engineer** - Technical Assessment Submission

---

**Repository**: [GitHub Link]  
**Assessment**: QA Automation Technical Test - 3 Days Timeline  
**Target Site**: https://opensource-demo.orangehrmlive.com/