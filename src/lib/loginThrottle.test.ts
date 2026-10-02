import { describe, expect, it } from 'vitest';
import {
  MAX_ATTEMPTS,
  WINDOW_MS,
  getClientIp,
  hashIp,
  throttleStatus,
} from '@/lib/loginThrottle';

const now = new Date('2026-10-01T12:00:00.000Z');
const ago = (ms: number) => new Date(now.getTime() - ms);

describe('throttleStatus', () => {
  // `attempts` includes the current one: it is recorded before it is counted.
  it('is not blocked with no attempts', () => {
    expect(throttleStatus([], now)).toEqual({ blocked: false });
  });

  it('allows exactly MAX_ATTEMPTS attempts in the window', () => {
    const attempts = Array.from({ length: MAX_ATTEMPTS }, (_, i) => ago(i * 1000));
    expect(throttleStatus(attempts, now)).toEqual({ blocked: false });
  });

  it('blocks the attempt after MAX_ATTEMPTS and reports when the oldest one leaves the window', () => {
    const attempts = [ago(60_000), ago(50_000), ago(40_000), ago(30_000), ago(10_000), ago(0)];
    expect(throttleStatus(attempts, now)).toEqual({
      blocked: true,
      retryAfterSeconds: (WINDOW_MS - 60_000) / 1000,
    });
  });

  it('ignores attempts older than the window', () => {
    const attempts = [
      ago(WINDOW_MS + 1000),
      ago(WINDOW_MS + 2000),
      ago(WINDOW_MS + 3000),
      ago(10_000),
      ago(5_000),
      ago(0),
    ];
    expect(throttleStatus(attempts, now)).toEqual({ blocked: false });
  });

  it('treats an attempt exactly at the window edge as expired', () => {
    const attempts = [ago(WINDOW_MS), ago(4000), ago(3000), ago(2000), ago(1000), ago(0)];
    expect(throttleStatus(attempts, now)).toEqual({ blocked: false });
  });

  it('is order-independent', () => {
    const attempts = [ago(10_000), ago(60_000), ago(0), ago(30_000), ago(50_000), ago(40_000)];
    expect(throttleStatus(attempts, now)).toEqual({
      blocked: true,
      retryAfterSeconds: (WINDOW_MS - 60_000) / 1000,
    });
  });

  it('waits for enough attempts to expire when far over the limit', () => {
    const attempts = [70_000, 60_000, 50_000, 40_000, 30_000, 20_000, 10_000, 0].map(ago);
    // 8 attempts: the 3 oldest must expire to get back to 5; the third oldest is ago(50_000)
    expect(throttleStatus(attempts, now)).toEqual({
      blocked: true,
      retryAfterSeconds: (WINDOW_MS - 50_000) / 1000,
    });
  });

  it('rounds the wait up to whole seconds', () => {
    const attempts = [ago(WINDOW_MS - 1500), ago(4000), ago(3000), ago(2000), ago(1000), ago(0)];
    expect(throttleStatus(attempts, now)).toEqual({ blocked: true, retryAfterSeconds: 2 });
  });
});

describe('getClientIp', () => {
  it('uses the first x-forwarded-for entry', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' });
    expect(getClientIp(headers)).toBe('203.0.113.7');
  });

  it('trims whitespace', () => {
    const headers = new Headers({ 'x-forwarded-for': '  203.0.113.7  ' });
    expect(getClientIp(headers)).toBe('203.0.113.7');
  });

  it('falls back to a shared bucket when the header is missing or empty', () => {
    expect(getClientIp(new Headers())).toBe('unknown');
    expect(getClientIp(new Headers({ 'x-forwarded-for': ' ' }))).toBe('unknown');
  });
});

describe('hashIp', () => {
  it('is deterministic', () => {
    expect(hashIp('203.0.113.7', 'secret')).toBe(hashIp('203.0.113.7', 'secret'));
  });

  it('differs per IP and per secret', () => {
    const base = hashIp('203.0.113.7', 'secret');
    expect(hashIp('203.0.113.8', 'secret')).not.toBe(base);
    expect(hashIp('203.0.113.7', 'other-secret')).not.toBe(base);
  });

  it('does not contain the raw IP', () => {
    expect(hashIp('203.0.113.7', 'secret')).not.toContain('203.0.113.7');
  });
});
