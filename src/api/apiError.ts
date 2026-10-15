import { isAxiosError } from "axios";

/** Expected error body shape returned by the backend on failures. */
export interface ApiErrorBody {
  message?: string;
  statusCode?: number;
  error?: string;
}

/**
 * Normalizes an error thrown by an API call:
 * - axios error with a response → Error with the backend's message (or a fallback)
 * - anything else → the original error
 */
export const toApiError = (error: unknown, fallback: string): Error => {
  if (isAxiosError(error) && error.response) {
    const body = error.response.data as ApiErrorBody;
    return new Error(body.message || fallback);
  }
  return error instanceof Error ? error : new Error(fallback);
};
