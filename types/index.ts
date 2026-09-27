// Shared types for the app.

export interface Link {
  id: number;
  code: string;
  url: string;
  createdAt: string;
  clicks: number;
}

export interface ApiError {
  error: string;
}
