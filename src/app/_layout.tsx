import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  requestScreenshotPermission,
  startBugScreen,
} from "../bugscreen/bugscreen";
import { PrimaryButton, styles } from "../components/TravelUI";
import { TravelProvider } from "../state/TravelProvider";
import { useTheme } from "../theme";

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const [ready, setReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    let active = true;
    startBugScreen()
      .catch(() => {
        if (active) setSdkError(true);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || welcome || sdkError) return;
    // Let the welcome modal finish dismissing before Android presents permissions.
    const timer = setTimeout(() => {
      void requestScreenshotPermission()
        .then((granted) => {
          if (!granted)
            Alert.alert(
              "Screenshot access",
              "Automatic screenshot reporting may need Photos access in Settings. You can still report from Profile.",
            );
        })
        .catch(() =>
          Alert.alert(
            "Screenshot access",
            "Could not request permission. You can still report a problem from Profile.",
          ),
        );
    }, 400);
    return () => clearTimeout(timer);
  }, [ready, welcome, sdkError]);

  function dismissWelcome() {
    setWelcome(false);
  }

  return (
    <SafeAreaProvider>
      <TravelProvider>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {sdkError && (
            <Text
              accessibilityRole="alert"
              style={{ color: colors.error, padding: 16 }}
            >
              BugScreen could not start. Check your API key in .env.local, then
              restart Metro or rebuild the installed app.
            </Text>
          )}
          {ready ? (
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.background },
                headerShadowVisible: false,
                headerBackTitle: "Back",
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, title: "BugScreen Travel" }}
              />
              <Stack.Screen
                name="destination/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="trip/[id]" options={{ title: "Itinerary" }} />
            </Stack>
          ) : (
            <ActivityIndicator
              style={{ flex: 1 }}
              color={colors.primary}
              accessibilityLabel="Starting BugScreen Travel"
            />
          )}
        </View>
        <Modal
          visible={ready && welcome}
          transparent
          animationType="fade"
          onRequestClose={dismissWelcome}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.45)",
              padding: 32,
            }}
          >
            <View
              accessibilityViewIsModal
              style={{
                backgroundColor: colors.surface,
                borderRadius: 28,
                padding: 24,
                gap: 16,
                maxWidth: 420,
                width: "100%",
                alignSelf: "center",
              }}
            >
              <Ionicons
                name="scan-outline"
                size={42}
                color={colors.primary}
                style={{ alignSelf: "center" }}
              />
              <Text
                accessibilityRole="header"
                style={[
                  styles.title,
                  { color: colors.text, textAlign: "center" },
                ]}
              >
                Welcome to BugScreen Travel
              </Text>
              <Text
                style={{
                  color: colors.muted,
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                A sample travel app demoing BugScreen. Take a screenshot
                anywhere to report a bug — the report screen opens by itself.
              </Text>
              <PrimaryButton title="Got it" onPress={dismissWelcome} />
            </View>
          </View>
        </Modal>
      </TravelProvider>
    </SafeAreaProvider>
  );
}
