export interface YouTubeChannelsResponse {
  items: Array<{
    contentDetails: {
      relatedPlaylists: {
        likes: string;
      };
    };
  }>;
}

export interface YouTubePlaylistItemsResponse {
  items: Array<{
    snippet: {
      resourceId: { videoId: string };
    };
  }>;
  nextPageToken?: string;
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
  };

  timeSeconds?: number;
}
