// JSX ↔ MDX directive 양방향 변환 (PortareFolium 이식, KaTeX 제외)

// JSX → MDX Directives (에디터 로드 시)
export function jsxToDirective(content: string): string {
  let out = content;

  // <YouTube id="xxx" /> → ::youtube[]{id="xxx"}
  out = out.replace(/<YouTube\s+id\s*=\s*"([^"]*)"\s*\/>/g, (_, id) => `::youtube[]{id="${id}"}`);

  // <ColoredTable ... /> 또는 <FoliumTable ... /> → ::colored-table[]{...}
  out = out.replace(/<(?:ColoredTable|FoliumTable)\s+([\s\S]*?)\s*\/>/g, (_, attrs) => {
    const regex =
      /(\w+)\s*=\s*(?:\{'((?:[^'\\]|\\.)*)'\}|'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;
    const parts: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(attrs)) !== null) {
      let val = m[2] ?? m[3] ?? m[4];
      val = val.replace(/\\'/g, "'");
      val = val.replace(/\\([\[\]])/g, '$1');
      val = val.replace(/"/g, '\\"');
      parts.push(`${m[1]}="${val}"`);
    }
    return `::colored-table[]{${parts.join(' ')}}`;
  });

  // <Accordion title="X">...</Accordion> → :::accordion[X]\n...\n:::
  out = out.replace(
    /<Accordion\s+title\s*=\s*(?:\{'((?:[^'\\]|\\.)*)'\}|'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")\s*>([\s\S]*?)<\/Accordion>/g,
    (_, a, b, c, inner) => {
      const title = (a ?? b ?? c ?? '').replace(/\\'/g, "'");
      const safeTitle = title.replace(/[\[\]]/g, '');
      return `\n\n:::accordion[${safeTitle}]\n${inner.trim()}\n:::\n\n`;
    },
  );

  return out;
}

// 코드 블록 밖 영역에서만 transform 적용
export function transformOutsideCodeBlocks(
  content: string,
  transform: (text: string) => string,
): string {
  const parts = content.split(
    /(```[\s\S]*?```|<[A-Z]\w*[\s\S]*?\/>|\$\$[\s\S]*?\$\$|\$(?!\$)[^\n$]+?\$)/g,
  );
  return parts.map((part, i) => (i % 2 === 0 ? transform(part) : part)).join('');
}

// directive 라인의 markdown 백슬래시 이스케이프 제거
function stripDirectiveEscapes(text: string): string {
  return text.replace(/^.*\\?::[a-z-].*$/gm, (line) => line.replace(/\\([:\[\]"=~])/g, '$1'));
}

// MDX Directives → JSX (저장/렌더링 시)
export function directiveToJsx(content: string): string {
  let out = content;

  out = transformOutsideCodeBlocks(out, stripDirectiveEscapes);

  // ::youtube[]{id="xxx"} → <YouTube id="xxx" />
  out = out.replace(/::youtube(?:\[\])?\{id="([^"]*)"\}/g, (_, id) => `<YouTube id="${id}" />`);

  // ::youtube[]{id=xxx} (unquoted)
  out = out.replace(/::youtube(?:\[\])?\{id=([^\s"}]+)\}/g, (_, id) => `<YouTube id="${id}" />`);

  // ::youtube{#xxx} (shorthand)
  out = out.replace(/::youtube\{#([^\s}]+)\}/g, (_, id) => `<YouTube id="${id}" />`);

  // ::colored-table / ::folium-table → <ColoredTable ... />
  out = out.replace(/::(?:colored-table|folium-table)(?:\[\])?\{([^}]*)\}/g, (_, attrs) => {
    const parts: string[] = [];
    const regex = /(\w+)=(['"])([\s\S]*?)\2(?=\s+\w+=|$)/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(attrs)) !== null) {
      let cleanVal = m[3].replace(/\\"/g, '"').replace(/&#x22;/g, '"');
      cleanVal = cleanVal.replace(/\\([\[\]])/g, '$1');
      cleanVal = cleanVal.replace(/'/g, "\\'");
      parts.push(`${m[1]}={'${cleanVal}'}`);
    }
    return `<ColoredTable ${parts.join(' ')} />`;
  });

  // :::accordion[X]\n...\n::: → <Accordion title={'X'}>...</Accordion>
  out = out.replace(/:::accordion\[([^\]]*)\]\n([\s\S]*?)\n:::/g, (_, title, inner) => {
    const safeTitle = String(title).replace(/'/g, "\\'");
    return `<Accordion title={'${safeTitle}'}>\n\n${inner.trim()}\n\n</Accordion>`;
  });

  return out;
}
