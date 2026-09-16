import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  const reportDir = path.join(__dirname, '../../playwright-report');
  const resultsDir = path.join(__dirname, '../../test-results');
  const screenshotsDir = path.join(resultsDir, 'screenshots');
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('✅ Global setup completed');
}

export default globalSetup;