// Markdown rendering configuration

export function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let configured = false;

function ensureConfigured() {
  if (configured) return;
  configured = true;
  if (typeof marked === 'undefined') return;
  marked.use({
    renderer: {
      code({ text, lang }) {
        let html;
        try {
          html = (lang && hljs.getLanguage(lang))
            ? hljs.highlight(text, { language: lang }).value
            : hljs.highlightAuto(text).value;
        } catch { html = esc(text); }
        return '<pre><code class="hljs">' + html + '</code></pre>';
      }
    },
    breaks: true,
    gfm: true,
  });
}

export function md(text) {
  ensureConfigured();
  try { return marked.parse(text); }
  catch { return '<p>' + esc(text) + '</p>'; }
}
