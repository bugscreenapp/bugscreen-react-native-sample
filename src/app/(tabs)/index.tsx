import {
  DestinationCard,
  Heading,
  Page,
  useScreenBreadcrumb,
} from "../../components/TravelUI";
import { currentUser, destinations } from "../../data/travel";

export default function ExploreScreen() {
  useScreenBreadcrumb("explore");
  return (
    <Page>
      <Heading
        title="Explore"
        subtitle={`Where to next, ${currentUser.displayName.split(" ")[0]}?`}
      />
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </Page>
  );
}
