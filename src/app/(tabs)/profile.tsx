import type { ComponentProps, PropsWithChildren } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  presentReport,
  requestScreenshotPermission,
} from "../../bugscreen/bugscreen";
import { Page, styles, useScreenBreadcrumb } from "../../components/TravelUI";
import { currentUser as user } from "../../data/travel";
import { useTheme } from "../../theme";

function report() {
  if (!presentReport())
    Alert.alert(
      "BugScreen unavailable",
      "BugScreen could not start. Check the API key used to build the app.",
    );
}

export default function ProfileScreen() {
  useScreenBreadcrumb("profile");
  const { colors } = useTheme();
  return (
    <Page>
      <View style={{ alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: colors.primaryContainer,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 28, color: colors.onPrimaryContainer }}>
            AR
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {user.displayName}
        </Text>
        <Text style={{ color: colors.muted }}>{user.email}</Text>
        <Text
          style={{
            color: colors.onTertiaryContainer,
            backgroundColor: colors.tertiaryContainer,
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 12,
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {user.plan.replaceAll("_", " ").toUpperCase()}
        </Text>
      </View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outline,
            flexDirection: "row",
            paddingVertical: 20,
          },
        ]}
      >
        {[
          ["Trips", user.tripsPlanned],
          ["Countries", user.countriesVisited],
          ["Member since", user.memberSince],
        ].map(([label, value]) => (
          <View key={label} style={{ flex: 1, alignItems: "center", gap: 5 }}>
            <Text style={[styles.title, { color: colors.text }]}>{value}</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>{label}</Text>
          </View>
        ))}
      </View>
      <Group title="Settings">
        <Row
          icon="notifications-outline"
          title="Notifications"
          subtitle="Trip reminders and deals"
        />
        <Row
          icon="moon-outline"
          title="Appearance"
          subtitle="Follows your system theme"
        />
        <Row
          icon="lock-closed-outline"
          title="Privacy"
          subtitle="Manage your data"
          last
        />
      </Group>
      <Group title="Help">
        <Row
          icon="bug-outline"
          title="Report a problem"
          subtitle="Opens the BugScreen report form"
          onPress={report}
        />
        <Row
          icon="chatbubble-outline"
          title="Send feedback"
          subtitle="Tell us what you think"
          onPress={report}
        />
        <Row
          icon="camera-outline"
          title="Tip: take a screenshot"
          subtitle="Screenshot anywhere to report a bug instantly"
          onPress={() => {
            void requestScreenshotPermission()
              .then((granted) =>
                Alert.alert(
                  "Screenshot reporting",
                  granted
                    ? "Take a screenshot anywhere in the app to open BugScreen."
                    : "Enable Photos access in Settings, or use Report a problem.",
                ),
              )
              .catch(() =>
                Alert.alert(
                  "Screenshot access",
                  "Use Report a problem to report manually.",
                ),
              );
          }}
          last
        />
      </Group>
      <Group title="About">
        <Row
          icon="information-circle-outline"
          title="BugScreen Travel"
          subtitle="Version 1.0 · BugScreen Expo example app"
          last
        />
      </Group>
    </Page>
  );
}

function Group({ title, children }: PropsWithChildren<{ title: string }>) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text
        accessibilityRole="header"
        style={{
          color: colors.muted,
          fontSize: 16,
          fontWeight: "600",
          marginLeft: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.outline },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  icon,
  title,
  subtitle,
  onPress,
  last,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const { colors } = useTheme();
  const content = (
    <>
      <Ionicons name={icon} size={23} color={colors.primary} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "500" }}>
          {title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}>
          {subtitle}
        </Text>
      </View>
    </>
  );
  const style = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
    padding: 16,
    borderBottomWidth: last ? 0 : 1,
    borderBottomColor: colors.outline,
  };
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} style={style}>
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
