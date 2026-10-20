import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import RootLayout from "../app/_layout";
import {
  requestScreenshotPermission,
  startBugScreen,
} from "../bugscreen/bugscreen";

jest.mock("../bugscreen/bugscreen", () => ({
  startBugScreen: jest.fn(),
  requestScreenshotPermission: jest.fn(),
}));
jest.mock("expo-router", () => {
  function Stack({ children }: PropsWithChildren) {
    return children;
  }
  return { Stack: Object.assign(Stack, { Screen: () => null }) };
});
jest.mock("@expo/vector-icons", () => ({ Ionicons: "Icon" }));
jest.mock("expo-status-bar", () => ({ StatusBar: "StatusBar" }));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: "SafeAreaProvider",
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  Object.defineProperty(globalThis, "__DEV__", {
    value: false,
    configurable: true,
  });
  jest.mocked(startBugScreen).mockResolvedValue(undefined);
  jest.mocked(requestScreenshotPermission).mockResolvedValue(true);
});

afterEach(() => {
  jest.useRealTimers();
  Object.defineProperty(globalThis, "__DEV__", {
    value: true,
    configurable: true,
  });
});

test("Release startup requests screenshot access after dismissing the welcome", async () => {
  await render(<RootLayout />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(startBugScreen).toHaveBeenCalledTimes(1);
  expect(requestScreenshotPermission).not.toHaveBeenCalled();

  await fireEvent.press(screen.getByRole("button", { name: "Got it" }));
  await act(async () => {
    jest.advanceTimersByTime(400);
  });

  expect(requestScreenshotPermission).toHaveBeenCalledTimes(1);
});
