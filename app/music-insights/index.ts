import {
  allTime,
  eras,
  fixations,
  listeningTimeMachine,
  moodReads,
  musicalDna,
  oddFindingsArcade,
} from "./curated";
import {
  generatedAt,
  genres,
  peakMonths,
  recentMonths,
  recentRankings,
  recentWindow,
  sourceRange,
  summary,
  yearlySignal,
} from "./summary";

export const musicInsights = {
  generatedAt,
  sourceRange,
  recentWindow,
  summary,
  yearlySignal,
  recentMonths,
  peakMonths,
  genres,
  recentRankings,
  listeningTimeMachine,
  oddFindingsArcade,
  eras,
  musicalDna,
  moodReads,
  allTime,
  fixations,
} as const;
