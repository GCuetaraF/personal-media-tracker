export interface YouTubeChannelsResponse {
  items: Array<{
    contentDetails: {
      relatedPlaylists: {
        likes: string;
      };
    };
  }>;
}

export interface YoutubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, {
      url: string;
      width: number;
      height: number;
    }>;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
    videoOwnerChannelTitle?: string;
    videoOwnerChannelId?: string;
  };
  contentDetails?: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export interface YouTubePlaylistItemsResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Array<YoutubePlaylistItem>;
}

export interface YouTubeVideoRaw {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  thumbnails: Record<string, { url: string; width: number; height: number }>;
  duration?: string;
}

export interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
  }>;
  nextPageToken?: string;
}

export interface YouTubeVideosResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      channelId: string;
      channelTitle: string;
      thumbnails: Record<string, { url: string; width: number; height: number }>;
    };
    contentDetails: {
      duration: string;
    };
  }>;
}

export interface SearchItem {
  id: { videoId: string };
}

export interface VideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
  };
  contentDetails: {
    duration: string;
  };
}

export interface YouTubeNormalizedVideo {
  kind: "video";
  title: string;

  source: "youtube";
  externalId: string;

  metadata: {
    channelId: string;
    channelTitle: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    description: string;
    publishedAt: string;
    duration?: string;
    playlistId?: string;
    playlistTitle?: string;
  };

  timeSeconds?: number;
}

export interface YoutubePlaylistRaw {
  kind: "youtube#playlist";
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string;
    };
  };
  status: {
    privacyStatus: string;
    podcastStatus: string;
  };
  contentDetails: {
    itemCount: number;
  };
  player: {
    embedHtml: string;
  };
  localizations: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
}

export interface YoutubePlaylistResponse {
  kind: "youtube#playlistListResponse";
  etag: string;

  nextPageToken: string;

  prevPageToken: string;

  pageInfo: {
    totalResults: number;
    resultsPerPage: number;

  };
  items: Array<YoutubePlaylistRaw>;
}

export interface YoutubeNormalizedPlaylist {
  kind: "playlist";
  title: string;
  source: "youtube";
  externalId: string;
  metadata: {
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    itemCount: number;
  };
}

export interface YoutubeRawSubscription {
  kind: "youtube#subscription";
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelTitle: string;
    title: string;
    description: string;
    resourceId: {
      kind: string;
      channelId: string;
    };
    channelId: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  contentDetails: {
    totalItemCount: number;
    newItemCount: number;
    activityType: string;
  };
  subscriberSnippet: {
    title: string;
    description: string;
    channelId: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
}

export interface YoutubeSubscriptionsResponse {
  kind: "youtube#subscriptionListResponse";
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Array<YoutubeRawSubscription>;
}

export interface YoutubeNormalizedSubscription {
  kind: "subscription";
  title: string;
  source: "youtube";
  externalId: string;
  metadata: {
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
  };
}
