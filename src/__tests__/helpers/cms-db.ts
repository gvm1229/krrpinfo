type Row = Record<string, unknown>;
type Result = { data: Row[] | Row | null; error: null };
export const createDatabaseMock = (tables: Record<string, Row[]> = {}) => {
  const calls: string[] = [];
  const from = (table: string) => {
    calls.push(table);
    tables[table] ??= [];
    const filters: ((row: Row) => boolean)[] = [];
    let mutation: 'insert' | 'update' | 'delete' | null = null;
    let payload: Row = {};
    const execute = (single = false): Result => {
      if (mutation === 'insert') {
        const row = { id: '11111111-1111-4111-a111-111111111111', ...payload };
        tables[table].push(row);
        return { data: single ? row : [row], error: null };
      }
      const matching = tables[table].filter((row) => filters.every((filter) => filter(row)));
      if (mutation === 'update') matching.forEach((row) => Object.assign(row, payload));
      if (mutation === 'delete')
        tables[table] = tables[table].filter((row) => !matching.includes(row));
      return { data: single ? (matching[0] ?? null) : matching, error: null };
    };
    const query = {
      select: (_columns?: string) => query,
      eq: (key: string, value: unknown) => {
        filters.push((row) => row[key] === value);
        return query;
      },
      neq: (key: string, value: unknown) => {
        filters.push((row) => row[key] !== value);
        return query;
      },
      order: (_key: string, _options?: unknown) => query,
      insert: (value: Row) => {
        mutation = 'insert';
        payload = value;
        return query;
      },
      upsert: (value: Row, _options?: unknown) => {
        mutation = 'insert';
        payload = value;
        return query;
      },
      update: (value: Row) => {
        mutation = 'update';
        payload = value;
        return query;
      },
      delete: () => {
        mutation = 'delete';
        return query;
      },
      single: async () => execute(true),
      maybeSingle: async () => execute(true),
      then: <TResult1 = Result, TResult2 = never>(
        fulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null,
        rejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
      ) => Promise.resolve(execute()).then(fulfilled, rejected),
    };
    return query;
  };
  return { from, calls, tables, rpc: async () => ({ data: true, error: null }) };
};
