import { beforeEach, expect, jest, test } from "@jest/globals";
import { BugScreen, LogLevel } from "@bugscreen/react-native";

jest.mock("@bugscreen/react-native", () => ({
  BugScreen: {
    configure: jest.fn(),
    setCustomData: jest.fn(),
    log: jest.fn(),
    presentBugReport: jest.fn(),
    shouldRequestPermission: jest.fn(),
    requestScreenshotPermission: jest.fn(),
  },
  LogLevel: { Info: 2, Debug: 1 },
}));
jest.mock("expo-crypto", () => ({ randomUUID: () => "sample-session" }));

const sdk = jest.mocked(BugScreen);
let integration: typeof import("../bugscreen/bugscreen");

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.EXPO_PUBLIC_BUGSCREEN_API_KEY;
  sdk.configure.mockResolvedValue(undefined);
  Object.defineProperty(globalThis, "__DEV__", {
    value: true,
    configurable: true,
  });
  // Fresh module state without replacing the SDK mock shared by the assertions.
  jest.isolateModules(() => {
    integration = jest.requireActual("../bugscreen/bugscreen");
  });
});

test("configures once and attaches the same user/session fields as the native samples", async () => {
  process.env.EXPO_PUBLIC_BUGSCREEN_API_KEY = "fb_test_key_for_unit_tests";
  await Promise.all([
    integration.startBugScreen(),
    integration.startBugScreen(),
  ]);
  expect(sdk.configure).toHaveBeenCalledTimes(1);
  expect(sdk.configure).toHaveBeenCalledWith({
    apiKey: "fb_test_key_for_unit_tests",
    screenshotDetection: true,
    debug: true,
  });
  expect(sdk.setCustomData).toHaveBeenCalledWith({
    userId: "usr_84213",
    plan: "explorer_pro",
    homeCity: "Lisbon",
    sessionId: "sample-session",
  });
});

test("allows running without an API key and delegates reporting and breadcrumbs after startup", async () => {
  expect(integration.presentReport()).toBe(false);
  await integration.startBugScreen();
  expect(sdk.configure).toHaveBeenCalledWith(
    expect.objectContaining({ apiKey: "" }),
  );
  expect(integration.presentReport()).toBe(true);
  integration.breadcrumbs.saveToggled("kyoto", true);
  expect(sdk.presentBugReport).toHaveBeenCalledTimes(1);
  expect(sdk.log).toHaveBeenCalledWith(
    "save_toggled id=kyoto saved=true",
    LogLevel.Debug,
  );
});

test("requests screenshot access only when the native SDK says it is needed", async () => {
  await integration.startBugScreen();
  sdk.shouldRequestPermission.mockResolvedValue(false);
  expect(await integration.requestScreenshotPermission()).toBe(true);
  expect(sdk.requestScreenshotPermission).not.toHaveBeenCalled();
  sdk.shouldRequestPermission.mockResolvedValue(true);
  sdk.requestScreenshotPermission.mockResolvedValue(false);
  expect(await integration.requestScreenshotPermission()).toBe(false);
  expect(sdk.requestScreenshotPermission).toHaveBeenCalledTimes(1);
});

test("a configuration failure does not leave a usable reporting client", async () => {
  sdk.configure.mockRejectedValueOnce(new Error("invalid API key"));
  await expect(integration.startBugScreen()).rejects.toThrow("invalid API key");
  expect(integration.presentReport()).toBe(false);
  expect(await integration.requestScreenshotPermission()).toBe(false);
  integration.breadcrumbs.screenViewed("explore");
  expect(sdk.log).not.toHaveBeenCalled();
  expect(sdk.setCustomData).not.toHaveBeenCalled();
});

test("release builds do not configure or call BugScreen", async () => {
  Object.defineProperty(globalThis, "__DEV__", {
    value: false,
    configurable: true,
  });
  await integration.startBugScreen();
  expect(integration.presentReport()).toBe(false);
  integration.breadcrumbs.screenViewed("explore");
  expect(sdk.configure).not.toHaveBeenCalled();
  expect(sdk.log).not.toHaveBeenCalled();
});
