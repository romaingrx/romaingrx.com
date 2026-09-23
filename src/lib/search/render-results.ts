import type { PagefindDocument } from './pagefind';

function resultKind(url: string): string {
  if (url.startsWith('/notes/')) return 'Note';
  if (url.startsWith('/blog/')) return 'Blog';
  return 'Page';
}

function makeExcerpt(excerpt: string): HTMLParagraphElement {
  const paragraph = document.createElement('p');
  paragraph.className = 'search-result-excerpt';
  // Pagefind escapes source text and returns only its own <mark> tags here.
  paragraph.innerHTML = excerpt;
  return paragraph;
}

function renderDocument(result: PagefindDocument): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'search-result-document';

  const heading = document.createElement('div');
  heading.className = 'search-result-heading';

  const title = result.meta.title || result.url;
  const titleLink = document.createElement('a');
  titleLink.className = 'search-result-document-link';
  titleLink.href = result.url;
  titleLink.dataset.searchLink = '';
  titleLink.textContent = title;
  heading.append(titleLink);

  const kind = document.createElement('span');
  kind.className = 'search-result-kind';
  kind.textContent = resultKind(result.url);
  heading.append(kind);
  item.append(heading);

  const rootSection = result.sub_results?.find((section) => section.url === result.url);
  item.append(makeExcerpt(rootSection?.excerpt || result.excerpt));

  const sections = result.sub_results?.filter((section) => section.url !== result.url) || [];
  if (sections.length === 0) return item;

  const sectionList = document.createElement('ul');
  sectionList.className = 'search-result-sections';

  for (const section of sections) {
    const sectionItem = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'search-result-section-link';
    link.href = section.url;
    link.dataset.searchLink = '';

    const title = document.createElement('span');
    title.className = 'search-result-section-title';
    title.textContent = section.title;
    link.append(title, makeExcerpt(section.excerpt));
    sectionItem.append(link);
    sectionList.append(sectionItem);
  }

  item.append(sectionList);
  return item;
}

export function appendSearchResults(list: HTMLUListElement, results: PagefindDocument[]): void {
  list.append(...results.map(renderDocument));
}
