import { BugScreen, LogLevel } from "@bugscreen/react-native";
import { randomUUID } from "expo-crypto";
import { currentUser } from "../data/travel";

let startup: Promise<void> | undefined;
let configured = false;

// Keep all SDK calls here so the travel screens remain ordinary app code.
export function startBugScreen(): Promise<void> {
  startup ??= BugScreen.configure({
    apiKey: process.env.EXPO_PUBLIC_BUGSCREEN_API_KEY?.trim() ?? "",
    screenshotDetection: true,
    debug: __DEV__,
    captureSystemLogs: true,
    screenRecordingOptions: { durationSeconds: 15, quality: "balanced" },
    showFloatingButton: true,
  }).then(() => {
    BugScreen.setCustomData({
      userId: currentUser.userId,
      plan: currentUser.plan,
      homeCity: currentUser.homeCity,
      sessionId: randomUUID(),
    });
    configured = true;
  });
  return startup;
}

export async function requestScreenshotPermission(): Promise<boolean> {
  if (!configured) return false;
  if (await BugScreen.shouldRequestPermission()) {
    return BugScreen.requestScreenshotPermission();
  }
  return true;
}

export function presentReport(): boolean {
  if (!configured) return false;
  BugScreen.presentBugReport();
  return true;
}

// These commands request a change. Read the native recording state separately.
export const captureControls = {
  showFloatingButton: () =>
    runCaptureAction(
      BugScreen.showFloatingButton,
      "floating_button_visible: true",
    ),
  hideFloatingButton: () =>
    runCaptureAction(
      BugScreen.hideFloatingButton,
      "floating_button_visible: false",
    ),
  startRecording: () =>
    runCaptureAction(
      BugScreen.startScreenRecording,
      "recording_requested: true",
    ),
  stopRecording: () =>
    runCaptureAction(
      BugScreen.stopScreenRecording,
      "recording_requested: false",
    ),
  recordingState: async () =>
    configured ? await BugScreen.getScreenRecordingState() : undefined,
  showReportNotification: () =>
    runCaptureAction(
      () => BugScreen.showReportNotification(),
      "report_notification_requested: true",
    ),
  hideReportNotification: () =>
    runCaptureAction(
      BugScreen.hideReportNotification,
      "report_notification_requested: false",
    ),
  setShakeDetectionEnabled: (enabled: boolean) =>
    runCaptureAction(
      () => BugScreen.setShakeDetectionEnabled(enabled),
      `shake_detection_enabled: ${enabled}`,
    ),
};

function runCaptureAction(action: () => void, message: string): boolean {
  if (!configured) return false;
  action();
  log(message);
  return true;
}

export const breadcrumbs = {
  screenViewed: (name: string) => log(`screen_viewed: ${name}`),
  destinationOpened: (id: string) => log(`destination_opened: ${id}`),
  tripOpened: (id: string) => log(`trip_opened: ${id}`),
  saveToggled: (id: string, saved: boolean) =>
    log(`save_toggled id=${id} saved=${saved}`, LogLevel.Debug),
};

function log(message: string, level: LogLevel = LogLevel.Info) {
  if (configured) BugScreen.log(message, level);
}
