import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { breadcrumbs } from "../../bugscreen/bugscreen";
import {
  Heading,
  Page,
  PrimaryButton,
  styles,
} from "../../components/TravelUI";
import { trips } from "../../data/travel";
import { useTheme } from "../../theme";

export default function TripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = trips.find((item) => item.id === id);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      if (trip) breadcrumbs.tripOpened(trip.id);
    }, [trip]),
  );
  if (!trip)
    return (
      <Page>
        <Heading title="Trip not found" />
        <PrimaryButton
          title="View trips"
          onPress={() => router.replace("/trips")}
        />
      </Page>
    );
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.page,
        { paddingBottom: Math.max(insets.bottom, 20) },
      ]}
    >
      <Stack.Screen options={{ title: trip.title }} />
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.primary, fontWeight: "600" }}>
          {trip.subtitle}
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          {trip.summary}
        </Text>
      </View>
      {trip.days.map((day) => (
        <View key={day.label} style={{ flexDirection: "row", gap: 16 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primaryContainer,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: colors.onPrimaryContainer,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {day.label.replace("Day ", "").split("–")[0]}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 8, paddingBottom: 12 }}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {day.label}
            </Text>
            <Text
              style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}
            >
              {day.title}
            </Text>
            {day.items.map((item) => (
              <View key={item} style={{ flexDirection: "row", gap: 10 }}>
                <Text style={{ color: colors.secondary }}>•</Text>
                <Text style={{ color: colors.muted, flex: 1, lineHeight: 22 }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
