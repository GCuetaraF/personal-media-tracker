import type { YouTubeNormalizedVideo, YouTubeVideoRaw } from "./types";

export class YouTubeNormalizer {
  normalize(video: YouTubeVideoRaw): YouTubeNormalizedVideo {
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

  private parseISODurationToSeconds(duration?: string): number | undefined {
    if (!duration)
      return undefined;

    // Simple ISO 8601 duration parser for PT#H#M#S
    const match = duration.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/);

    if (!match) return undefined;

    const [, h, m, s] = match.map(Number);

    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  }
}
