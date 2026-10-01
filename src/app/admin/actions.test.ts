import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  deleteCookie: vi.fn(),
  isAuthenticated: vi.fn<() => Promise<boolean>>(),
  bumpSessionVersion: vi.fn<() => Promise<void>>(),
}));

vi.mock('next/headers', () => ({
  cookies: async () => ({ delete: mocks.deleteCookie }),
  headers: async () => new Headers(),
}));

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

vi.mock('@/lib/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth')>()),
  isAuthenticated: mocks.isAuthenticated,
}));

vi.mock('@/lib/sessionVersion', () => ({
  getSessionVersion: vi.fn(),
  bumpSessionVersion: mocks.bumpSessionVersion,
}));

vi.mock('@/lib/loginThrottle', () => ({
  clearAttempts: vi.fn(),
  getClientIp: vi.fn(),
  hashIp: vi.fn(),
  registerAttempt: vi.fn(),
}));

const { logout } = await import('@/app/admin/actions');

describe('logout', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.bumpSessionVersion.mockResolvedValue();
  });

  it('clears the cookie, ends every session and redirects to login', async () => {
    mocks.isAuthenticated.mockResolvedValue(true);
    await expect(logout()).rejects.toThrow('REDIRECT:/admin/login');
    expect(mocks.deleteCookie).toHaveBeenCalledWith({ name: 'admin_session', path: '/admin' });
    expect(mocks.bumpSessionVersion).toHaveBeenCalledOnce();
  });

  it('does not let an unauthenticated caller end the admin sessions', async () => {
    mocks.isAuthenticated.mockResolvedValue(false);
    await expect(logout()).rejects.toThrow('REDIRECT:/admin/login');
    expect(mocks.deleteCookie).toHaveBeenCalledOnce();
    expect(mocks.bumpSessionVersion).not.toHaveBeenCalled();
  });

  it('still clears the cookie and redirects when revoking fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.isAuthenticated.mockResolvedValue(true);
    mocks.bumpSessionVersion.mockRejectedValue(new Error('db down'));
    await expect(logout()).rejects.toThrow('REDIRECT:/admin/login');
    expect(mocks.deleteCookie).toHaveBeenCalledOnce();
  });
});
