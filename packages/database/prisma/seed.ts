import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const ROUNDS = 10;

// --- Data Definitions ---

const airlineData = [
  { id: "al-dal", name: "Delta Air Lines", baseCountry: "USA" },
  { id: "al-aal", name: "American Airlines", baseCountry: "USA" },
  { id: "al-ual", name: "United Airlines", baseCountry: "USA" },
  { id: "al-dlh", name: "Lufthansa", baseCountry: "Germany" },
  { id: "al-afr", name: "Air France", baseCountry: "France" },
  { id: "al-baw", name: "British Airways", baseCountry: "UK" },
  { id: "al-uae", name: "Emirates", baseCountry: "UAE" },
  { id: "al-qtr", name: "Qatar Airways", baseCountry: "Qatar" },
  { id: "al-sia", name: "Singapore Airlines", baseCountry: "Singapore" },
  { id: "al-cpa", name: "Cathay Pacific", baseCountry: "Hong Kong" },
  { id: "al-qfa", name: "Qantas", baseCountry: "Australia" },
  { id: "al-ana", name: "All Nippon Airways", baseCountry: "Japan" },
  { id: "al-jal", name: "Japan Airlines", baseCountry: "Japan" },
  {
    id: "al-klm",
    name: "KLM Royal Dutch Airlines",
    baseCountry: "Netherlands",
  },
  { id: "al-thy", name: "Turkish Airlines", baseCountry: "Turkey" },
  // --- 5 New Airlines ---
  { id: "al-aca", name: "Air Canada", baseCountry: "Canada" },
  { id: "al-ces", name: "China Eastern Airlines", baseCountry: "China" },
  { id: "al-aic", name: "Air India", baseCountry: "India" },
  { id: "al-tam", name: "LATAM Brasil", baseCountry: "Brazil" },
  {
    id: "al-swr",
    name: "Swiss International Air Lines",
    baseCountry: "Switzerland",
  },
  // --- Additional 30 Airlines for testing ---
  { id: "al-sas", name: "Scandinavian Airlines", baseCountry: "Sweden" },
  { id: "al-ibe", name: "Iberia", baseCountry: "Spain" },
  { id: "al-aer", name: "Aer Lingus", baseCountry: "Ireland" },
  { id: "al-fin", name: "Finnair", baseCountry: "Finland" },
  { id: "al-swa", name: "Southwest Airlines", baseCountry: "USA" },
  { id: "al-jet", name: "JetBlue Airways", baseCountry: "USA" },
  { id: "al-aal2", name: "Alaska Airlines", baseCountry: "USA" },
  { id: "al-spir", name: "Spirit Airlines", baseCountry: "USA" },
  { id: "al-wja", name: "WestJet", baseCountry: "Canada" },
  { id: "al-aze", name: "Azerbaijan Airlines", baseCountry: "Azerbaijan" },
  { id: "al-afl", name: "Aeroflot", baseCountry: "Russia" },
  { id: "al-lot", name: "LOT Polish Airlines", baseCountry: "Poland" },
  { id: "al-csa", name: "Czech Airlines", baseCountry: "Czech Republic" },
  { id: "al-tap", name: "TAP Air Portugal", baseCountry: "Portugal" },
  { id: "al-aua", name: "Austrian Airlines", baseCountry: "Austria" },
  { id: "al-bru", name: "Brussels Airlines", baseCountry: "Belgium" },
  { id: "al-aei", name: "Aer Arann", baseCountry: "Ireland" },
  { id: "al-eth", name: "Ethiopian Airlines", baseCountry: "Ethiopia" },
  { id: "al-sau", name: "Saudia", baseCountry: "Saudi Arabia" },
  { id: "al-ega", name: "EgyptAir", baseCountry: "Egypt" },
  { id: "al-ram", name: "Royal Air Maroc", baseCountry: "Morocco" },
  { id: "al-saa", name: "South African Airways", baseCountry: "South Africa" },
  { id: "al-kea", name: "Korean Air", baseCountry: "South Korea" },
  { id: "al-aal3", name: "Asiana Airlines", baseCountry: "South Korea" },
  { id: "al-eva", name: "EVA Air", baseCountry: "Taiwan" },
  { id: "al-cia", name: "China Airlines", baseCountry: "Taiwan" },
  { id: "al-tha", name: "Thai Airways", baseCountry: "Thailand" },
  { id: "al-maa", name: "Malaysia Airlines", baseCountry: "Malaysia" },
  { id: "al-gar", name: "Garuda Indonesia", baseCountry: "Indonesia" },
  { id: "al-vna", name: "Vietnam Airlines", baseCountry: "Vietnam" },
  // --- 14 New Airlines ---
  { id: "al-lan", name: "LATAM Chile", baseCountry: "Chile" },
  { id: "al-arg", name: "Aerolíneas Argentinas", baseCountry: "Argentina" },
  { id: "al-ava", name: "Avianca", baseCountry: "Colombia" },
  { id: "al-kqa", name: "Kenya Airways", baseCountry: "Kenya" },
  { id: "al-vir", name: "Virgin Atlantic", baseCountry: "UK" },
  { id: "al-scx", name: "Scoot", baseCountry: "Singapore" },
  { id: "al-nor", name: "Norwegian Air Shuttle", baseCountry: "Norway" },
  { id: "al-rja", name: "Royal Jordanian", baseCountry: "Jordan" },
  { id: "al-mea", name: "Middle East Airlines", baseCountry: "Lebanon" },
  {
    id: "al-pia",
    name: "Pakistan International Airlines",
    baseCountry: "Pakistan",
  },
  { id: "al-anz", name: "Air New Zealand", baseCountry: "New Zealand" },
  { id: "al-haw", name: "Hawaiian Airlines", baseCountry: "USA" },
  { id: "al-etd", name: "Etihad Airways", baseCountry: "UAE" },
  { id: "al-gfa", name: "Gulf Air", baseCountry: "Bahrain" },
];

const airportData = [
  {
    id: "ap-jfk",
    code: "JFK",
    name: "John F. Kennedy International Airport",
    country: "USA",
    latitude: 40.6413,
    longitude: -73.7781,
    servicedByAirlines: ["al-dal", "al-aal", "al-afr", "al-baw", "al-jal"],
  },
  {
    id: "ap-lax",
    code: "LAX",
    name: "Los Angeles International Airport",
    country: "USA",
    latitude: 33.9416,
    longitude: -118.4085,
    servicedByAirlines: ["al-dal", "al-ual", "al-sia", "al-qfa", "al-ana"],
  },
  {
    id: "ap-ord",
    code: "ORD",
    name: "O'Hare International Airport",
    country: "USA",
    latitude: 41.9742,
    longitude: -87.9073,
    servicedByAirlines: ["al-aal", "al-ual", "al-thy", "al-dlh"],
  },
  {
    id: "ap-lhr",
    code: "LHR",
    name: "London Heathrow Airport",
    country: "UK",
    latitude: 51.47,
    longitude: -0.4543,
    servicedByAirlines: ["al-baw", "al-dal", "al-aal", "al-sia", "al-uae"],
  },
  {
    id: "ap-cdg",
    code: "CDG",
    name: "Charles de Gaulle Airport",
    country: "France",
    latitude: 49.0097,
    longitude: 2.5479,
    servicedByAirlines: ["al-afr", "al-dal", "al-uae", "al-cpa"],
  },
  {
    id: "ap-fra",
    code: "FRA",
    name: "Frankfurt Airport",
    country: "Germany",
    latitude: 50.0379,
    longitude: 8.5622,
    servicedByAirlines: ["al-dlh", "al-ual", "al-sia", "al-thy", "al-qtr"],
  },
  {
    id: "ap-dxb",
    code: "DXB",
    name: "Dubai International Airport",
    country: "UAE",
    latitude: 25.2532,
    longitude: 55.3657,
    servicedByAirlines: ["al-uae", "al-qfa", "al-baw", "al-dlh", "al-sia"],
  },
  {
    id: "ap-hnd",
    code: "HND",
    name: "Tokyo Haneda Airport",
    country: "Japan",
    latitude: 35.5494,
    longitude: 139.7798,
    servicedByAirlines: ["al-ana", "al-jal", "al-dal", "al-sia", "al-cpa"],
  },
  {
    id: "ap-sin",
    code: "SIN",
    name: "Singapore Changi Airport",
    country: "Singapore",
    latitude: 1.3644,
    longitude: 103.9915,
    servicedByAirlines: ["al-sia", "al-qfa", "al-uae", "al-dlh", "al-cpa"],
  },
  {
    id: "ap-syd",
    code: "SYD",
    name: "Sydney Kingsford Smith Airport",
    country: "Australia",
    latitude: -33.9399,
    longitude: 151.1753,
    servicedByAirlines: ["al-qfa", "al-sia", "al-uae", "al-dal", "al-cpa"],
  },
  // --- 5 New Airports ---
  {
    id: "ap-yyz",
    code: "YYZ",
    name: "Toronto Pearson International Airport",
    country: "Canada",
    latitude: 43.6777,
    longitude: -79.6248,
    servicedByAirlines: [
      "al-aca",
      "al-dal",
      "al-baw",
      "al-dlh",
      "al-klm",
      "al-aic",
    ],
  },
  {
    id: "ap-gru",
    code: "GRU",
    name: "São Paulo/Guarulhos International Airport",
    country: "Brazil",
    latitude: -23.4319,
    longitude: -46.4692,
    servicedByAirlines: [
      "al-tam",
      "al-dal",
      "al-afr",
      "al-baw",
      "al-dlh",
      "al-swr",
    ],
  },
  {
    id: "ap-pek",
    code: "PEK",
    name: "Beijing Capital International Airport",
    country: "China",
    latitude: 40.0801,
    longitude: 116.5845,
    servicedByAirlines: [
      "al-ces",
      "al-afr",
      "al-dlh",
      "al-ual",
      "al-aca",
      "al-thy",
    ],
  },
  {
    id: "ap-del",
    code: "DEL",
    name: "Indira Gandhi International Airport",
    country: "India",
    latitude: 28.5562,
    longitude: 77.1,
    servicedByAirlines: [
      "al-aic",
      "al-baw",
      "al-dlh",
      "al-sia",
      "al-uae",
      "al-afr",
    ],
  },
  {
    id: "ap-ams",
    code: "AMS",
    name: "Amsterdam Airport Schiphol",
    country: "Netherlands",
    latitude: 52.3105,
    longitude: 4.7683,
    servicedByAirlines: [
      "al-klm",
      "al-dal",
      "al-afr",
      "al-sia",
      "al-uae",
      "al-swr",
    ],
  },
  // --- Additional 35 Airports for testing ---
  {
    id: "ap-ist",
    code: "IST",
    name: "Istanbul Airport",
    country: "Turkey",
    latitude: 41.2753,
    longitude: 28.7519,
    servicedByAirlines: ["al-thy", "al-dlh", "al-baw", "al-afr"],
  },
  {
    id: "ap-mad",
    code: "MAD",
    name: "Adolfo Suárez Madrid–Barajas Airport",
    country: "Spain",
    latitude: 40.4983,
    longitude: -3.5676,
    servicedByAirlines: ["al-ibe", "al-baw", "al-afr", "al-dal"],
  },
  {
    id: "ap-bcn",
    code: "BCN",
    name: "Barcelona–El Prat Airport",
    country: "Spain",
    latitude: 41.2974,
    longitude: 2.0833,
    servicedByAirlines: ["al-ibe", "al-baw", "al-afr"],
  },
  {
    id: "ap-dub",
    code: "DUB",
    name: "Dublin Airport",
    country: "Ireland",
    latitude: 53.4213,
    longitude: -6.27,
    servicedByAirlines: ["al-aer", "al-baw", "al-dal"],
  },
  {
    id: "ap-hel",
    code: "HEL",
    name: "Helsinki-Vantaa Airport",
    country: "Finland",
    latitude: 60.3172,
    longitude: 24.9633,
    servicedByAirlines: ["al-fin", "al-dlh", "al-sas"],
  },
  {
    id: "ap-arn",
    code: "ARN",
    name: "Stockholm Arlanda Airport",
    country: "Sweden",
    latitude: 59.6519,
    longitude: 17.9186,
    servicedByAirlines: ["al-sas", "al-dlh", "al-baw"],
  },
  {
    id: "ap-cph",
    code: "CPH",
    name: "Copenhagen Airport",
    country: "Denmark",
    latitude: 55.6181,
    longitude: 12.6561,
    servicedByAirlines: ["al-sas", "al-dlh", "al-baw", "al-klm"],
  },
  {
    id: "ap-vie",
    code: "VIE",
    name: "Vienna International Airport",
    country: "Austria",
    latitude: 48.1103,
    longitude: 16.5697,
    servicedByAirlines: ["al-aua", "al-dlh", "al-thy"],
  },
  {
    id: "ap-zrh",
    code: "ZRH",
    name: "Zurich Airport",
    country: "Switzerland",
    latitude: 47.4647,
    longitude: 8.5492,
    servicedByAirlines: ["al-swr", "al-dlh", "al-baw", "al-klm"],
  },
  {
    id: "ap-lis",
    code: "LIS",
    name: "Lisbon Portela Airport",
    country: "Portugal",
    latitude: 38.7742,
    longitude: -9.1342,
    servicedByAirlines: ["al-tap", "al-baw", "al-afr"],
  },
  {
    id: "ap-prg",
    code: "PRG",
    name: "Václav Havel Airport Prague",
    country: "Czech Republic",
    latitude: 50.1008,
    longitude: 14.26,
    servicedByAirlines: ["al-csa", "al-dlh", "al-baw"],
  },
  {
    id: "ap-war",
    code: "WAW",
    name: "Warsaw Chopin Airport",
    country: "Poland",
    latitude: 52.1657,
    longitude: 20.9671,
    servicedByAirlines: ["al-lot", "al-dlh", "al-thy"],
  },
  {
    id: "ap-bru",
    code: "BRU",
    name: "Brussels Airport",
    country: "Belgium",
    latitude: 50.9014,
    longitude: 4.4844,
    servicedByAirlines: ["al-bru", "al-dlh", "al-baw", "al-klm"],
  },
  {
    id: "ap-svo",
    code: "SVO",
    name: "Sheremetyevo International Airport",
    country: "Russia",
    latitude: 55.9726,
    longitude: 37.4146,
    servicedByAirlines: ["al-afl", "al-thy", "al-dlh"],
  },
  {
    id: "ap-add",
    code: "ADD",
    name: "Addis Ababa Bole International Airport",
    country: "Ethiopia",
    latitude: 8.9779,
    longitude: 38.7991,
    servicedByAirlines: ["al-eth", "al-thy", "al-uae"],
  },
  {
    id: "ap-jed",
    code: "JED",
    name: "King Abdulaziz International Airport",
    country: "Saudi Arabia",
    latitude: 21.6797,
    longitude: 39.1569,
    servicedByAirlines: ["al-sau", "al-uae", "al-thy"],
  },
  {
    id: "ap-cai",
    code: "CAI",
    name: "Cairo International Airport",
    country: "Egypt",
    latitude: 30.1219,
    longitude: 31.4056,
    servicedByAirlines: ["al-ega", "al-thy", "al-dlh", "al-baw"],
  },
  {
    id: "ap-cmn",
    code: "CMN",
    name: "Mohammed V International Airport",
    country: "Morocco",
    latitude: 33.3675,
    longitude: -7.5898,
    servicedByAirlines: ["al-ram", "al-afr", "al-ibe"],
  },
  {
    id: "ap-jnb",
    code: "JNB",
    name: "O.R. Tambo International Airport",
    country: "South Africa",
    latitude: -26.1367,
    longitude: 28.246,
    servicedByAirlines: ["al-saa", "al-uae", "al-thy", "al-baw"],
  },
  {
    id: "ap-icn",
    code: "ICN",
    name: "Incheon International Airport",
    country: "South Korea",
    latitude: 37.4602,
    longitude: 126.4407,
    servicedByAirlines: ["al-kea", "al-aal3", "al-ana", "al-dal"],
  },
  {
    id: "ap-tpe",
    code: "TPE",
    name: "Taiwan Taoyuan International Airport",
    country: "Taiwan",
    latitude: 25.0797,
    longitude: 121.2342,
    servicedByAirlines: ["al-eva", "al-cia", "al-sia"],
  },
  {
    id: "ap-bkk",
    code: "BKK",
    name: "Suvarnabhumi Airport",
    country: "Thailand",
    latitude: 13.6811,
    longitude: 100.7471,
    servicedByAirlines: ["al-tha", "al-sia", "al-uae", "al-thy"],
  },
  {
    id: "ap-kul",
    code: "KUL",
    name: "Kuala Lumpur International Airport",
    country: "Malaysia",
    latitude: 2.7456,
    longitude: 101.7098,
    servicedByAirlines: ["al-maa", "al-sia", "al-thy"],
  },
  {
    id: "ap-cgk",
    code: "CGK",
    name: "Soekarno–Hatta International Airport",
    country: "Indonesia",
    latitude: -6.1255,
    longitude: 106.6559,
    servicedByAirlines: ["al-gar", "al-sia", "al-thy"],
  },
  {
    id: "ap-sgn",
    code: "SGN",
    name: "Tan Son Nhat International Airport",
    country: "Vietnam",
    latitude: 10.8188,
    longitude: 106.6519,
    servicedByAirlines: ["al-vna", "al-sia", "al-thy"],
  },
  {
    id: "ap-mnl",
    code: "MNL",
    name: "Ninoy Aquino International Airport",
    country: "Philippines",
    latitude: 14.5086,
    longitude: 121.0194,
    servicedByAirlines: ["al-sia", "al-dal"],
  },
  {
    id: "ap-mel",
    code: "MEL",
    name: "Melbourne Airport",
    country: "Australia",
    latitude: -37.6733,
    longitude: 144.8433,
    servicedByAirlines: ["al-qfa", "al-sia", "al-uae"],
  },
  {
    id: "ap-akl",
    code: "AKL",
    name: "Auckland Airport",
    country: "New Zealand",
    latitude: -37.0082,
    longitude: 174.7924,
    servicedByAirlines: ["al-qfa", "al-sia"],
  },
  {
    id: "ap-mia",
    code: "MIA",
    name: "Miami International Airport",
    country: "USA",
    latitude: 25.7959,
    longitude: -80.287,
    servicedByAirlines: ["al-aal", "al-dal", "al-jet"],
  },
  {
    id: "ap-dfw",
    code: "DFW",
    name: "Dallas/Fort Worth International Airport",
    country: "USA",
    latitude: 32.8998,
    longitude: -97.0403,
    servicedByAirlines: ["al-aal", "al-dal", "al-swa"],
  },
  {
    id: "ap-atl",
    code: "ATL",
    name: "Hartsfield–Jackson Atlanta International Airport",
    country: "USA",
    latitude: 33.6407,
    longitude: -84.4277,
    servicedByAirlines: ["al-dal", "al-aal", "al-swa"],
  },
  {
    id: "ap-sea",
    code: "SEA",
    name: "Seattle–Tacoma International Airport",
    country: "USA",
    latitude: 47.4502,
    longitude: -122.3088,
    servicedByAirlines: ["al-aal2", "al-dal", "al-swa"],
  },
  {
    id: "ap-sfo",
    code: "SFO",
    name: "San Francisco International Airport",
    country: "USA",
    latitude: 33.9416,
    longitude: -122.3656,
    servicedByAirlines: ["al-ual", "al-dal", "al-swa"],
  },
  {
    id: "ap-bos",
    code: "BOS",
    name: "Boston Logan International Airport",
    country: "USA",
    latitude: 42.3656,
    longitude: -71.0096,
    servicedByAirlines: ["al-jet", "al-dal", "al-aal"],
  },
  {
    id: "ap-den",
    code: "DEN",
    name: "Denver International Airport",
    country: "USA",
    latitude: 39.8561,
    longitude: -104.6737,
    servicedByAirlines: ["al-ual", "al-swa", "al-dal"],
  },
  {
    id: "ap-las",
    code: "LAS",
    name: "Harry Reid International Airport",
    country: "USA",
    latitude: 36.084,
    longitude: -115.1537,
    servicedByAirlines: ["al-swa", "al-spir", "al-dal"],
  },
  // --- 18 New Airports ---
  {
    id: "ap-scl",
    code: "SCL",
    name: "Arturo Merino Benítez International Airport",
    country: "Chile",
    latitude: -33.393,
    longitude: -70.7858,
    servicedByAirlines: ["al-lan", "al-dal", "al-afr", "al-ibe"],
  },
  {
    id: "ap-eze",
    code: "EZE",
    name: "Ministro Pistarini International Airport",
    country: "Argentina",
    latitude: -34.8222,
    longitude: -58.5358,
    servicedByAirlines: ["al-arg", "al-dal", "al-afr", "al-klm"],
  },
  {
    id: "ap-bog",
    code: "BOG",
    name: "El Dorado International Airport",
    country: "Colombia",
    latitude: 4.7016,
    longitude: -74.1469,
    servicedByAirlines: ["al-ava", "al-dal", "al-afr", "al-thy"],
  },
  {
    id: "ap-nbo",
    code: "NBO",
    name: "Jomo Kenyatta International Airport",
    country: "Kenya",
    latitude: -1.3192,
    longitude: 36.9278,
    servicedByAirlines: ["al-kqa", "al-thy", "al-klm", "al-qtr"],
  },
  {
    id: "ap-los",
    code: "LOS",
    name: "Murtala Muhammed International Airport",
    country: "Nigeria",
    latitude: 6.5774,
    longitude: 3.3211,
    servicedByAirlines: ["al-eth", "al-thy", "al-baw", "al-vir"],
  },
  {
    id: "ap-cpt",
    code: "CPT",
    name: "Cape Town International Airport",
    country: "South Africa",
    latitude: -33.9648,
    longitude: 18.6017,
    servicedByAirlines: ["al-saa", "al-uae", "al-thy", "al-baw"],
  },
  {
    id: "ap-hkg",
    code: "HKG",
    name: "Hong Kong International Airport",
    country: "Hong Kong",
    latitude: 22.308,
    longitude: 113.9185,
    servicedByAirlines: ["al-cpa", "al-sia", "al-uae", "al-tha", "al-vir"],
  },
  {
    id: "ap-khi",
    code: "KHI",
    name: "Jinnah International Airport",
    country: "Pakistan",
    latitude: 24.9073,
    longitude: 67.1608,
    servicedByAirlines: ["al-pia", "al-uae", "al-thy", "al-sau"],
  },
  {
    id: "ap-amm",
    code: "AMM",
    name: "Queen Alia International Airport",
    country: "Jordan",
    latitude: 31.7226,
    longitude: 35.9932,
    servicedByAirlines: ["al-rja", "al-thy", "al-uae", "al-qtr"],
  },
  {
    id: "ap-bey",
    code: "BEY",
    name: "Beirut–Rafic Hariri International Airport",
    country: "Lebanon",
    latitude: 33.8209,
    longitude: 35.4884,
    servicedByAirlines: ["al-mea", "al-thy", "al-afr", "al-qtr"],
  },
  {
    id: "ap-ruh",
    code: "RUH",
    name: "King Khalid International Airport",
    country: "Saudi Arabia",
    latitude: 24.9576,
    longitude: 46.6988,
    servicedByAirlines: ["al-sau", "al-uae", "al-thy", "al-baw"],
  },
  {
    id: "ap-doh",
    code: "DOH",
    name: "Hamad International Airport",
    country: "Qatar",
    latitude: 25.2731,
    longitude: 51.6081,
    servicedByAirlines: ["al-qtr", "al-baw", "al-thy", "al-sau"],
  },
  {
    id: "ap-bah",
    code: "BAH",
    name: "Bahrain International Airport",
    country: "Bahrain",
    latitude: 26.2708,
    longitude: 50.6336,
    servicedByAirlines: ["al-gfa", "al-uae", "al-thy", "al-baw"],
  },
  {
    id: "ap-mct",
    code: "MCT",
    name: "Muscat International Airport",
    country: "Oman",
    latitude: 23.5933,
    longitude: 58.2844,
    servicedByAirlines: ["al-uae", "al-thy", "al-qtr", "al-gfa"],
  },
  {
    id: "ap-hnl",
    code: "HNL",
    name: "Daniel K. Inouye International Airport",
    country: "USA",
    latitude: 21.3187,
    longitude: -157.9224,
    servicedByAirlines: ["al-haw", "al-ual", "al-dal", "al-ana"],
  },
  {
    id: "ap-osl",
    code: "OSL",
    name: "Oslo Gardermoen Airport",
    country: "Norway",
    latitude: 60.1976,
    longitude: 11.1004,
    servicedByAirlines: ["al-nor", "al-sas", "al-klm", "al-thy"],
  },
  {
    id: "ap-wlg",
    code: "WLG",
    name: "Wellington International Airport",
    country: "New Zealand",
    latitude: -41.3272,
    longitude: 174.8052,
    servicedByAirlines: ["al-anz", "al-qfa"],
  },
  {
    id: "ap-chc",
    code: "CHC",
    name: "Christchurch International Airport",
    country: "New Zealand",
    latitude: -43.4894,
    longitude: 172.5322,
    servicedByAirlines: ["al-anz", "al-qfa", "al-sia"],
  },
];

const routeData = [
  // Transatlantic
  { id: "rt-01", from: "ap-jfk", to: "ap-lhr", airline: "al-baw", dist: 5540 },
  { id: "rt-02", from: "ap-jfk", to: "ap-lhr", airline: "al-dal", dist: 5540 },
  { id: "rt-03", from: "ap-jfk", to: "ap-cdg", airline: "al-afr", dist: 5830 },
  { id: "rt-04", from: "ap-jfk", to: "ap-fra", airline: "al-dlh", dist: 6200 },
  { id: "rt-05", from: "ap-ord", to: "ap-fra", airline: "al-ual", dist: 6960 },
  { id: "rt-06", from: "ap-ord", to: "ap-lhr", airline: "al-aal", dist: 6350 },
  { id: "rt-07", from: "ap-lax", to: "ap-lhr", airline: "al-baw", dist: 8780 },
  { id: "rt-08", from: "ap-lax", to: "ap-cdg", airline: "al-afr", dist: 9090 },
  // Transpacific
  { id: "rt-09", from: "ap-lax", to: "ap-hnd", airline: "al-ana", dist: 8840 },
  { id: "rt-10", from: "ap-lax", to: "ap-hnd", airline: "al-jal", dist: 8840 },
  { id: "rt-11", from: "ap-lax", to: "ap-sin", airline: "al-sia", dist: 14110 },
  { id: "rt-12", from: "ap-lax", to: "ap-syd", airline: "al-qfa", dist: 12050 },
  { id: "rt-13", from: "ap-jfk", to: "ap-hnd", airline: "al-jal", dist: 10850 },
  { id: "rt-14", from: "ap-ord", to: "ap-hnd", airline: "al-ana", dist: 10140 },
  // Europe-Asia/Middle East
  { id: "rt-15", from: "ap-lhr", to: "ap-dxb", airline: "al-uae", dist: 5500 },
  { id: "rt-16", from: "ap-lhr", to: "ap-dxb", airline: "al-baw", dist: 5500 },
  { id: "rt-17", from: "ap-lhr", to: "ap-sin", airline: "al-sia", dist: 10840 },
  { id: "rt-18", from: "ap-cdg", to: "ap-dxb", airline: "al-uae", dist: 5240 },
  { id: "rt-19", from: "ap-cdg", to: "ap-sin", airline: "al-sia", dist: 10730 },
  { id: "rt-20", from: "ap-fra", to: "ap-dxb", airline: "al-dlh", dist: 4840 },
  { id: "rt-21", from: "ap-fra", to: "ap-sin", airline: "al-sia", dist: 10260 },
  { id: "rt-22", from: "ap-fra", to: "ap-hnd", airline: "al-dlh", dist: 9340 },
  // Asia-Pacific
  { id: "rt-23", from: "ap-sin", to: "ap-syd", airline: "al-sia", dist: 6300 },
  { id: "rt-24", from: "ap-sin", to: "ap-syd", airline: "al-qfa", dist: 6300 },
  { id: "rt-25", from: "ap-sin", to: "ap-hnd", airline: "al-sia", dist: 5300 },
  { id: "rt-26", from: "ap-hnd", to: "ap-syd", airline: "al-ana", dist: 7800 },
  { id: "rt-27", from: "ap-dxb", to: "ap-syd", airline: "al-uae", dist: 12040 },
  { id: "rt-28", from: "ap-dxb", to: "ap-sin", airline: "al-uae", dist: 5840 },
  // US Domestic (for variety)
  { id: "rt-29", from: "ap-jfk", to: "ap-lax", airline: "al-dal", dist: 3980 },
  { id: "rt-30", from: "ap-jfk", to: "ap-lax", airline: "al-aal", dist: 3980 },
  // --- 20 New Routes ---
  // North America - New connections
  { id: "rt-31", from: "ap-yyz", to: "ap-lhr", airline: "al-aca", dist: 5710 },
  { id: "rt-32", from: "ap-yyz", to: "ap-fra", airline: "al-dlh", dist: 6340 },
  { id: "rt-33", from: "ap-yyz", to: "ap-ams", airline: "al-klm", dist: 6000 },
  { id: "rt-34", from: "ap-jfk", to: "ap-ams", airline: "al-klm", dist: 5850 },
  { id: "rt-35", from: "ap-ord", to: "ap-yyz", airline: "al-aca", dist: 700 },
  { id: "rt-36", from: "ap-lax", to: "ap-yyz", airline: "al-aca", dist: 3490 },
  // South America connections
  { id: "rt-37", from: "ap-gru", to: "ap-jfk", airline: "al-dal", dist: 7680 },
  { id: "rt-38", from: "ap-gru", to: "ap-lhr", airline: "al-baw", dist: 9450 },
  { id: "rt-39", from: "ap-gru", to: "ap-fra", airline: "al-dlh", dist: 9780 },
  { id: "rt-40", from: "ap-gru", to: "ap-cdg", airline: "al-afr", dist: 9400 },
  // Asia - New connections (China, India)
  { id: "rt-41", from: "ap-pek", to: "ap-ord", airline: "al-ual", dist: 10500 },
  { id: "rt-42", from: "ap-pek", to: "ap-fra", airline: "al-dlh", dist: 7770 },
  { id: "rt-43", from: "ap-pek", to: "ap-cdg", airline: "al-afr", dist: 8200 },
  { id: "rt-44", from: "ap-pek", to: "ap-yyz", airline: "al-aca", dist: 10000 },
  { id: "rt-45", from: "ap-del", to: "ap-lhr", airline: "al-baw", dist: 6720 },
  { id: "rt-46", from: "ap-del", to: "ap-fra", airline: "al-dlh", dist: 6140 },
  { id: "rt-47", from: "ap-del", to: "ap-dxb", airline: "al-uae", dist: 2180 },
  { id: "rt-48", from: "ap-del", to: "ap-sin", airline: "al-sia", dist: 4150 },
  // Europe - New connections (Amsterdam, Swiss)
  { id: "rt-49", from: "ap-ams", to: "ap-dxb", airline: "al-klm", dist: 5160 },
  { id: "rt-50", from: "ap-ams", to: "ap-sin", airline: "al-sia", dist: 10450 },
  // --- 30 New Routes ---
  { id: "rt-51", from: "ap-scl", to: "ap-eze", airline: "al-lan", dist: 1140 },
  { id: "rt-52", from: "ap-scl", to: "ap-mia", airline: "al-lan", dist: 6660 },
  {
    id: "rt-53",
    from: "ap-eze",
    to: "ap-mad",
    airline: "al-arg",
    dist: 10050,
  },
  { id: "rt-54", from: "ap-bog", to: "ap-mia", airline: "al-ava", dist: 2430 },
  { id: "rt-55", from: "ap-bog", to: "ap-mad", airline: "al-ava", dist: 8030 },
  { id: "rt-56", from: "ap-nbo", to: "ap-ams", airline: "al-kqa", dist: 6660 },
  { id: "rt-57", from: "ap-nbo", to: "ap-dxb", airline: "al-kqa", dist: 3560 },
  { id: "rt-58", from: "ap-los", to: "ap-lhr", airline: "al-vir", dist: 5010 },
  { id: "rt-59", from: "ap-cpt", to: "ap-dxb", airline: "al-uae", dist: 7630 },
  {
    id: "rt-60",
    from: "ap-hkg",
    to: "ap-lax",
    airline: "al-cpa",
    dist: 11670,
  },
  { id: "rt-61", from: "ap-hkg", to: "ap-lhr", airline: "al-cpa", dist: 9630 },
  { id: "rt-62", from: "ap-khi", to: "ap-dxb", airline: "al-pia", dist: 1190 },
  {
    id: "rt-63",
    from: "ap-amm",
    to: "ap-fra",
    airline: "al-rja",
    dist: 2930,
  },
  { id: "rt-64", from: "ap-bey", to: "ap-cdg", airline: "al-mea", dist: 3190 },
  { id: "rt-65", from: "ap-ruh", to: "ap-lhr", airline: "al-sau", dist: 4950 },
  { id: "rt-66", from: "ap-doh", to: "ap-lhr", airline: "al-qtr", dist: 5230 },
  { id: "rt-67", from: "ap-bah", to: "ap-lhr", airline: "al-gfa", dist: 5140 },
  { id: "rt-68", from: "ap-mct", to: "ap-dxb", airline: "al-uae", dist: 350 },
  {
    id: "rt-69",
    from: "ap-hnl",
    to: "ap-lax",
    airline: "al-haw",
    dist: 4110,
  },
  {
    id: "rt-70",
    from: "ap-hnl",
    to: "ap-hnd",
    airline: "al-haw",
    dist: 6170,
  },
  { id: "rt-71", from: "ap-osl", to: "ap-jfk", airline: "al-nor", dist: 5920 },
  { id: "rt-72", from: "ap-akl", to: "ap-syd", airline: "al-anz", dist: 2160 },
  {
    id: "rt-73",
    from: "ap-akl",
    to: "ap-lax",
    airline: "al-anz",
    dist: 10480,
  },
  { id: "rt-74", from: "ap-chc", to: "ap-syd", airline: "al-qfa", dist: 2120 },
  { id: "rt-75", from: "ap-lhr", to: "ap-hkg", airline: "al-vir", dist: 9630 },
  { id: "rt-76", from: "ap-dxb", to: "ap-doh", airline: "al-qtr", dist: 380 },
  { id: "rt-77", from: "ap-sin", to: "ap-kul", airline: "al-scx", dist: 300 },
  { id: "rt-78", from: "ap-jfk", to: "ap-sfo", airline: "al-ual", dist: 4160 },
  { id: "rt-79", from: "ap-dub", to: "ap-ord", airline: "al-aer", dist: 6200 },
  { id: "rt-80", from: "ap-ist", to: "ap-jfk", airline: "al-thy", dist: 8020 },
];

async function main() {
  console.log("Start seeding ...");

  // --- Create User ---
  const password = await bcrypt.hash("password123", ROUNDS);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: password,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // --- Create Airlines (sequentially) ---
  console.log("Creating airlines ...");
  for (const airline of airlineData) {
    await prisma.airline.upsert({
      where: { id: airline.id },
      update: {},
      create: airline,
    });
  }
  console.log(`Created ${airlineData.length} airlines.`);

  // --- Create Airports (sequentially) ---
  console.log("Creating airports and linking airlines ...");
  for (const airport of airportData) {
    const { servicedByAirlines, ...airportDetails } = airport;
    await prisma.airport.upsert({
      where: { code: airport.code },
      update: {},
      create: {
        ...airportDetails,
        servicedByAirlines: {
          connect: servicedByAirlines.map((airlineId) => ({
            id: airlineId,
          })),
        },
      },
    });
  }
  console.log(`Created ${airportData.length} airports.`);

  // --- Create Routes (sequentially) ---
  console.log("Creating routes ...");
  for (const route of routeData) {
    try {
      await prisma.route.upsert({
        where: { id: route.id },
        update: {},
        create: {
          id: route.id,
          fromAirportId: route.from,
          toAirportId: route.to,
          airlineId: route.airline,
          distanceKm: route.dist,
        },
      });
    } catch (e: any) {
      // Add enhanced logging in case of failure
      if (e.code === "P2003") {
        console.error(
          `\n--- FAILED TO CREATE ROUTE: ${route.id} (${route.from} -> ${route.to}) ---`
        );
        console.error(
          `Foreign key constraint failed. Checking which ID is missing...`
        );
        console.error(`Constraint failed: ${e.meta?.constraint}`);

        // Check if related records exist
        const from = await prisma.airport.findUnique({
          where: { id: route.from },
        });
        const to = await prisma.airport.findUnique({ where: { id: route.to } });
        const airline = await prisma.airline.findUnique({
          where: { id: route.airline },
        });

        if (!from)
          console.error(
            `*** MISSING Airport 'fromAirportId': ${route.from} ***`
          );
        if (!to)
          console.error(`*** MISSING Airport 'toAirportId': ${route.to} ***`);
        if (!airline)
          console.error(
            `*** MISSING Airline 'airlineId': ${route.airline} ***`
          );
      }
      // Re-throw the original error to stop the seed
      throw e;
    }
  }
  console.log(`Created ${routeData.length} routes.`);

  console.log("Seeding finished.");
}

// --- Execute Seed ---
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
