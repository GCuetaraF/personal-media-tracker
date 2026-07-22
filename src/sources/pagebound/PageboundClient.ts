import type { PageboundRawBook, PageboundUserBooksResponse } from "./types";

export class PageboundClient {
  constructor(
    private userId: string,
  ) { }

  async fetchFinishedBooks(): Promise<PageboundRawBook[]> {
    const url = `https://prod-pagebound-api.onrender.com/api/v1/users/${this.userId}/user_books?status=finished&page=<PAGE>&sort_by=title&asc=true`;

    return this.fetchBooks(url);
  }

  async fetchCurrentBooks(): Promise<PageboundRawBook[]> {
    const url = `https://prod-pagebound-api.onrender.com/api/v1/users/${this.userId}/user_books?status=current&page=<PAGE>&sort_by=title&asc=true`;

    return this.fetchBooks(url);
  }

  async fetchToBeReadBooks(): Promise<PageboundRawBook[]> {
    const url = `https://prod-pagebound-api.onrender.com/api/v1/users/${this.userId}/user_books?status=tbr&page=<PAGE>&sort_by=title&asc=true`;

    return this.fetchBooks(url);
  }

  private async fetchBooks(baseUrl: string): Promise<PageboundRawBook[]> {
    let hasMore = true;
    let currentPage = 1;

    const allData: PageboundRawBook[] = [];

    while (hasMore) {
      const url = baseUrl.replace("<PAGE>", currentPage.toString());

      const res = await fetch(url);

      if (!res.ok)
        throw new Error(`Pagebound fetch Error: ${res.status}`);

      const json = (await res.json()) as PageboundUserBooksResponse;

      allData.push(...json.user_books);

      currentPage++;
      hasMore = currentPage < json.total_pages;
    }

    return allData;
  }
}
