/**
 * Cache time constants for React Query
 */
export const CACHE_TIME = {
  /** 1 minute */
  SHORT: 1 * 60 * 1000,
  /** 5 minutes */
  MEDIUM: 5 * 60 * 1000,
  /** 30 minutes */
  LONG: 30 * 60 * 1000,
  /** 1 hour */
  VERY_LONG: 60 * 60 * 1000,
  /** 24 hours */
  DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * Query keys for React Query
 * Centralized management of query keys for better cache invalidation
 */
export const QUERY_KEYS = {
  // User related
  user: {
    all: ['user'] as const,
    detail: (id: string) => ['user', id] as const,
    profile: () => ['user', 'profile'] as const,
  },
  // Products example
  products: {
    all: ['products'] as const,
    list: (filters: Record<string, unknown>) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', id] as const,
  },
  // Add more query keys as needed
} as const;
