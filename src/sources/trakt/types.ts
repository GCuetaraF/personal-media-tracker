export interface TraktShow {
  title: string
  year: number
  ids: TraktIds

  overview?: string
  first_aired?: string
  airs?: {
    day: string
    time: string
    timezone: string
  }

  runtime?: number
  certification?: string
  network?: string
  country?: string
  trailer?: string
  homepage?: string
  status?: string
  rating?: number
  votes?: number
  comment_count?: number
  updated_at?: string
  language?: string
  available_translations?: string[]
  genres?: string[]
  aired_episodes?: number
}

export interface TraktIds {
  trakt: number
  slug: string
  tvdb?: number
  imdb?: string
  tmdb?: number
  tvrage?: number | null
}

export interface TraktShowListItem {
  rank?: number
  listed_at: string
  type: "show"
  show: TraktShow
}

export interface TraktNormalizedShow {
  kind: "show",
  title: string;

  source: "trakt.tv",
  externalId: string;

  metadata: {
    genres?: string[];
    description?: string;
    year: number;
    status: "favorite" | "watchlist"
  }
}