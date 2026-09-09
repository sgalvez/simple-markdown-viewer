import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './style.css';

const fileInput = document.querySelector<HTMLInputElement>('#file-input')!;
const notice = document.querySelector<HTMLDivElement>('#notice')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
const article = document.querySelector<HTMLElement>('#document')!;
const overlay = document.querySelector<HTMLDivElement>('#drop-overlay')!;
let requestId = 0;
let dragDepth = 0;

function showError(message: string) {
  notice.textContent = message;
  notice.hidden = false;
  status.textContent = '';
}

function renderMarkdown(source: string): DocumentFragment {
  const html = marked.parse(source.replace(/^\uFEFF/, ''), { gfm: true, async: false });
  const fragment = DOMPurify.sanitize(html, {
    RETURN_DOM_FRAGMENT: true,
    USE_PROFILES: { html: true },
    SANITIZE_NAMED_PROPS: true,
    FORBID_TAGS: ['style', 'form', 'button', 'textarea', 'select', 'video', 'audio', 'source'],
    FORBID_ATTR: ['style', 'srcset', 'autofocus'],
  });

  // Generate stable fragment links without exposing the application's own IDs.
  const slugs = new Set<string>();
  fragment.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const base = (heading.textContent ?? '').toLowerCase().trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-') || 'seccion';
    let slug = base;
    let suffix = 1;
    while (slugs.has(slug)) slug = `${base}-${suffix++}`;
    slugs.add(slug);
    heading.id = `md-${slug}`;
  });

  fragment.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    if (href.startsWith('#')) {
      link.setAttribute('href', `#md-${href.slice(1)}`);
    } else if (/^https?:\/\//i.test(href)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else if (!/^mailto:/i.test(href)) {
      link.removeAttribute('href');
      link.title = 'Los enlaces a archivos locales no están disponibles en este visor.';
    }
  });
  fragment.querySelectorAll('img').forEach((img) => {
    if (!/^https?:\/\//i.test(img.getAttribute('src') ?? '')) {
      const fallback = document.createElement('span');
      fallback.className = 'image-placeholder';
      fallback.textContent = `Imagen local no disponible${img.alt ? `: ${img.alt}` : ''}`;
      img.replaceWith(fallback);
    } else {
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
    }
  });
  fragment.querySelectorAll('input').forEach((input) => {
    if (input.type === 'checkbox') input.disabled = true;
    else input.remove();
  });
  fragment.querySelectorAll('table').forEach((table) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Tabla del documento');
    table.replaceWith(wrapper);
    wrapper.append(table);
  });
  return fragment;
}

async function openFiles(files: File[]) {
  if (!files.length) return;
  const currentRequest = ++requestId;
  notice.hidden = true;
  if (files.length !== 1) {
    showError('Abre un archivo a la vez. Arrastra o selecciona solo un Markdown.');
    return;
  }
  const file = files[0];
  if (!/\.(md|markdown)$/i.test(file.name)) {
    showError('Este formato no es compatible. Elige un archivo .md o .markdown.');
    return;
  }
  status.textContent = `Abriendo ${file.name}…`;
  try {
    const source = await file.text();
    if (currentRequest !== requestId) return;
    const content = renderMarkdown(source);
    if (!source.replace(/^\uFEFF/, '').trim()) {
      const empty = document.createElement('p');
      empty.className = 'empty-document';
      empty.textContent = 'Este documento está vacío.';
      content.append(empty);
    }
    article.replaceChildren(content);
    document.querySelector<HTMLElement>('#file-name')!.textContent = file.name;
    document.querySelector<HTMLElement>('#current-file')!.hidden = false;
    document.querySelector<HTMLElement>('#file-detail')!.textContent = file.name.split('.').pop()!.toUpperCase();
    document.querySelector<HTMLElement>('#welcome')!.hidden = true;
    document.querySelector<HTMLElement>('#reader')!.hidden = false;
    document.title = `${file.name} — Markdown`;
    status.textContent = `${file.name} abierto.`;
    window.scrollTo({ top: 0 });
    article.focus({ preventScroll: true });
  } catch {
    if (currentRequest === requestId) showError('No pudimos abrir este archivo. Intenta seleccionarlo de nuevo.');
  }
}

document.querySelector('#open-file')!.addEventListener('click', () => fileInput.click());
document.querySelector('#choose-file')!.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const files = Array.from(fileInput.files ?? []);
  fileInput.value = '';
  void openFiles(files);
});

function resetDrag() {
  dragDepth = 0;
  overlay.hidden = true;
}
function isFileDrag(event: DragEvent) {
  return event.dataTransfer?.types.includes('Files') ?? false;
}
window.addEventListener('dragenter', (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  dragDepth++;
  overlay.hidden = false;
});
window.addEventListener('dragover', (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
});
window.addEventListener('dragleave', (event) => {
  if (!isFileDrag(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) resetDrag();
});
window.addEventListener('drop', (event) => {
  event.preventDefault();
  resetDrag();
  void openFiles(Array.from(event.dataTransfer?.files ?? []));
});
window.addEventListener('dragend', resetDrag);
window.addEventListener('blur', resetDrag);
