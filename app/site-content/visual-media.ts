export type VisualMediaItem = {
  title: string;
  image: string;
  sourceUrl: string;
  itemUrl?: string;
  fit?: "contain";
};

export const visualMedia: readonly VisualMediaItem[] = [
  {
    title: "Twin Peaks Season 1",
    image: "/images/movies-tv/twin-peaks-season-1.jpg",
    sourceUrl: "https://watch.plex.tv/en-GB/show/twin-peaks/season/1",
  },
  {
    title: "Twin Peaks Season 2",
    image: "/images/movies-tv/twin-peaks-season-2.jpg",
    sourceUrl: "https://watch.plex.tv/show/twin-peaks/season/2",
  },
  {
    title: "Twin Peaks Season 3",
    image: "/images/movies-tv/twin-peaks-season-3.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Twin_Peaks:_The_Return",
  },
  {
    title: "Severance",
    image: "/images/movies-tv/severance.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Severance_(TV_series)",
    fit: "contain",
  },
  {
    title: "Widow's Bay",
    image: "/images/movies-tv/widows-bay.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Widow%27s_Bay",
    fit: "contain",
  },
  {
    title: "A Nightmare on Elm Street",
    image: "/images/movies-tv/nightmare-on-elm-street.jpg",
    itemUrl: "https://letterboxd.com/film/a-nightmare-on-elm-street/",
    sourceUrl: "https://en.wikipedia.org/wiki/A_Nightmare_on_Elm_Street",
  },
  {
    title: "Total Recall (1990)",
    image: "/images/movies-tv/total-recall-1990.jpg",
    itemUrl: "https://letterboxd.com/film/total-recall-1990/",
    sourceUrl: "https://en.wikipedia.org/wiki/Total_Recall_(1990_film)",
  },
  {
    title: "Pump Up the Volume",
    image: "/images/movies-tv/pump-up-the-volume.jpg",
    itemUrl: "https://letterboxd.com/film/pump-up-the-volume/",
    sourceUrl: "https://en.wikipedia.org/wiki/Pump_Up_the_Volume_(film)",
  },
  {
    title: "Deuce Bigalow",
    image: "/images/movies-tv/deuce-bigalow.jpg",
    itemUrl: "https://letterboxd.com/film/deuce-bigalow-male-gigolo/",
    sourceUrl: "https://en.wikipedia.org/wiki/Deuce_Bigalow:_Male_Gigolo",
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    image: "/images/movies-tv/eternal-sunshine.png",
    itemUrl: "https://letterboxd.com/film/eternal-sunshine-of-the-spotless-mind/",
    sourceUrl: "https://en.wikipedia.org/wiki/Eternal_Sunshine_of_the_Spotless_Mind",
  },
  {
    title: "Donnie Darko",
    image: "/images/movies-tv/donnie-darko.jpg",
    itemUrl: "https://letterboxd.com/film/donnie-darko/",
    sourceUrl: "https://en.wikipedia.org/wiki/Donnie_Darko",
  },
  {
    title: "Groundhog Day",
    image: "/images/movies-tv/groundhog-day.jpg",
    itemUrl: "https://letterboxd.com/film/groundhog-day/",
    sourceUrl: "https://en.wikipedia.org/wiki/Groundhog_Day_(film)",
  },
  {
    title: "The Game",
    image: "/images/movies-tv/the-game.jpg",
    itemUrl: "https://letterboxd.com/film/the-game/",
    sourceUrl: "https://en.wikipedia.org/wiki/The_Game_(1997_film)",
  },
  {
    title: "MXC: Most Extreme Elimination Challenge",
    image: "/images/movies-tv/mxc.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Most_Extreme_Elimination_Challenge",
    fit: "contain",
  },
  {
    title: "Just Like Heaven",
    image: "/images/movies-tv/just-like-heaven.jpg",
    itemUrl: "https://letterboxd.com/film/just-like-heaven-2005/",
    sourceUrl: "https://en.wikipedia.org/wiki/Just_like_Heaven_(2005_film)",
  },
  {
    title: "Return to Me",
    image: "/images/movies-tv/return-to-me.jpg",
    itemUrl: "https://letterboxd.com/film/return-to-me/",
    sourceUrl: "https://en.wikipedia.org/wiki/Return_to_Me",
  },
  {
    title: "Limitless",
    image: "/images/movies-tv/limitless.jpg",
    itemUrl: "https://letterboxd.com/film/limitless/",
    sourceUrl: "https://en.wikipedia.org/wiki/Limitless_(film)",
  },
] as const;
