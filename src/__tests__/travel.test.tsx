import { beforeEach, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import ExploreScreen from "../app/(tabs)/index";
import SavedScreen from "../app/(tabs)/saved";
import { breadcrumbs } from "../bugscreen/bugscreen";
import { destinations, trips } from "../data/travel";
import { TravelProvider } from "../state/TravelProvider";

jest.mock("../bugscreen/bugscreen", () => ({
  breadcrumbs: { screenViewed: jest.fn(), saveToggled: jest.fn() },
}));
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), navigate: jest.fn() },
  useFocusEffect: jest.fn(),
}));
jest.mock("@expo/vector-icons", () => ({ Ionicons: "Icon" }));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: "SafeAreaView",
}));
jest.mock("expo-linear-gradient", () => ({ LinearGradient: "LinearGradient" }));

beforeEach(() => {
  jest.clearAllMocks();
});

test("the seeded favourites can be removed and the empty state returns to Explore", async () => {
  await render(
    <TravelProvider>
      <SavedScreen />
    </TravelProvider>,
  );
  expect(screen.getByText("Amalfi Coast")).toBeTruthy();
  expect(screen.getByText("Banff")).toBeTruthy();
  await fireEvent.press(
    screen.getByRole("button", { name: "Unsave Amalfi Coast" }),
  );
  await fireEvent.press(screen.getByRole("button", { name: "Unsave Banff" }));
  expect(screen.getByText("Nothing saved yet")).toBeTruthy();
  expect(breadcrumbs.saveToggled).toHaveBeenCalledWith("banff", false);
  await fireEvent.press(
    screen.getByRole("button", { name: "Start exploring" }),
  );
  expect(router.navigate).toHaveBeenCalledWith("/");
});

test("saving in Explore survives screen changes, and opening a card uses its destination", async () => {
  const view = await render(
    <TravelProvider>
      <ExploreScreen />
    </TravelProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Open Kyoto" }));
  expect(router.push).toHaveBeenCalledWith({
    pathname: "/destination/[id]",
    params: { id: "kyoto" },
  });
  await fireEvent.press(screen.getByRole("button", { name: "Save Kyoto" }));
  await view.rerender(
    <TravelProvider>
      <SavedScreen />
    </TravelProvider>,
  );
  expect(screen.getByText("Kyoto")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Unsave Kyoto" })).toBeTruthy();
});

test("every itinerary points to a bundled destination and includes its four sample days", () => {
  expect(destinations).toHaveLength(8);
  expect(trips).toHaveLength(3);
  for (const trip of trips) {
    for (const id of trip.destinationIds)
      expect(destinations.some((destination) => destination.id === id)).toBe(
        true,
      );
    expect(trip.days).toHaveLength(4);
    expect(trip.days.every((day) => day.items.length >= 2)).toBe(true);
  }
});
