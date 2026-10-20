import {
  useCallback,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { breadcrumbs } from "../bugscreen/bugscreen";
import type { Destination, DestinationKind } from "../data/travel";
import { useTravel } from "../state/TravelProvider";
import { useTheme } from "../theme";

type IconName = ComponentProps<typeof Ionicons>["name"];
const heroes: Record<
  DestinationKind,
  { colors: [string, string]; icon: IconName }
> = {
  beach: { colors: ["#16A3B0", "#0E7490"], icon: "umbrella-outline" },
  island: { colors: ["#0EA5A5", "#2563A6"], icon: "boat-outline" },
  mountain: { colors: ["#4B6CB7", "#182848"], icon: "trail-sign-outline" },
  city: { colors: ["#7B2A86", "#B5307E"], icon: "business-outline" },
  forest: { colors: ["#2E7D5B", "#14532D"], icon: "leaf-outline" },
  desert: { colors: ["#F2683C", "#C2410C"], icon: "sunny-outline" },
  lake: { colors: ["#1D8FA8", "#0F5C7A"], icon: "water-outline" },
  countryside: { colors: ["#8FA33A", "#B8860B"], icon: "flower-outline" },
};

export function useScreenBreadcrumb(name: string) {
  useFocusEffect(
    useCallback(() => {
      breadcrumbs.screenViewed(name);
    }, [name]),
  );
}

export function Page({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.page}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function Heading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <Text
        accessibilityRole="header"
        style={[styles.heading, { color: colors.text }]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.body, { color: colors.muted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

export function Hero({
  kind,
  children,
  style,
}: PropsWithChildren<{ kind: DestinationKind; style?: StyleProp<ViewStyle> }>) {
  const hero = heroes[kind];
  return (
    <LinearGradient
      colors={hero.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, style]}
    >
      <Ionicons
        name={hero.icon}
        size={180}
        color="rgba(255,255,255,0.16)"
        style={styles.heroIcon}
      />
      {children}
    </LinearGradient>
  );
}

export function SaveButton({ destination }: { destination: Destination }) {
  const { savedIds, toggleSaved } = useTravel();
  const saved = savedIds.has(destination.id);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${saved ? "Unsave" : "Save"} ${destination.name}`}
      accessibilityState={{ selected: saved }}
      hitSlop={4}
      onPress={() => toggleSaved(destination.id)}
      style={styles.circle}
    >
      <Ionicons
        name={saved ? "heart" : "heart-outline"}
        size={23}
        color={saved ? "#FF5A5F" : "#FFFFFF"}
      />
    </Pressable>
  );
}

export function Rating({ value }: { value: number }) {
  return (
    <View style={styles.rating}>
      <Ionicons name="star" size={13} color="#FFC531" />
      <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
        {value.toFixed(1)}
      </Text>
    </View>
  );
}

export function DestinationCard({
  destination,
  compact = false,
}: {
  destination: Destination;
  compact?: boolean;
}) {
  return (
    <View style={{ borderRadius: compact ? 20 : 24, overflow: "hidden" }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${destination.name}`}
        onPress={() =>
          router.push({
            pathname: "/destination/[id]",
            params: { id: destination.id },
          })
        }
      >
        <Hero kind={destination.kind} style={{ height: compact ? 150 : 230 }}>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.55)"]}
            style={StyleSheet.absoluteFill}
          />
          {!compact && (
            <View style={{ position: "absolute", top: 12, left: 12 }}>
              <Rating value={destination.rating} />
            </View>
          )}
          <View
            style={{
              position: "absolute",
              bottom: compact ? 14 : 18,
              left: compact ? 14 : 18,
              right: 14,
              gap: 3,
            }}
          >
            {!compact && (
              <Text
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {destination.country.toUpperCase()}
              </Text>
            )}
            <Text
              style={{
                color: "white",
                fontSize: compact ? 16 : 24,
                fontWeight: "600",
              }}
              numberOfLines={1}
            >
              {destination.name}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: compact ? 12 : 14,
              }}
              numberOfLines={1}
            >
              {compact ? destination.country : destination.blurb}
            </Text>
          </View>
        </Hero>
      </Pressable>
      <View style={[styles.savePosition, compact && { top: 8, right: 8 }]}>
        <SaveButton destination={destination} />
      </View>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.primaryButton, { backgroundColor: colors.primary }]}
    >
      <Text
        style={{ color: colors.onPrimary, fontSize: 15, fontWeight: "600" }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 32,
    gap: 20,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },
  heading: { fontSize: 34, fontWeight: "600", letterSpacing: -0.7 },
  title: { fontSize: 22, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 25 },
  card: { borderRadius: 20, overflow: "hidden", borderWidth: 1 },
  cardTitle: { fontSize: 20, fontWeight: "600" },
  hero: { height: 200, overflow: "hidden" },
  heroIcon: { position: "absolute", right: -28, bottom: -28 },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  savePosition: { position: "absolute", top: 12, right: 12 },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.32)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  primaryButton: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
});
