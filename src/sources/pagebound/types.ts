export interface PageboundUserBooksResponse {
  user_books: PageboundRawBook[];
  total_pages: number;
  total_count: number;
}

export interface PageboundRawBook {
  id: number;
  uuid: string;
  book_id: number;
  status: string;
  progress: number;
  current_page: null;
  current_minute: null;
  total_minutes: null;
  title: string;
  author_name: string;
  author_uuid: string;
  scheduled_for_year: null;
  scheduled_for_month: null;
  priority: null;
  image_url: string;
  book_uuid: string;
  total_page_count: null;
  has_ever_finished: boolean;
  date_added: string;
  dates_read: null;
  dates_read_copy: string;
  edition_id: null;
  muted: boolean;
  owned: boolean;
  current_reading_instance: null | PageboundCurrentReadingInstance;
  has_reading_updates: boolean;
  review: null | string;
  shelves: unknown[];
  reading_instances: unknown[];
}

export interface PageboundCurrentReadingInstance {
  id: number;
  started_reading_at: string;
  finished_reading_at: string;
  finished: boolean;
  challenge_year: null;
  current: boolean;
  total_page_count: null;
  total_minutes: number;
  format: string;
  tracking_mode: string;
  started_reading_at_date: string;
  finished_reading_at_date: null | string;
  book: null;
  user_book_id: number;
  author_name: null;
  current_user_book: null;
  review: null;
  has_reading_updates: boolean;
  progress_method: string;
}

export interface PageboundNormalizedBook {
  kind: "book";
  title: string;
  source: "pagebound";
  externalId: string;

  metadata: {
    author?: string;
    description?: string;
    publishedDate?: string;
    rating?: number;
  };
}
