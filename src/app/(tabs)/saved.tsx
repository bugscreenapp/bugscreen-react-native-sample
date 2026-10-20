import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  DestinationCard,
  Heading,
  Page,
  PrimaryButton,
  styles,
  useScreenBreadcrumb,
} from "../../components/TravelUI";
import { destinations } from "../../data/travel";
import { useTravel } from "../../state/TravelProvider";
import { useTheme } from "../../theme";

export default function SavedScreen() {
  useScreenBreadcrumb("saved");
  const { savedIds } = useTravel();
  const { colors } = useTheme();
  const saved = destinations.filter((destination) =>
    savedIds.has(destination.id),
  );
  return (
    <Page>
      <Heading title="Saved" />
      {saved.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {saved.map((destination) => (
            <View key={destination.id} style={{ width: "47%" }}>
              <DestinationCard destination={destination} compact />
            </View>
          ))}
        </View>
      ) : (
        <View style={{ alignItems: "center", gap: 16, paddingVertical: 80 }}>
          <Ionicons name="heart-outline" color={colors.primary} size={52} />
          <Text style={[styles.title, { color: colors.text }]}>
            Nothing saved yet
          </Text>
          <Text
            style={{ color: colors.muted, textAlign: "center", lineHeight: 22 }}
          >
            Tap the heart on a place to keep it here for later.
          </Text>
          <PrimaryButton
            title="Start exploring"
            onPress={() => router.navigate("/")}
          />
        </View>
      )}
    </Page>
  );
}
