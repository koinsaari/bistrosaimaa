import { describe, expect, it } from 'vitest';
import { FILE_TOO_LARGE, MAX_FILE_BYTES, pickLargestPhoto, readAttachment, UNSUPPORTED_FILE } from '@/lib/bot/attachment';

const size = (file_id: string, width: number, height: number, file_size?: number) => ({
  file_id,
  file_unique_id: file_id,
  width,
  height,
  file_size,
});

const document = (mime_type: string | undefined, file_size?: number) => ({
  file_id: 'doc',
  file_unique_id: 'doc',
  mime_type,
  file_size,
});

describe('pickLargestPhoto', () => {
  it('picks the size with the most pixels, whatever the order', () => {
    const sizes = [size('small', 90, 51), size('large', 1280, 720), size('medium', 320, 180)];
    expect(pickLargestPhoto(sizes).file_id).toBe('large');
    expect(pickLargestPhoto([...sizes].reverse()).file_id).toBe('large');
  });

  it('breaks a tie by file size', () => {
    expect(pickLargestPhoto([size('a', 100, 100, 10), size('b', 100, 100, 20)]).file_id).toBe('b');
  });
});

describe('readAttachment', () => {
  it('reads a photo as JPEG using its largest size', () => {
    expect(readAttachment({ photo: [size('small', 90, 90), size('large', 800, 800)] })).toEqual({
      ok: true,
      fileId: 'large',
      mediaType: 'image/jpeg',
    });
  });

  it.each(['application/pdf', 'image/jpeg', 'image/png'])('accepts a %s document', (mime) => {
    expect(readAttachment({ document: document(mime, 1000) })).toEqual({ ok: true, fileId: 'doc', mediaType: mime });
  });

  it.each(['image/gif', 'text/plain', 'application/zip', undefined])('refuses a %s document', (mime) => {
    expect(readAttachment({ document: document(mime) })).toEqual({ ok: false, error: UNSUPPORTED_FILE });
  });

  it('accepts exactly 20 MB and refuses more, for documents and photos', () => {
    expect(readAttachment({ document: document('application/pdf', MAX_FILE_BYTES) })).toMatchObject({ ok: true });
    expect(readAttachment({ document: document('application/pdf', MAX_FILE_BYTES + 1) })).toEqual({
      ok: false,
      error: FILE_TOO_LARGE,
    });
    expect(readAttachment({ photo: [size('p', 10, 10, MAX_FILE_BYTES + 1)] })).toEqual({ ok: false, error: FILE_TOO_LARGE });
  });

  it('refuses a message without an attachment', () => {
    expect(readAttachment({})).toEqual({ ok: false, error: UNSUPPORTED_FILE });
  });
});
