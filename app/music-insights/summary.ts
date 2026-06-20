export const generatedAt = "2026-06-17";
export const sourceRange = "2014-2026";
export const recentWindow = {
  start: "2026-03-16",
  end: "2026-06-16",
} as const;

export const summary = {
  totalHours: 5381.1,
  totalStreams: 119456,
  peakYear: 2024,
  peakYearHours: 973.3,
  genreMatches: 885,
  genreCandidates: 1000,
} as const;

export const yearlySignal = [
  { year: 2014, hours: 33.2, streams: 1318, skipRate: 0.755 },
  { year: 2015, hours: 61.8, streams: 17157, skipRate: 0.138 },
  { year: 2016, hours: 202.9, streams: 4563, skipRate: 0.045 },
  { year: 2017, hours: 148.6, streams: 4141, skipRate: 0 },
  { year: 2018, hours: 601.5, streams: 12109, skipRate: 0 },
  { year: 2019, hours: 497.9, streams: 9996, skipRate: 0 },
  { year: 2020, hours: 502, streams: 8095, skipRate: 0 },
  { year: 2021, hours: 618.8, streams: 10825, skipRate: 0 },
  { year: 2022, hours: 766.5, streams: 14279, skipRate: 0.026 },
  { year: 2023, hours: 451.2, streams: 8664, skipRate: 0.331 },
  { year: 2024, hours: 973.3, streams: 17440, skipRate: 0.111 },
  { year: 2025, hours: 397.6, streams: 7845, skipRate: 0.065 },
  { year: 2026, hours: 125.8, streams: 3024, skipRate: 0.348 },
] as const;

export const recentMonths = [
  { month: "2023-07", hours: 0, streams: 8 },
  { month: "2023-08", hours: 51.6, streams: 680 },
  { month: "2023-09", hours: 57.8, streams: 890 },
  { month: "2023-10", hours: 57.8, streams: 1669 },
  { month: "2023-11", hours: 59, streams: 1283 },
  { month: "2023-12", hours: 52.3, streams: 744 },
  { month: "2024-01", hours: 70.5, streams: 846 },
  { month: "2024-02", hours: 119.6, streams: 1317 },
  { month: "2024-03", hours: 68.8, streams: 576 },
  { month: "2024-04", hours: 54.8, streams: 582 },
  { month: "2024-05", hours: 83, streams: 1343 },
  { month: "2024-06", hours: 67.1, streams: 1538 },
  { month: "2024-07", hours: 93.3, streams: 1897 },
  { month: "2024-08", hours: 92.4, streams: 1870 },
  { month: "2024-09", hours: 48, streams: 937 },
  { month: "2024-10", hours: 107.1, streams: 2532 },
  { month: "2024-11", hours: 106.3, streams: 2741 },
  { month: "2024-12", hours: 62.3, streams: 1261 },
  { month: "2025-01", hours: 65, streams: 1330 },
  { month: "2025-02", hours: 72.2, streams: 1381 },
  { month: "2025-03", hours: 90, streams: 1845 },
  { month: "2025-04", hours: 88.8, streams: 1868 },
  { month: "2025-05", hours: 13.6, streams: 228 },
  { month: "2025-06", hours: 9.3, streams: 161 },
  { month: "2025-07", hours: 11.6, streams: 217 },
  { month: "2025-08", hours: 17.2, streams: 286 },
  { month: "2025-09", hours: 7.8, streams: 139 },
  { month: "2025-10", hours: 5.4, streams: 101 },
  { month: "2025-11", hours: 5.1, streams: 100 },
  { month: "2025-12", hours: 11.6, streams: 189 },
  { month: "2026-01", hours: 15.2, streams: 491 },
  { month: "2026-02", hours: 3.4, streams: 185 },
  { month: "2026-03", hours: 31.3, streams: 568 },
  { month: "2026-04", hours: 11.7, streams: 255 },
  { month: "2026-05", hours: 36.6, streams: 828 },
  { month: "2026-06", hours: 27.6, streams: 697 },
] as const;

export const peakMonths = [
  { month: "2024-02", hours: 119.6, streams: 1317 },
  { month: "2018-04", hours: 115.1, streams: 2340 },
  { month: "2024-10", hours: 107.1, streams: 2532 },
  { month: "2024-11", hours: 106.3, streams: 2741 },
  { month: "2024-07", hours: 93.3, streams: 1897 },
  { month: "2024-08", hours: 92.4, streams: 1870 },
] as const;

export const genres = [
  { name: "black metal", hours: 1132.6, artists: 158, streams: 13816 },
  { name: "metal", hours: 1085.3, artists: 173, streams: 23364 },
  { name: "rock", hours: 905.2, artists: 204, streams: 22024 },
  { name: "ambient", hours: 488.9, artists: 88, streams: 5115 },
  { name: "alternative", hours: 477.6, artists: 101, streams: 10702 },
  { name: "heavy metal", hours: 473.2, artists: 95, streams: 11098 },
  { name: "death metal", hours: 429.1, artists: 66, streams: 8979 },
  { name: "electronic", hours: 414.1, artists: 107, streams: 8410 },
  { name: "experimental", hours: 391.1, artists: 90, streams: 4789 },
  { name: "classic rock", hours: 388, artists: 86, streams: 8070 },
  { name: "progressive metal", hours: 362.3, artists: 63, streams: 4777 },
  { name: "dark ambient", hours: 346.3, artists: 35, streams: 2921 },
] as const;

export const recentRankings = {
  artists: [
    { name: "CHVRCHES", value: "392 plays", meta: "19h" },
    { name: "Chappell Roan", value: "243 plays", meta: "9.2h" },
    { name: "Def Leppard", value: "83 plays", meta: "3.5h" },
    { name: "Madonna", value: "75 plays", meta: "4.2h" },
    { name: "Timecop1983", value: "59 plays", meta: "3.2h" },
    { name: "Elvis Presley", value: "50 plays", meta: "2.3h" },
    { name: "Forgotten Tomb", value: "48 plays", meta: "5.2h" },
    { name: "Queensryche", value: "44 plays", meta: "2.3h" },
  ],
  songs: [
    { name: "My Kink Is Karma", value: "35 plays", meta: "Chappell Roan" },
    { name: "Picture You", value: "31 plays", meta: "Chappell Roan" },
    { name: "Disheartenment", value: "29 plays", meta: "Forgotten Tomb" },
    { name: "Pink Pony Club", value: "26 plays", meta: "Chappell Roan" },
    { name: "Tether", value: "20 plays", meta: "CHVRCHES" },
    { name: "By the Throat", value: "18 plays", meta: "CHVRCHES" },
    { name: "Over", value: "18 plays", meta: "CHVRCHES" },
    { name: "Lies", value: "18 plays", meta: "CHVRCHES" },
  ],
  albums: [
    { name: "The Rise and Fall of a Midwest Princess", value: "229 plays", meta: "Chappell Roan" },
    { name: "The Bones of What You Believe (Special Edition)", value: "185 plays", meta: "CHVRCHES" },
    { name: "Love Is Dead", value: "62 plays", meta: "CHVRCHES" },
    { name: "Every Open Eye (Special Edition)", value: "61 plays", meta: "CHVRCHES" },
    { name: "Night Drive", value: "58 plays", meta: "Timecop1983" },
    { name: "Ray of Light", value: "56 plays", meta: "Madonna" },
    { name: "Songs To Leave", value: "48 plays", meta: "Forgotten Tomb" },
    { name: "Hysteria", value: "46 plays", meta: "Def Leppard" },
  ],
} as const;
