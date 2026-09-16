import * as fs from 'fs';
import * as path from 'path';
import { EmployeeData, LoginCredentials, TestConfig } from '../types';

export class TestDataManager {
  private static instance: TestDataManager;
  private testData: any;

  private constructor() {
    this.loadTestData();
  }

  static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  private loadTestData(): void {
    const projectRoot = path.resolve(__dirname, '../..');
    const dataPath = path.join(projectRoot, 'src/test-data/employee-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    this.testData = JSON.parse(rawData);
  }

  getValidCredentials(): LoginCredentials {
    return this.testData.validCredentials;
  }

  getEmployees(): EmployeeData[] {
    return this.testData.employees;
  }

  getUpdatedEmployeeData() {
    return this.testData.updatedEmployee;
  }

  getEmployeeByIndex(index: number): EmployeeData {
    return this.testData.employees[index];
  }
}

export const testConfig: TestConfig = {
  baseURL: 'https://opensource-demo.orangehrmlive.com',
  apiBaseURL: 'https://reqres.in/api',
  timeout: 30000,
  retries: 2,
};

export function generateUniqueEmployeeId(): string {
  return `EMP${Date.now()}`;
}

export function getRandomEmployeeData(): EmployeeData {
  const employees = TestDataManager.getInstance().getEmployees();
  const randomIndex = Math.floor(Math.random() * employees.length);
  return {
    ...employees[randomIndex],
    employeeId: generateUniqueEmployeeId(),
  };
}