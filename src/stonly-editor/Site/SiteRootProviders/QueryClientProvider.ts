import { QueryClient } from '@tanstack/react-query';

/** Shim of the editor's query client singleton. */
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});
