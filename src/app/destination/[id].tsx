import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { breadcrumbs } from "../../bugscreen/bugscreen";
import {
  Hero,
  Page,
  Heading,
  PrimaryButton,
  Rating,
  SaveButton,
  styles,
} from "../../components/TravelUI";
import { destinations } from "../../data/travel";
import { useTheme } from "../../theme";

export default function DestinationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const destination = destinations.find((item) => item.id === id);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      if (destination) breadcrumbs.destinationOpened(destination.id);
    }, [destination]),
  );
  if (!destination)
    return (
      <Page>
        <Heading title="Destination not found" />
        <PrimaryButton
          title="Explore destinations"
          onPress={() => router.replace("/")}
        />
      </Page>
    );
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <Hero kind={destination.kind} style={{ height: 340 + insets.top }}>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.55)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 240,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 24,
              left: 20,
              right: 20,
              gap: 10,
            }}
          >
            <Rating value={destination.rating} />
            <Text
              accessibilityRole="header"
              style={[styles.heading, { color: "white" }]}
            >
              {destination.name}
            </Text>
            <Text style={{ color: "white", fontSize: 16 }}>
              ⌖ {destination.country}
            </Text>
          </View>
        </Hero>
        <View style={[styles.page, { paddingTop: 24 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={{ color: colors.text, fontSize: 15, flex: 1 }}>
              Best time to visit · {destination.bestSeason}
            </Text>
          </View>
          <Text style={[styles.body, { color: colors.muted }]}>
            {destination.description}
          </Text>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: colors.text }]}
          >
            Highlights
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {destination.highlights.map((highlight) => (
              <Text
                key={highlight}
                style={{
                  color: colors.onPrimaryContainer,
                  backgroundColor: colors.primaryContainer,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                }}
              >
                {highlight}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 12,
          right: 12,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/")
          }
          style={styles.circle}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <SaveButton destination={destination} />
      </View>
    </View>
  );
}
