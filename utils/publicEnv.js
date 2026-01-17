export const publicEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '',
  tokenCdn: process.env.NEXT_PUBLIC_CDN_TOKEN || '',
  cdnBaseUrl: process.env.NEXT_PUBLIC_CDN_BASE_URL || 'https://cdn.it49.com/an1ince54c3/',
};