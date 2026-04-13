// HTML에서 h2/h3 추출하여 ToC 데이터 생성
// DashboardTableOfContents 인터페이스 호환 어댑터

interface Item {
  title?: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

export type TableOfContents = Items;

// rehypeAutolinkHeadings behavior: 'wrap' 출력 기준
// <h2 id="slug"><a href="#slug">Text</a></h2>
export function getTableOfContentsFromHtml(html: string): TableOfContents {
  const entries: { level: number; title: string; url: string }[] = [];
  const regex = /<h([23]) id="([^"]+)"[^>]*>(?:<a[^>]*>([^<]*)<\/a>|([^<]*))<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    const level = parseInt(m[1], 10);
    const slug = m[2];
    const title = (m[3] || m[4] || '').trim();
    if (slug && title) entries.push({ level, title, url: `#${slug}` });
  }
  return { items: buildTree(entries) };
}

function buildTree(entries: { level: number; title: string; url: string }[]): Item[] {
  const root: Item[] = [];
  const stack: { item: Item; level: number }[] = [];
  for (const e of entries) {
    const node: Item = { title: e.title, url: e.url, items: [] };
    while (stack.length > 0 && stack[stack.length - 1].level >= e.level) stack.pop();
    if (stack.length === 0) root.push(node);
    else {
      if (!stack[stack.length - 1].item.items) stack[stack.length - 1].item.items = [];
      stack[stack.length - 1].item.items!.push(node);
    }
    stack.push({ item: node, level: e.level });
  }
  return root;
}
