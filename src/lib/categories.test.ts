import { describe, expect, it } from 'vitest';
import { parseCategory, parseCategoryId } from '@/lib/categories';

describe('parseCategory', () => {
  it('trims the name and parses the sort order', () => {
    expect(parseCategory({ name: '  Pääruoat ', sortOrder: ' 20 ' })).toEqual({
      ok: true,
      data: { name: 'Pääruoat', sortOrder: 20 },
    });
  });

  it('accepts the sort order bounds', () => {
    expect(parseCategory({ name: 'A', sortOrder: '0' })).toMatchObject({ ok: true });
    expect(parseCategory({ name: 'A', sortOrder: '9999' })).toMatchObject({ ok: true });
  });

  it.each([
    ['empty', ''],
    ['whitespace only', '   '],
    ['missing', undefined],
    ['not a string', 5],
  ])('rejects a name that is %s', (_label, name) => {
    expect(parseCategory({ name, sortOrder: '1' })).toEqual({ ok: false, error: 'Nimi vaaditaan' });
  });

  it('rejects a name that is too long', () => {
    expect(parseCategory({ name: 'a'.repeat(61), sortOrder: '1' })).toEqual({
      ok: false,
      error: 'Nimi on liian pitkä',
    });
  });

  it.each([['-1'], ['1.5'], ['abc'], [''], ['10000'], [null], [undefined]])(
    'rejects sort order %j',
    (sortOrder) => {
      expect(parseCategory({ name: 'A', sortOrder })).toEqual({
        ok: false,
        error: 'Järjestysnumero on kokonaisluku 0–9999',
      });
    },
  );

  it('reports the name error first when both fields are invalid', () => {
    expect(parseCategory({ name: '', sortOrder: 'x' })).toEqual({ ok: false, error: 'Nimi vaaditaan' });
  });
});

describe('parseCategoryId', () => {
  it('accepts a UUID', () => {
    expect(parseCategoryId('3f1c9f0e-6a58-4c1e-9d0b-2f4b7a6c8e11')).toBe('3f1c9f0e-6a58-4c1e-9d0b-2f4b7a6c8e11');
  });

  it.each([[''], ['not-a-uuid'], ['1; drop table categories'], [null], [undefined], [42]])(
    'rejects %j',
    (value) => {
      expect(parseCategoryId(value)).toBeNull();
    },
  );
});
