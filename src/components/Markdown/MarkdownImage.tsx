// renderToString 호환 img 대체
export default function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <span className="my-4 block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        className="h-auto max-w-full rounded"
      />
    </span>
  );
}
