import { type Text, Node, Editor, Element, Transforms } from 'slate';

// Strapi 5.58.0 Community withStrapiSchema에서 이식한 텍스트 노드 정규화
const isText = (node: unknown): node is Text =>
  Node.isNode(node) && !Editor.isEditor(node) && node.type === 'text';

// Strapi 본문 형식에 맞춘 Slate 노드 보정
export const withStrapiSchema = <T extends Editor>(editor: T): T => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (!Element.isElement(node) && !isText(node) && !Editor.isEditor(node)) {
      Transforms.setNodes(editor, { type: 'text' }, { at: path });
      return;
    }
    normalizeNode(entry);
  };
  return editor;
};
