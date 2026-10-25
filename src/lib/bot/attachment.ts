import type { Message, PhotoSize } from '@grammyjs/types';

export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const DOCUMENT_MEDIA_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;
export type MenuMediaType = (typeof DOCUMENT_MEDIA_TYPES)[number];

export const FILE_TOO_LARGE = 'Tiedosto on liian suuri (enintään 20 Mt). Lähetä pienempi tiedosto.';
export const UNSUPPORTED_FILE = 'Tätä tiedostoa en osaa lukea. Lähetä lista kuvana tai PDF-, JPG- tai PNG-tiedostona.';

export type Attachment = { ok: true; fileId: string; mediaType: MenuMediaType } | { ok: false; error: string };

/** Telegram sends several sizes of one photo; the largest is the one with the most pixels. */
export function pickLargestPhoto(sizes: PhotoSize[]): PhotoSize {
  return sizes.reduce((best, size) => {
    const area = size.width * size.height;
    const bestArea = best.width * best.height;
    return area > bestArea || (area === bestArea && (size.file_size ?? 0) > (best.file_size ?? 0)) ? size : best;
  });
}

export function readAttachment(message: Pick<Message, 'photo' | 'document'>): Attachment {
  if (message.photo?.length) {
    const photo = pickLargestPhoto(message.photo);
    if (photo.file_size !== undefined && photo.file_size > MAX_FILE_BYTES) return { ok: false, error: FILE_TOO_LARGE };
    return { ok: true, fileId: photo.file_id, mediaType: 'image/jpeg' };
  }
  const document = message.document;
  if (!document) return { ok: false, error: UNSUPPORTED_FILE };
  const mediaType = DOCUMENT_MEDIA_TYPES.find((type) => type === document.mime_type);
  if (!mediaType) return { ok: false, error: UNSUPPORTED_FILE };
  if (document.file_size !== undefined && document.file_size > MAX_FILE_BYTES) return { ok: false, error: FILE_TOO_LARGE };
  return { ok: true, fileId: document.file_id, mediaType };
}
