import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  source: vi.fn(),
  names: vi.fn(),
  insertValues: vi.fn(),
}));

// The fake covers just the three calls duplicateDish makes: read the source, read every name, insert.
vi.mock('@/db', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/db')>()),
  getDb: () => ({
    select: (columns?: unknown) =>
      columns
        ? { from: () => mocks.names() }
        : { from: () => ({ where: () => mocks.source() }) },
    insert: () => ({ values: mocks.insertValues }),
  }),
}));

import { copyName, duplicateDish, parseDish } from '@/lib/dishes';

const CATEGORY = '3f2b8f0e-6a52-4a44-9a3e-1c1f3c2d9a10';

describe('parseDish', () => {
  it('trims fields and keeps valid values', () => {
    expect(
      parseDish({ name: '  Lohikeitto ', description: ' kermainen ', categoryId: CATEGORY, allergens: ['G', 'L'], isActive: 'on' }),
    ).toEqual({
      ok: true,
      data: { name: 'Lohikeitto', description: 'kermainen', categoryId: CATEGORY, allergens: ['G', 'L'], isActive: true },
    });
  });

  it('turns an empty description and category into null', () => {
    expect(parseDish({ name: 'A', description: '  ', categoryId: '', allergens: [], isActive: null })).toEqual({
      ok: true,
      data: { name: 'A', description: null, categoryId: null, allergens: [], isActive: false },
    });
  });

  it('dedupes allergens and keeps the canonical order', () => {
    const result = parseDish({ name: 'A', description: '', categoryId: '', allergens: ['Veg', 'G', 'Veg'], isActive: 'on' });
    expect(result).toMatchObject({ ok: true, data: { allergens: ['G', 'Veg'] } });
  });

  it('rejects an unknown allergen', () => {
    expect(parseDish({ name: 'A', description: '', categoryId: '', allergens: ['X'], isActive: 'on' })).toEqual({
      ok: false,
      error: 'Tuntematon allergeeni',
    });
  });

  it.each([[''], ['   '], [undefined], [5]])('rejects name %j', (name) => {
    expect(parseDish({ name, description: '', categoryId: '', allergens: [], isActive: 'on' })).toEqual({
      ok: false,
      error: 'Nimi vaaditaan',
    });
  });

  it('rejects a name or description that is too long', () => {
    expect(parseDish({ name: 'a'.repeat(101), description: '', categoryId: '', allergens: [], isActive: 'on' })).toEqual({
      ok: false,
      error: 'Nimi on liian pitkä',
    });
    expect(parseDish({ name: 'A', description: 'a'.repeat(301), categoryId: '', allergens: [], isActive: 'on' })).toEqual({
      ok: false,
      error: 'Kuvaus on liian pitkä',
    });
  });

  it('rejects a malformed category id', () => {
    expect(parseDish({ name: 'A', description: '', categoryId: 'nope', allergens: [], isActive: 'on' })).toEqual({
      ok: false,
      error: 'Kategoriaa ei löytynyt',
    });
  });
});

describe('copyName', () => {
  it('appends (kopio) to the name', () => {
    expect(copyName('Lohikeitto', [])).toBe('Lohikeitto (kopio)');
  });

  it('numbers further copies, ignoring case', () => {
    expect(copyName('Lohikeitto', ['lohikeitto (KOPIO)'])).toBe('Lohikeitto (kopio 2)');
    expect(copyName('Lohikeitto', ['Lohikeitto (kopio)', 'Lohikeitto (kopio 2)'])).toBe('Lohikeitto (kopio 3)');
  });

  it('truncates the base so the copy still fits the name limit', () => {
    const name = copyName('a'.repeat(100), []);
    expect(name).toHaveLength(100);
    expect(name.endsWith(' (kopio)')).toBe(true);
  });
});

describe('duplicateDish', () => {
  const source = { id: CATEGORY, name: 'Lohikeitto', description: null, categoryId: null, allergens: ['G'], isActive: false };
  const taken = Object.assign(new Error('duplicate key'), { code: '23505' });

  beforeEach(() => {
    vi.resetAllMocks();
    mocks.source.mockResolvedValue([source]);
    mocks.names.mockResolvedValue([{ name: 'Lohikeitto' }]);
    mocks.insertValues.mockResolvedValue(undefined);
  });

  it('creates an active copy', async () => {
    expect(await duplicateDish(CATEGORY)).toEqual({ ok: true });
    expect(mocks.insertValues).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Lohikeitto (kopio)', isActive: true, allergens: ['G'] }),
    );
  });

  it('reports a dish that is gone', async () => {
    mocks.source.mockResolvedValue([]);
    expect(await duplicateDish(CATEGORY)).toEqual({ ok: false, error: 'Ruokaa ei löytynyt' });
    expect(mocks.insertValues).not.toHaveBeenCalled();
  });

  it('re-reads the names and picks the next free one when a concurrent copy takes the name', async () => {
    mocks.names
      .mockResolvedValueOnce([{ name: 'Lohikeitto' }])
      .mockResolvedValueOnce([{ name: 'Lohikeitto' }, { name: 'Lohikeitto (kopio)' }]);
    mocks.insertValues.mockRejectedValueOnce(taken).mockResolvedValueOnce(undefined);

    expect(await duplicateDish(CATEGORY)).toEqual({ ok: true });
    expect(mocks.insertValues).toHaveBeenCalledTimes(2);
    expect(mocks.insertValues).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'Lohikeitto (kopio 2)' }));
  });

  it('gives up with the duplicate error after three attempts', async () => {
    mocks.insertValues.mockRejectedValue(taken);
    expect(await duplicateDish(CATEGORY)).toEqual({ ok: false, error: 'Samanniminen ruoka on jo olemassa' });
    expect(mocks.insertValues).toHaveBeenCalledTimes(3);
  });

  it('does not retry other database errors', async () => {
    mocks.insertValues.mockRejectedValue(new Error('connection lost'));
    await expect(duplicateDish(CATEGORY)).rejects.toThrow('connection lost');
    expect(mocks.insertValues).toHaveBeenCalledTimes(1);
  });
});
