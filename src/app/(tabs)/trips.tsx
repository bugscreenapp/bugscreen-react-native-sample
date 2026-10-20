import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Heading,
  Hero,
  Page,
  styles,
  useScreenBreadcrumb,
} from "../../components/TravelUI";
import { destinations, trips } from "../../data/travel";
import { useTheme } from "../../theme";

export default function TripsScreen() {
  useScreenBreadcrumb("trips");
  const { colors } = useTheme();
  return (
    <Page>
      <Heading title="Trips" subtitle="Your planned itineraries" />
      {trips.map((trip) => (
        <Pressable
          key={trip.id}
          accessibilityRole="button"
          accessibilityLabel={`Open ${trip.title}`}
          onPress={() =>
            router.push({ pathname: "/trip/[id]", params: { id: trip.id } })
          }
          style={[
            styles.card,
            {
              flexDirection: "row",
              backgroundColor: colors.surface,
              borderColor: colors.outline,
            },
          ]}
        >
          <Hero
            kind={
              destinations.find(
                (destination) => destination.id === trip.destinationIds[0],
              )?.kind ?? "city"
            }
            style={{ width: 96, height: "100%", minHeight: 130 }}
          />
          <View
            style={{ flex: 1, padding: 16, gap: 7, justifyContent: "center" }}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {trip.title}
            </Text>
            <Text style={{ color: colors.primary, fontSize: 13 }}>
              {trip.subtitle}
            </Text>
            <Text
              style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}
              numberOfLines={2}
            >
              {trip.summary}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            color={colors.muted}
            size={18}
            style={{ alignSelf: "center", marginRight: 12 }}
          />
        </Pressable>
      ))}
    </Page>
  );
}
