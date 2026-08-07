import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useEffect, useState } from 'preact/hooks';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }) => {
  return `<h${depth} class="shale-v1-h${depth}">${text}</h${depth}>`;
};

renderer.link = ({ href, text }) => {
  return `<a class="shale-v1-link" href="${href}">${text}</a>`;
};

renderer.paragraph = ({ text }) => {
  return `<p class="shale-v1-p">${text}</p>`;
};

renderer.code = ({ text }) => {
  return `<pre class="shale-v1-code">${text}</pre>`;
};

renderer.codespan = ({ text }) => {
  return `<code class="shale-v1-code">${text}</code>`;
};

const parseMarkdown = async (markdown: string): Promise<string> => {
  const html = await marked.parse(markdown, {
    gfm: true,
    renderer,
  });
  return DOMPurify.sanitize(html);
};

const useMarkdown = (markdown: string): [string, boolean] => {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const parseAndSetHtml = async () => {
      setLoading(true);
      const parsedHtml = await parseMarkdown(markdown);
      if (isMounted) {
        setHtml(parsedHtml);
        setLoading(false);
      }
    };

    parseAndSetHtml();

    return () => {
      isMounted = false;
    };
  }, [markdown]);

  return [html, loading];
};

interface MarkdownInternalProps {
  content: string;
}

export const MarkdownInternal = ({ content }: MarkdownInternalProps) => {
  const [sanitizedHTML, loading] = useMarkdown(content);

  if (loading) {
    return <div class="empty">Loading...</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};
