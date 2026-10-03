import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Materi lesson ditulis admin dalam markdown; tetap disanitasi sebelum masuk DOM.
 * Modul terpisah supaya marked + DOMPurify hanya dimuat di halaman lesson.
 */
export function renderMarkdown(md: string) {
  return DOMPurify.sanitize(marked.parse(md, { async: false }));
}
