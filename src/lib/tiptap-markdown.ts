// JSX 태그 내부의 \[, \] 만 원상 복원
export function unescapeJsxBrackets(markdown: string): string {
  return markdown.replace(/<[A-Z]\w*[\s\S]*?\/?>/g, (tag) => tag.replace(/\\([\[\]])/g, '$1'));
}
