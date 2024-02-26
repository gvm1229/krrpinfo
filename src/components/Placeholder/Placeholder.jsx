const Placeholder = ({ height }) => (
  <div className={`flex ${height} items-center justify-center bg-slate-100 dark:bg-slate-800`}>
    <span className="text-lg font-semibold">
      flex container with a height of
      {' '}
      {height}
    </span>
  </div>
);

export default Placeholder;
