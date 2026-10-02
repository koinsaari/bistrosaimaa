import { describe, expect, it } from 'vitest';
import { copyName, parseDish } from '@/lib/dishes';

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
