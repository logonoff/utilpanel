import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useMemo } from 'preact/hooks';

import styles from './MarkdownInternal.module.css';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  switch (node.tagName) {
    case 'A':
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
      node.setAttribute('class', 'shale-v1-link');
      break;
    case 'IMG':
      node.setAttribute('loading', 'lazy');
      break;
    case 'CODE':
    case 'PRE':
      node.setAttribute('class', 'shale-v1-code');
      break;
    case 'P':
      node.setAttribute('class', 'shale-v1-p');
      break;
    case 'H1':
      node.setAttribute('class', 'shale-v1-h1');
      break;
    case 'H2':
      node.setAttribute('class', 'shale-v1-h2');
      break;
    case 'H3':
      node.setAttribute('class', 'shale-v1-h3');
      break;
    case 'H4':
      node.setAttribute('class', 'shale-v1-h4');
      break;
    case 'H5':
      node.setAttribute('class', 'shale-v1-h5');
      break;
    case 'H6':
      node.setAttribute('class', 'shale-v1-h6');
      break;
  }
});

const parseMarkdown = (markdown: string): string => {
  const html = marked.parse(markdown, {
    gfm: true,
    async: false,
  }) as string;
  return DOMPurify.sanitize(html);
};

interface MarkdownInternalProps {
  content: string;
}

export const MarkdownInternal = ({ content }: MarkdownInternalProps) => {
  const sanitizedHTML = useMemo(() => parseMarkdown(content), [content]);

  return (
    <article
      class={styles.markdown}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Cause dompurify is used
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};
