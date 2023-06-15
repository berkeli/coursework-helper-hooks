import type { Config } from "@jest/types";

export default {
  preset: "ts-jest",
  clearMocks: true,
  coverageDirectory: "coverage",
  testMatch: ["<rootDir>/tests/**/*.test.(ts|tsx)"],
  testEnvironment: "jsdom", // browser-like
  setupFilesAfterEnv: ["<rootDir>/tests/jest-setup.ts"],
} as Config.InitialOptions;
