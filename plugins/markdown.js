import markdownit from "markdown-it";
import { readFile } from "fs/promises";

const md = markdownit("commonmark");

async function renderMarkdown(file) {
  const content = await readFile(file, "utf-8");
  return md.render(content);
}

export function markdownToHtml() {
  return {
    name: "markdown-to-html",
    resolveId(id) {
      if (id.endsWith(".md")) {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id.endsWith(".md")) {
        const rendered = await renderMarkdown(id);
        return `export default ${JSON.stringify(rendered)}`;
      }
    },
  };
}
