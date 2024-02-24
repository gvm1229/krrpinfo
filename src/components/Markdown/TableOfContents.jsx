const sampleToc = [
  'Head1',
  'Head2',
  'Head3',
  'Head4',
  'Head5',
];

export default function TableOfContents({ markdownInput = sampleToc }) {
  return (
    <div className="sticky top-20 hidden h-1/4 w-full max-w-[25%] gap-y-10 bg-sky-300 p-4 pt-1.5 dark:bg-sky-700 tablet:flex tablet:flex-col">
      <h1 className="text-xl font-bold">
        Table O. Contents
      </h1>
      {markdownInput.map((item) => (
        <span
          key={item}
          className="text-lg font-medium transition hover:text-xl hover:font-bold hover:underline"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
