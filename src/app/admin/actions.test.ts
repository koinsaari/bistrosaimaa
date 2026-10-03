import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  deleteCookie: vi.fn(),
  isAuthenticated: vi.fn<() => Promise<boolean>>(),
  bumpSessionVersion: vi.fn<() => Promise<void>>(),
  setCookie: vi.fn(),
  getSessionVersion: vi.fn<() => Promise<number>>(),
  registerAttempt: vi.fn(),
  clearAttempts: vi.fn<() => Promise<void>>(),
  getClientIp: vi.fn<() => string>(),
  hashIp: vi.fn<() => string>(),
}));

vi.mock('next/headers', () => ({
  cookies: async () => ({ delete: mocks.deleteCookie, set: mocks.setCookie }),
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
  getSessionVersion: mocks.getSessionVersion,
  bumpSessionVersion: mocks.bumpSessionVersion,
}));

vi.mock('@/lib/loginThrottle', () => ({
  clearAttempts: mocks.clearAttempts,
  getClientIp: mocks.getClientIp,
  hashIp: mocks.hashIp,
  registerAttempt: mocks.registerAttempt,
}));

const { login, logout } = await import('@/app/admin/actions');

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

  it('keeps the cookie and surfaces the error when revoking fails, so logout can be retried', async () => {
    mocks.isAuthenticated.mockResolvedValue(true);
    mocks.bumpSessionVersion.mockRejectedValue(new Error('db down'));
    await expect(logout()).rejects.toThrow('db down');
    expect(mocks.deleteCookie).not.toHaveBeenCalled();
  });
});

describe('login', () => {
  const SECRET = 'test-secret';
  const form = (password: string) => {
    const data = new FormData();
    data.set('password', password);
    return data;
  };
  const savedEnv = { password: process.env.ADMIN_PASSWORD, secret: process.env.SESSION_SECRET };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.ADMIN_PASSWORD = 'right-password';
    process.env.SESSION_SECRET = SECRET;
    mocks.getClientIp.mockReturnValue('1.2.3.4');
    mocks.hashIp.mockReturnValue('ip-hash');
    mocks.registerAttempt.mockResolvedValue({ blocked: false });
    mocks.clearAttempts.mockResolvedValue();
    mocks.getSessionVersion.mockResolvedValue(3);
  });

  afterEach(() => {
    for (const [key, value] of [['ADMIN_PASSWORD', savedEnv.password], ['SESSION_SECRET', savedEnv.secret]] as const) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it.each(['ADMIN_PASSWORD', 'SESSION_SECRET'])('is unavailable, and counts no attempt, when %s is missing', async (name) => {
    delete process.env[name];
    expect(await login(null as never, form('right-password'))).toEqual({ error: 'unavailable' });
    expect(mocks.registerAttempt).not.toHaveBeenCalled();
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });

  it('is unavailable when the throttle cannot be checked, rather than letting the attempt through', async () => {
    mocks.registerAttempt.mockRejectedValue(new Error('db down'));
    expect(await login(null as never, form('right-password'))).toEqual({ error: 'unavailable' });
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });

  it('still signs in when clearing the attempts fails', async () => {
    mocks.clearAttempts.mockRejectedValue(new Error('db down'));
    await expect(login(null as never, form('right-password'))).rejects.toThrow('REDIRECT:/admin/lunch');
    expect(mocks.setCookie).toHaveBeenCalledOnce();
  });

  it('is unavailable, with no cookie, when the session version cannot be read', async () => {
    mocks.getSessionVersion.mockRejectedValue(new Error('db down'));
    expect(await login(null as never, form('right-password'))).toEqual({ error: 'unavailable' });
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });
});
