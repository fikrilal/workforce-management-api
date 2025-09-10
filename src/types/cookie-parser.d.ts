declare module 'cookie-parser' {
  import type { RequestHandler } from 'express';
  interface CookieParseOptions {
    decode?(val: string): string;
  }
  function cookieParser(secret?: string, options?: CookieParseOptions): RequestHandler;
  export default cookieParser;
}

