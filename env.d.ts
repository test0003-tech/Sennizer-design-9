/**
 * Cloudflare Worker Environment Type Declarations
 * These types are used by @cloudflare/next-on-pages via getRequestContext()
 */

interface CloudflareEnv {
  DB: D1Database;
  GITHUB_TOKEN?: string;
  CF_API_TOKEN?: string;
  D1_DATABASE_ID?: string;
}

declare module '@cloudflare/next-on-pages' {
  export function getRequestContext<T = CloudflareEnv>(): {
    env: T;
    ctx: ExecutionContext;
    cf: IncomingRequestCfProperties;
  };
}
