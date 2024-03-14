export default function ViewCounter({ view }: { view: number }) {
  return (
    <p className="text-lg font-medium">
      {`전체 방문: ${view}회`}
    </p>
  );
}
