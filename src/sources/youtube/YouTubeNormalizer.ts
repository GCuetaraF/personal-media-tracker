import type { YoutubeNormalizedPlaylist, YoutubeNormalizedSubscription, YouTubeNormalizedVideo, YoutubePlaylistItem, YoutubePlaylistRaw, YoutubeRawSubscription, YouTubeVideoRaw } from "./types";

export class YouTubeNormalizer {
  normalizeVideo(video: YouTubeVideoRaw): YouTubeNormalizedVideo {
    return {
      kind: "video",
      title: video.title,
      source: "youtube",
      externalId: video.id,
      metadata: {
        channelId: video.channelId,
        channelTitle: video.channelTitle,
        thumbnails: video.thumbnails,
        description: video.description,
        publishedAt: video.publishedAt,
        duration: video.duration,
      },
      timeSeconds: this.parseISODurationToSeconds(video.duration),
    };
  }

  normalizePlaylistItem(video: YoutubePlaylistItem): YouTubeNormalizedVideo {
    return {
      kind: "video",
      title: video.snippet?.title,
      source: "youtube",
      externalId: video.id,
      metadata: {
        channelId: video.snippet?.channelId,
        channelTitle: video.snippet?.channelTitle,
        thumbnails: video.snippet?.thumbnails,
        description: video.snippet?.description,
        publishedAt: video.snippet?.publishedAt,
        playlistId: video.snippet?.playlistId,
      },
    };
  }

  normalizePlaylist(playlist: YoutubePlaylistRaw): YoutubeNormalizedPlaylist {
    return {
      kind: "playlist",
      title: playlist.snippet.title,
      source: "youtube",
      externalId: playlist.id,
      metadata: {
        channelId: playlist.snippet.channelId,
        publishedAt: playlist.snippet.publishedAt,
        thumbnails: playlist.snippet.thumbnails,
        channelTitle: playlist.snippet.channelTitle,
        description: playlist.snippet.description,
        itemCount: playlist.contentDetails?.itemCount,
      },
    };
  }

  normalizeChannelSubscription(subscription: YoutubeRawSubscription): YoutubeNormalizedSubscription {
    return {
      kind: "subscription",
      title: subscription.snippet.title,
      source: "youtube",
      externalId: subscription.id,
      metadata: {
        channelId: subscription.snippet.resourceId.channelId,
        channelTitle: subscription.snippet.channelTitle,
        publishedAt: subscription.snippet.publishedAt,
        thumbnails: subscription.snippet.thumbnails,
        description: subscription.snippet.description,
      },
    };
  }

  private parseISODurationToSeconds(duration?: string): number | undefined {
    if (!duration)
      return undefined;

    // Simple ISO 8601 duration parser for PT#H#M#S
    const match = duration.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/);

    if (!match)
      return undefined;

    const [, h, m, s] = match.map(Number);

    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  }
}
