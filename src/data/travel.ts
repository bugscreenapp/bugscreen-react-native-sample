export type DestinationKind =
  | "beach"
  | "island"
  | "mountain"
  | "city"
  | "forest"
  | "desert"
  | "lake"
  | "countryside";

export interface Destination {
  id: string;
  name: string;
  country: string;
  kind: DestinationKind;
  blurb: string;
  description: string;
  highlights: string[];
  bestSeason: string;
  rating: number;
}

export interface Trip {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  destinationIds: string[];
  days: { label: string; title: string; items: string[] }[];
}

// The same bundled content as the iOS and Android Travel samples.
export const currentUser = {
  userId: "usr_84213",
  displayName: "Ava Rivera",
  email: "ava.rivera@example.com",
  plan: "explorer_pro",
  homeCity: "Lisbon",
  memberSince: "2022",
  tripsPlanned: 12,
  countriesVisited: 27,
};

export const destinations: Destination[] = [
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    kind: "city",
    blurb: "Temples, tea houses and quiet bamboo groves.",
    description:
      "Japan's former capital trades neon for nuance — a thousand shrines, moss gardens raked to perfection, and geisha districts that glow at dusk. Spring cherry blossoms and autumn maples draw crowds, but a dawn walk through Arashiyama still feels like a secret.",
    highlights: [
      "Fushimi Inari",
      "Arashiyama Bamboo",
      "Gion District",
      "Kinkaku-ji",
    ],
    bestSeason: "Mar–Apr · Nov",
    rating: 4.9,
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    kind: "beach",
    blurb: "Pastel villages stacked above a cobalt sea.",
    description:
      "Fifty kilometres of cliffside drama where lemon groves cling to the hills and ceramic-tiled domes catch the light. Ferry between Positano, Amalfi and Ravello, then find a hidden cove for an afternoon swim.",
    highlights: [
      "Positano",
      "Path of the Gods",
      "Ravello gardens",
      "Limoncello tasting",
    ],
    bestSeason: "May–Jun · Sep",
    rating: 4.8,
  },
  {
    id: "patagonia",
    name: "Torres del Paine",
    country: "Chile",
    kind: "mountain",
    blurb: "Granite spires, glaciers and roaming guanacos.",
    description:
      "Patagonia at its most theatrical: wind-scoured steppe giving way to turquoise lakes and the three sheer towers that give the park its name. The W trek strings together the highlights over four unforgettable days.",
    highlights: [
      "Base of the Towers",
      "Grey Glacier",
      "French Valley",
      "Lake Pehoé",
    ],
    bestSeason: "Nov–Mar",
    rating: 4.9,
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    kind: "island",
    blurb: "Whitewashed caldera towns and famous sunsets.",
    description:
      "A crescent of volcanic cliffs ringed by the Aegean. Blue-domed churches, black-sand beaches and Oia's legendary golden hour make this the postcard of the Cyclades — quieter and just as lovely one village over in Pyrgos.",
    highlights: [
      "Oia sunset",
      "Red Beach",
      "Ancient Akrotiri",
      "Caldera cruise",
    ],
    bestSeason: "May–Jun · Sep–Oct",
    rating: 4.7,
  },
  {
    id: "banff",
    name: "Banff",
    country: "Canada",
    kind: "lake",
    blurb: "Glacier-fed lakes ringed by the Rockies.",
    description:
      "The Canadian Rockies distilled: impossibly blue Lake Louise and Moraine Lake, hot springs to soak tired legs, and a walkable town where elk wander the streets at dusk. Endless trails fan out from every trailhead.",
    highlights: [
      "Moraine Lake",
      "Lake Louise",
      "Johnston Canyon",
      "Banff Gondola",
    ],
    bestSeason: "Jun–Sep",
    rating: 4.8,
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    kind: "desert",
    blurb: "A maze of souks on the edge of the Sahara.",
    description:
      "The Red City hums — spice-scented souks, hidden riad courtyards and the nightly theatre of Jemaa el-Fnaa. Escape the medina for the calm of the Majorelle Garden, or ride south toward the dunes of the desert.",
    highlights: [
      "Jemaa el-Fnaa",
      "Majorelle Garden",
      "Bahia Palace",
      "Atlas day trip",
    ],
    bestSeason: "Mar–May · Oct–Nov",
    rating: 4.6,
  },
  {
    id: "blackforest",
    name: "Black Forest",
    country: "Germany",
    kind: "forest",
    blurb: "Dense pine valleys, cuckoo clocks and spa towns.",
    description:
      "Fairytale country of dark wooded hills, half-timbered villages and waterfalls tucked into the folds. Drive the scenic Schwarzwaldhochstraße, then reward yourself with a slice of the region's namesake cherry cake.",
    highlights: [
      "Triberg Falls",
      "Titisee lake",
      "Baden-Baden spa",
      "Scenic road",
    ],
    bestSeason: "May–Sep",
    rating: 4.5,
  },
  {
    id: "tuscany",
    name: "Val d'Orcia",
    country: "Italy",
    kind: "countryside",
    blurb: "Rolling vineyards and cypress-lined roads.",
    description:
      "The Tuscany of the imagination: golden hills combed with vineyards, lone cypress trees on the ridgelines, and medieval hill towns serving Brunello by the glass. Slow mornings, long lunches, softer light.",
    highlights: ["Pienza", "Montalcino wine", "Bagno Vignoni", "Cypress road"],
    bestSeason: "Apr–Jun · Sep",
    rating: 4.7,
  },
];

export const trips: Trip[] = [
  {
    id: "trip_japan",
    title: "Classic Japan",
    subtitle: "8 days · Kyoto & around",
    summary:
      "Temples, gardens and slow mornings across Japan's cultural heart.",
    destinationIds: ["kyoto"],
    days: [
      {
        label:
          "Day 1Arrive in KyotoCheck in near GionEvening stroll along the Kamo RiverKaiseki dinner",
        title:
          "Arrive in KyotoCheck in near GionEvening stroll along the Kamo RiverKaiseki dinner",
        items: [
          "Check in near Gion",
          "Evening stroll along the Kamo River",
          "Kaiseki dinner",
        ],
      },
      {
        label:
          "Day 2Southern HigashiyamaFushimi Inari at dawnTofuku-ji gardensTea ceremony in the afternoon",
        title:
          "Southern HigashiyamaFushimi Inari at dawnTofuku-ji gardensTea ceremony in the afternoon",
        items: [
          "Fushimi Inari at dawn",
          "Tofuku-ji gardens",
          "Tea ceremony in the afternoon",
        ],
      },
      {
        label:
          "Day 3ArashiyamaBamboo grove before the crowdsOkochi-Sanso villaRiverside lunch",
        title:
          "ArashiyamaBamboo grove before the crowdsOkochi-Sanso villaRiverside lunch",
        items: [
          "Bamboo grove before the crowds",
          "Okochi-Sanso villa",
          "Riverside lunch",
        ],
      },
      {
        label:
          "Day 4Golden PavilionKinkaku-jiRyoan-ji rock gardenNishiki Market for dinner",
        title:
          "Golden PavilionKinkaku-jiRyoan-ji rock gardenNishiki Market for dinner",
        items: [
          "Kinkaku-ji",
          "Ryoan-ji rock garden",
          "Nishiki Market for dinner",
        ],
      },
    ],
  },
  {
    id: "trip_med",
    title: "Mediterranean Escape",
    subtitle: "10 days · Italy & Greece",
    summary:
      "Cliffside villages, ferries and sunsets from the Amalfi Coast to Santorini.",
    destinationIds: ["amalfi", "santorini"],
    days: [
      {
        label:
          "Day 1–2PositanoSettle into the cliffsideBeach club afternoonSunset aperitivo",
        title:
          "PositanoSettle into the cliffsideBeach club afternoonSunset aperitivo",
        items: [
          "Settle into the cliffside",
          "Beach club afternoon",
          "Sunset aperitivo",
        ],
      },
      {
        label:
          "Day 3Path of the GodsMorning hike to NocelleFerry to Amalfi townRavello gardens at golden hour",
        title:
          "Path of the GodsMorning hike to NocelleFerry to Amalfi townRavello gardens at golden hour",
        items: [
          "Morning hike to Nocelle",
          "Ferry to Amalfi town",
          "Ravello gardens at golden hour",
        ],
      },
      {
        label:
          "Day 4–5Fly to SantoriniCaldera-view hotel in OiaSunset point before dinner",
        title:
          "Fly to SantoriniCaldera-view hotel in OiaSunset point before dinner",
        items: ["Caldera-view hotel in Oia", "Sunset point before dinner"],
      },
      {
        label:
          "Day 6Island dayCatamaran around the calderaSwim at the hot springsWine tasting in Pyrgos",
        title:
          "Island dayCatamaran around the calderaSwim at the hot springsWine tasting in Pyrgos",
        items: [
          "Catamaran around the caldera",
          "Swim at the hot springs",
          "Wine tasting in Pyrgos",
        ],
      },
    ],
  },
  {
    id: "trip_patagonia",
    title: "Patagonia Trek",
    subtitle: "6 days · The W Circuit",
    summary:
      "Four days on the trail through Torres del Paine, bookended by Puerto Natales.",
    destinationIds: ["patagonia"],
    days: [
      {
        label:
          "Day 1Puerto NatalesGear check and briefingProvision for the trail",
        title: "Puerto NatalesGear check and briefingProvision for the trail",
        items: ["Gear check and briefing", "Provision for the trail"],
      },
      {
        label:
          "Day 2Base of the TowersSteep climb to the lookoutOvernight at Refugio Chileno",
        title:
          "Base of the TowersSteep climb to the lookoutOvernight at Refugio Chileno",
        items: ["Steep climb to the lookout", "Overnight at Refugio Chileno"],
      },
      {
        label: "Day 3French ValleyHanging glaciers overheadCamp at Los Cuernos",
        title: "French ValleyHanging glaciers overheadCamp at Los Cuernos",
        items: ["Hanging glaciers overhead", "Camp at Los Cuernos"],
      },
      {
        label:
          "Day 4Grey GlacierIce viewpoints along the lakeOptional kayak among the bergs",
        title:
          "Grey GlacierIce viewpoints along the lakeOptional kayak among the bergs",
        items: [
          "Ice viewpoints along the lake",
          "Optional kayak among the bergs",
        ],
      },
    ],
  },
];
