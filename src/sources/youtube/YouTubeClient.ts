import { OAuth2Client } from "google-auth-library";

import type {
  YouTubeChannelsResponse,
  YouTubePlaylistItemsResponse,
  YouTubeVideoRaw,
  YouTubeVideosResponse,
} from "./types";

export class YouTubeClient {
  constructor(private apiKey: string, private clientId: string, private clientSecret: string, private refreshToken: string) { }

  async fetchFavouriteVideos(): Promise<YouTubeVideoRaw[]> {
    const channelsUrl = "https://www.googleapis.com/youtube/v3/channels";
    const accessToken = await this.getAccessToken();

    const channelsParams = new URLSearchParams({
      part: "contentDetails",
      mine: "true",
    });

    const channelsRes = await fetch(`${channelsUrl}?${channelsParams}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });

    if (!channelsRes.ok)
      throw new Error(`YouTube API error: ${channelsRes.status}`);

    const channelsJson = (await channelsRes.json()) as YouTubeChannelsResponse;

    const likesPlaylistId = channelsJson.items[0]?.contentDetails.relatedPlaylists.likes;

    if (!likesPlaylistId)
      return [];

    const playlistItemsUrl = "https://www.googleapis.com/youtube/v3/playlistItems";

    let nextPageToken: string | undefined;

    const videoIds: string[] = [];

    do {
      const playlistParams = new URLSearchParams({
        part: "snippet",
        playlistId: likesPlaylistId,
        maxResults: "50",
        pageToken: nextPageToken || "",
        key: this.apiKey,
      });

      const playlistRes = await fetch(`${playlistItemsUrl}?${playlistParams}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (!playlistRes.ok)
        throw new Error(`YouTube API error: ${playlistRes.status}`);

      const playlistJson = (await playlistRes.json()) as YouTubePlaylistItemsResponse;

      videoIds.push(...(playlistJson.items || []).map(item => item.snippet.resourceId.videoId).filter(Boolean));

      nextPageToken = playlistJson.nextPageToken;
    } while (nextPageToken);

    if (videoIds.length === 0)
      return [];

    return this.fetchVideoDetails(videoIds);
  }

  async fetchPlaylistVideos(playlistId: string): Promise<YouTubeVideoRaw[]> {
    const playlistItemsUrl = "https://www.googleapis.com/youtube/v3/playlistItems";

    let nextPageToken: string | undefined;

    const videoIds: string[] = [];

    do {
      const playlistParams = new URLSearchParams({
        part: "snippet",
        playlistId,
        maxResults: "50",
        pageToken: nextPageToken || "",
        key: this.apiKey,
      });

      const playlistRes = await fetch(`${playlistItemsUrl}?${playlistParams}`);

      if (!playlistRes.ok)
        throw new Error(`YouTube API error: ${playlistRes.status}`);

      const playlistJson = (await playlistRes.json()) as YouTubePlaylistItemsResponse;

      videoIds.push(...(playlistJson.items || []).map(item => item.snippet.resourceId.videoId).filter(Boolean));

      nextPageToken = playlistJson.nextPageToken;
    } while (nextPageToken);

    if (videoIds.length === 0)
      return [];

    return this.fetchVideoDetails(videoIds);
  }

  private async getAccessToken(): Promise<string> {
    const oAuth2Client = new OAuth2Client(this.clientId, this.clientSecret);
    oAuth2Client.setCredentials({ refresh_token: this.refreshToken });

    const { token } = await oAuth2Client.getAccessToken();

    if (!token)
      throw new Error("Failed to obtain access token from YouTube OAuth2");

    return token;
  }

  private async fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideoRaw[]> {
    const params = new URLSearchParams({
      key: this.apiKey,
      id: videoIds.join(","),
      part: "snippet,contentDetails",
      maxResults: String(videoIds.length),
    });

    const url = `https://www.googleapis.com/youtube/v3/videos?${params}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }

    const json = await res.json() as YouTubeVideosResponse;

    return (json.items || []).map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      thumbnails: item.snippet.thumbnails,
      duration: item.contentDetails.duration,
    }));
  }
}
