export interface MangaDexCollectionResponse<T> {
  result: "ok" | "error"
  response: "collection"
  data: T[]
  limit: number
  offset: number
  total: number
}

export type MangaDexFollowedMangaResponse =
  MangaDexCollectionResponse<MangaDexManga>

export interface MangaDexManga {
  id: string
  type: "manga"
  attributes: MangaDexMangaAttributes
  relationships: MangaDexRelationship[]
}

export interface MangaDexMangaAttributes {
  title: Record<string, string>
  altTitles: Record<string, string>[]
  description?: Record<string, string>

  isLocked: boolean
  links?: Record<string, string>

  originalLanguage: string
  lastVolume?: string | null
  lastChapter?: string | null

  publicationDemographic?: string
  status?: string
  year?: number

  contentRating?: string

  tags?: MangaDexTag[]

  state: string
  version: number

  createdAt: string
  updatedAt: string
}

export interface MangaDexTag {
  id: string
  type: "tag"
  attributes: {
    name: Record<string, string>
    group: string
  }
}

export interface MangaDexRelationship {
  id: string
  type: "author" | "artist" | "cover_art" | string
}

export interface MangaDexNormalizedManga {
  kind: "manga";
  title: string;
  source: "mangadex";
  externalId: string;

  metadata: {
    description?: string;
    lastChapter?: string | null;
    year?: number;
  }
}