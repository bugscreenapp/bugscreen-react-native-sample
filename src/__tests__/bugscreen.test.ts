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
    showFloatingButton: jest.fn(),
    hideFloatingButton: jest.fn(),
    startScreenRecording: jest.fn(),
    stopScreenRecording: jest.fn(),
    getScreenRecordingState: jest.fn(),
    showReportNotification: jest.fn(),
    hideReportNotification: jest.fn(),
    setShakeDetectionEnabled: jest.fn(),
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
    captureSystemLogs: true,
    screenRecordingOptions: { durationSeconds: 15, quality: "balanced" },
    showFloatingButton: true,
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

test("capture controls delegate to the native SDK after startup", async () => {
  const { captureControls } = integration;
  expect(captureControls.startRecording()).toBe(false);
  expect(await captureControls.recordingState()).toBeUndefined();
  expect(sdk.startScreenRecording).not.toHaveBeenCalled();
  expect(sdk.getScreenRecordingState).not.toHaveBeenCalled();

  await integration.startBugScreen();
  sdk.getScreenRecordingState.mockResolvedValue({
    status: "unavailable",
    reason: "permissionDenied",
  });

  expect(captureControls.showFloatingButton()).toBe(true);
  expect(captureControls.hideFloatingButton()).toBe(true);
  expect(captureControls.startRecording()).toBe(true);
  expect(await captureControls.recordingState()).toEqual({
    status: "unavailable",
    reason: "permissionDenied",
  });
  expect(captureControls.stopRecording()).toBe(true);
  expect(captureControls.showReportNotification()).toBe(true);
  expect(captureControls.hideReportNotification()).toBe(true);
  expect(captureControls.setShakeDetectionEnabled(true)).toBe(true);
  expect(captureControls.setShakeDetectionEnabled(false)).toBe(true);

  expect(sdk.showFloatingButton).toHaveBeenCalledTimes(1);
  expect(sdk.hideFloatingButton).toHaveBeenCalledTimes(1);
  expect(sdk.startScreenRecording).toHaveBeenCalledTimes(1);
  expect(sdk.stopScreenRecording).toHaveBeenCalledTimes(1);
  expect(sdk.showReportNotification).toHaveBeenCalledTimes(1);
  expect(sdk.hideReportNotification).toHaveBeenCalledTimes(1);
  expect(sdk.setShakeDetectionEnabled).toHaveBeenNthCalledWith(1, true);
  expect(sdk.setShakeDetectionEnabled).toHaveBeenNthCalledWith(2, false);
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

test("release builds configure reporting, permissions and breadcrumbs without SDK debug logging", async () => {
  Object.defineProperty(globalThis, "__DEV__", {
    value: false,
    configurable: true,
  });
  process.env.EXPO_PUBLIC_BUGSCREEN_API_KEY = "fb_test_key_for_unit_tests";
  sdk.shouldRequestPermission.mockResolvedValue(true);
  sdk.requestScreenshotPermission.mockResolvedValue(true);

  await Promise.all([
    integration.startBugScreen(),
    integration.startBugScreen(),
  ]);

  expect(sdk.configure).toHaveBeenCalledTimes(1);
  expect(sdk.configure).toHaveBeenCalledWith({
    apiKey: "fb_test_key_for_unit_tests",
    screenshotDetection: true,
    debug: false,
    captureSystemLogs: true,
    screenRecordingOptions: { durationSeconds: 15, quality: "balanced" },
    showFloatingButton: true,
  });
  expect(sdk.setCustomData).toHaveBeenCalledWith(
    expect.objectContaining({
      userId: "usr_84213",
      sessionId: "sample-session",
    }),
  );
  expect(integration.presentReport()).toBe(true);
  expect(sdk.presentBugReport).toHaveBeenCalledTimes(1);
  expect(await integration.requestScreenshotPermission()).toBe(true);
  expect(sdk.requestScreenshotPermission).toHaveBeenCalledTimes(1);
  integration.breadcrumbs.screenViewed("explore");
  expect(sdk.log).toHaveBeenCalledWith("screen_viewed: explore", LogLevel.Info);
});
