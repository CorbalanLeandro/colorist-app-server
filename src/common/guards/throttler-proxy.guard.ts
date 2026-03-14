import { Injectable, Logger } from '@nestjs/common';
import {
  ThrottlerGuard,
  type ThrottlerGetTrackerFunction,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerProxyGuard extends ThrottlerGuard {
  protected readonly logger = new Logger(ThrottlerProxyGuard.name);
}

export const throttlerGetTracker: ThrottlerGetTrackerFunction = async (
  req: Record<string, any>,
): Promise<string> => {
  const ip = extractClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  return `${ip}:${userAgent}`.slice(0, 50);
};

function extractClientIp(req: Record<string, any>): string {
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];

  if (cfConnectingIp) {
    return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
  }

  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }

  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return ips.split(',')[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
}
