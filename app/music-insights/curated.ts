export const listeningTimeMachine = [
  {
    id: "moment-peak-feb-2024",
    label: "Peak month",
    title: "Feb 2024",
    period: "February 2024",
    badge: "120h",
    topArtist: "Sleep Research Facility",
    topAlbum: "Deep Frieze",
    topSong: "79ºs 83ºw",
    dominantGenre: "Ambient",
    totalHours: "119.6h",
    playCount: "1,317 plays",
    moodWeather:
      "A frozen, nocturnal drift chamber where the room stops blinking and the snow starts humming back.",
    weirdFixation:
      "Deep Frieze week: 20.1 hours in 2024-W11, with Sleep Research Facility turning one stretch of the month into pure weather.",
    jumpHref: "#music-timeline-title",
  },
  {
    id: "moment-black-metal-autumn",
    label: "Black Metal Autumn",
    title: "Nov 2018",
    period: "November 2018",
    badge: "69.5h",
    topArtist: "Deathspell Omega",
    topAlbum: "Si Monumentum Requires, Circumspice",
    topSong: "The Repellent Scars of Abandon and Election",
    dominantGenre: "Black metal",
    totalHours: "69.5h",
    playCount: "1,083 plays",
    moodWeather:
      "Dense cathedral smoke, theological static, and the feeling that every hallway leads deeper underground.",
    weirdFixation:
      "Si Monumentum Requires, Circumspice week: 5.2 hours in 2018-W46, enough to make the month feel like one long sermon.",
    jumpHref: "#music-era-title",
  },
  {
    id: "moment-heavy-metal-summer",
    label: "Heavy Metal Summer",
    title: "Jun 2022",
    period: "June 2022",
    badge: "90.5h",
    topArtist: "Mercyful Fate",
    topAlbum: "Metal Church",
    topSong: "The Ivory Gate of Dreams",
    dominantGenre: "Heavy metal",
    totalHours: "90.5h",
    playCount: "1,596 plays",
    moodWeather:
      "Windows down, iron in the air, classic riffs everywhere, but still with enough drama to feel like a late-night side quest.",
    weirdFixation:
      "Penetralia week: 4.3 hours of Jute Gyte in 2022-W10, a nearby glitch in an otherwise straight-ahead metal season.",
    jumpHref: "#music-era-title",
  },
  {
    id: "moment-ambient-winter",
    label: "Ambient Winter",
    title: "Feb 2024",
    period: "February 2024",
    badge: "56% ambient",
    topArtist: "Sleep Research Facility",
    topAlbum: "Deep Frieze",
    topSong: "79ºs 83ºw",
    dominantGenre: "Ambient",
    totalHours: "119.6h",
    playCount: "1,317 plays",
    moodWeather:
      "Glacial, suspended, and strangely comforting, like a radar station at the edge of the map quietly taking notes on the storm.",
    weirdFixation:
      "Deep Frieze week: 20.1 hours in 2024-W11, with the album briefly becoming the climate rather than the soundtrack.",
    jumpHref: "#music-genre-title",
  },
  {
    id: "moment-chvrches-chappell-era",
    label: "Recent era",
    title: "Apr-Jun 2026",
    period: "April through June 2026",
    badge: "CHVRCHES / Chappell",
    topArtist: "CHVRCHES",
    topAlbum: "The Bones of What You Believe (Special Edition)",
    topSong: "My Kink Is Karma",
    dominantGenre: "Synthpop",
    totalHours: "75.9h",
    playCount: "1,780 plays",
    moodWeather:
      "Glossy neon recovery music: bright hooks, identity voltage, and enough bite to keep the sweetness from getting sleepy.",
    weirdFixation:
      "The Bones of What You Believe week: 4.8 hours in 2026-W18, right before the Chappell Roan surge took over the front of the room.",
    jumpHref: "#music-current-title",
  },
] as const;

export const oddFindingsArcade = [
  {
    title: "Most Unhinged Repeat Day",
    period: "December 8, 2016",
    subject: `Elvis Presley / "That's All Right"`,
    stat: "70 plays in one day",
    variant: "legendary",
    explanation:
      "At some point this stopped being a song choice and became an event the room had to survive.",
    jumpHref: "#music-fixation-title",
  },
  {
    title: "Album You Apparently Moved Into",
    period: "2024-W11",
    subject: "Sleep Research Facility / Deep Frieze",
    stat: "20.1h in one week",
    variant: "frosted",
    explanation:
      "This was less listening to an album than temporarily relocating into a frozen research station.",
    jumpHref: "#music-fixation-title",
  },
  {
    title: "Artist That Haunted One Year",
    period: "2024",
    subject: "Sleep Research Facility",
    stat: "76.4h, all concentrated in one year",
    explanation:
      "An artist arrived, turned the weather system monochrome, and then mostly drifted back into the fog.",
    jumpHref: "#music-dna-title",
  },
  {
    title: "Genre Weather Warning",
    period: "Whole archive",
    subject: "Black metal",
    stat: "1,132.6h across 158 artists",
    explanation:
      "Meteorologists advise sustained darkness, theological static, and very poor visibility after midnight.",
    jumpHref: "#music-genre-title",
  },
  {
    title: "Skip Rate Crime Scene",
    period: "2014",
    subject: "Early archive behavior",
    stat: "75.5% skip rate",
    explanation:
      "The evidence suggests a maniac with the next-track button and absolutely no patience for setup time.",
    jumpHref: "#music-timeline-title",
  },
  {
    title: "Comfort Artist Beacon",
    period: "2014-2026",
    subject: "Def Leppard",
    stat: "13-year streak",
    explanation:
      "No matter what weird corridor the archive wandered into, this beacon stayed lit the entire time.",
    jumpHref: "#music-dna-title",
  },
  {
    title: "Sudden Obsession Detected",
    period: "2026-W19",
    subject: "Chappell Roan / The Rise and Fall of a Midwest Princess",
    stat: "95 plays, 4.2h in one week",
    explanation:
      "The sort of pop detour that starts as curiosity and ends with the whole dashboard wearing glitter.",
    jumpHref: "#music-current-title",
  },
] as const;

export const eras = [
  {
    title: "The Black Metal Autumn",
    period: "November 2018",
    type: "Genre",
    metric: "54.8h",
    share: "79% of month",
    description:
      "Black metal took 79% of listening time, with 656 meaningful plays. The anchor track was The Repellent Scars of Abandon and Election.",
  },
  {
    title: "The Heavy Metal Summer",
    period: "June 2022",
    type: "Genre",
    metric: "72.3h",
    share: "80% of month",
    description:
      "Heavy metal took 80% of listening time, with 1,082 meaningful plays. The anchor track was The Ivory Gate of Dreams.",
  },
  {
    title: "The Ambient Winter",
    period: "February 2024",
    type: "Genre",
    metric: "66.6h",
    share: "56% of month",
    description:
      "Ambient took 56% of listening time, with 486 meaningful plays. The anchor track was 79ºs 83ºw.",
  },
  {
    title: "The CHVRCHES Months",
    period: "April 2026",
    type: "Artist",
    metric: "6.1h",
    share: "52% of month",
    description:
      "CHVRCHES took 52% of listening time and became part of three strong months in 2026. The anchor track was Tether.",
  },
  {
    title: "The Bones of What You Believe Discovery",
    period: "April 2026",
    type: "Album",
    metric: "4.2h",
    share: "36% of month",
    description:
      "The CHVRCHES album took 36% of listening time that month, anchored by Tether.",
  },
  {
    title: "The Chappell Roan Chapter",
    period: "May 2026",
    type: "Artist",
    metric: "7.1h",
    share: "19% of month",
    description:
      "Chappell Roan took 19% of listening time, with My Kink Is Karma as the anchor track.",
  },
] as const;

export const musicalDna = [
  {
    title: "Foundational Artists",
    items: [
      { name: "Def Leppard", value: "13 active years", meta: "28.6h, 2014-2026" },
      { name: "Nine Inch Nails", value: "13 active years", meta: "26.6h, 2014-2026" },
      { name: "M83", value: "13 active years", meta: "4.1h, 2014-2026" },
      { name: "Queen", value: "13 active years", meta: "3.4h, 2014-2026" },
    ],
  },
  {
    title: "Evolution Artists",
    items: [
      { name: "Genesis", value: "7.3x rise", meta: "15.9h in 2020" },
      { name: "Popol Vuh", value: "8.4x rise", meta: "9.3h in 2024" },
      { name: "Code Orange", value: "6.8x rise", meta: "11h in 2021" },
      { name: "Candlemass", value: "6.6x rise", meta: "10.8h in 2023" },
    ],
  },
  {
    title: "One-Season Wonders",
    items: [
      { name: "Sleep Research Facility", value: "76.4h in 2024", meta: "100% of plays landed there" },
      { name: "Savatage", value: "19.9h in 2022", meta: "97% of plays landed there" },
      { name: "Swallow The Sun", value: "13.8h in 2018", meta: "96% of plays landed there" },
      { name: "King Gizzard & The Lizard Wizard", value: "12.7h in 2021", meta: "96% of plays landed there" },
    ],
  },
  {
    title: "Comfort Artists",
    items: [
      { name: "Def Leppard", value: "13 year streak", meta: "Returned every year in span" },
      { name: "Nine Inch Nails", value: "13 year streak", meta: "Returned every year in span" },
      { name: "M83", value: "13 year streak", meta: "Returned every year in span" },
      { name: "Korn", value: "12 year streak", meta: "75.5h total" },
    ],
  },
  {
    title: "Discovery Artists",
    items: [
      { name: "Denzel Curry", value: "first heard Jul 30", meta: "2.6h, 48 plays" },
      { name: "Jefferson Starship", value: "first heard Aug 23", meta: "1.4h, 24 plays" },
      { name: "Quadeca", value: "first heard Aug 12", meta: "1.3h, 20 plays" },
    ],
  },
] as const;

export const moodReads = [
  {
    title: "Recent Weather",
    value: "Glossy, vivid, neon-lit; charged, resilient, defiant",
    description:
      "Recent listening points toward pop radiance and identity play first, with momentum and defiance as the secondary color.",
    evidence: ["Synthpop", "Electropop", "CHVRCHES", "Chappell Roan", "My Kink Is Karma"],
  },
  {
    title: "Whole Archive Weather",
    value: "Charged, resilient, defiant; brooding, armored, nocturnal",
    description:
      "The full archive points toward momentum and defiance first, with shadow and catharsis as the secondary color.",
    evidence: ["Black metal", "Metal", "Sleep Research Facility", "Korn", "Deathspell Omega"],
  },
] as const;

export const allTime = {
  artists: [
    { name: "Sleep Research Facility", value: "76.6h", meta: "437 plays" },
    { name: "Korn", value: "75.5h", meta: "1,705 plays" },
    { name: "Deathspell Omega", value: "74.4h", meta: "886 plays" },
    { name: "Paysage D'Hiver", value: "67h", meta: "465 plays" },
    { name: "CHVRCHES", value: "59.4h", meta: "1,389 plays" },
    { name: "Jute Gyte", value: "40.4h", meta: "281 plays" },
    { name: "Darkthrone", value: "37.4h", meta: "475 plays" },
    { name: "Kanye West", value: "35.3h", meta: "13,286 plays" },
  ],
  songs: [
    { name: "79ºs 83ºw", value: "23.3h", meta: "Sleep Research Facility" },
    { name: "72ºs 49ºe", value: "15.6h", meta: "Sleep Research Facility" },
    { name: "82ºs 62ºe", value: "13.9h", meta: "Sleep Research Facility" },
    { name: "86ºs 115ºw", value: "10.8h", meta: "Sleep Research Facility" },
    { name: "80ºs 96ºe", value: "9.9h", meta: "Sleep Research Facility" },
    { name: "Disheartenment", value: "6.4h", meta: "Forgotten Tomb" },
  ],
  albums: [
    { name: "Deep Frieze", value: "73.5h", meta: "Sleep Research Facility" },
    { name: "Si Monumentum Requires, Circumspice", value: "29.8h", meta: "Deathspell Omega" },
    { name: "Rain Upon the Impure", value: "21.6h", meta: "The Ruins Of Beverast" },
    { name: "Spiral of Reflection", value: "20.6h", meta: "Ascend The Helix" },
    { name: "De Mysteriis Dom Sathanas", value: "20.6h", meta: "Mayhem" },
    { name: "Operation: Mindcrime", value: "20.2h", meta: "Queensrÿche" },
  ],
} as const;

export const fixations = [
  { title: "Deep Frieze week", value: "20.1h", meta: "Sleep Research Facility, 2024-W11" },
  { title: "79ºs 83ºw day", value: "3.3h", meta: "15 plays on 2024-03-16" },
  { title: "The Shadowthrone week", value: "12h", meta: "Satyricon, 2021-W27" },
  { title: "That's All Right day", value: "70 plays", meta: "Elvis Presley, 2016-12-08" },
  { title: "Audio gravity", value: "99.4%", meta: "5,371.9 audio hours vs 9.3 video hours" },
] as const;
