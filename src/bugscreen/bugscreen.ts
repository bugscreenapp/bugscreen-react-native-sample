import { BugScreen, LogLevel } from "@bugscreen/react-native";
import { randomUUID } from "expo-crypto";
import { currentUser } from "../data/travel";

let startup: Promise<void> | undefined;
let configured = false;

// Keep all SDK calls here so the travel screens remain ordinary app code.
export function startBugScreen(): Promise<void> {
  if (!__DEV__) return Promise.resolve();
  startup ??= BugScreen.configure({
    apiKey: process.env.EXPO_PUBLIC_BUGSCREEN_API_KEY?.trim() ?? "",
    screenshotDetection: true,
    debug: true,
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
