export interface TraktIds {
  trakt: number;
  slug: string;
  imdb?: string | null;
  tmdb?: number | null;
  tvdb?: number | null;
  tvrage?: number | null;
}

export interface TraktAirs {
  day: string;
  time: string;
  timezone: string;
}

export interface TraktShow {
  title: string;
  year: number;
  ids: TraktIds;

  overview?: string;
  first_aired?: string;
  airs?: TraktAirs;

  runtime?: number;
  certification?: string;
  network?: string;
  country?: string;
  trailer?: string;
  homepage?: string;

  status?:
    | "returning series"
    | "in production"
    | "planned"
    | "canceled"
    | "ended"
    | string;

  rating?: number;
  votes?: number;
  comment_count?: number;

  updated_at?: string;

  language?: string;
  available_translations?: string[];

  genres?: string[];

  aired_episodes?: number;
}

export interface TraktMovie {
  title: string;
  year: number;
  ids: TraktIds;

  tagline?: string;
  overview?: string;
  released?: string;
  runtime?: number;
  country?: string;

  trailer?: string;
  homepage?: string;

  status?: "released" | "in production" | "planned" | string;

  rating?: number;
  votes?: number;
  comment_count?: number;

  updated_at?: string;

  language?: string;
  available_translations?: string[];

  genres?: string[];

  certification?: string;
}

export interface TraktShowListItem {
  rank?: number;
  listed_at: string;
  type: "show";
  show: TraktShow;
}

export interface TraktMovieListItem {
  rank?: number;
  listed_at: string;
  type: "movie";
  movie: TraktMovie;
}

export type TraktListItem
  = | TraktShowListItem
    | TraktMovieListItem;

export type TraktStatus
  = | "favorite"
    | "watchlist";

export interface TraktNormalizedShow {
  kind: "show";
  title: string;

  source: "trakt.tv";
  externalId: string;

  metadata: {
    genres?: string[];
    description?: string;
    year: number;
    status: TraktStatus;
  };
}

export interface TraktNormalizedMovie {
  kind: "movie";
  title: string;

  source: "trakt.tv";
  externalId: string;

  metadata: {
    genres?: string[];
    description?: string;
    year: number;
    status: TraktStatus;
  };
}
