export class DataTable<Schema extends Record<string, any>> {
	table: Partial<Schema>[] = [];

	constructor(data: Partial<Schema>[] = []) {
		this.table = data;
	}

	insert = (row: Partial<Schema>) => {
		this.table.push(row);
		return this;
	};

	insertRows = (rows: Partial<Schema>[]) => {
		this.table.push(...rows);
		return this;
	};

	select = (columns: (keyof Schema)[]) =>
		columns.reduce(
			(acc, col) => ({
				...acc,
				[col]: this.table.flatMap(row => row[col] ?? []),
			}),
			{} as Record<typeof columns[number], Schema[typeof columns[number]][]>
		);

	count = (columns: (keyof Schema)[]) =>
		Object.entries(this.select(columns)).reduce(
			(acc, [col, values]) => ({ ...acc, [col]: values.length }),
			{}
		);

	distinct = (columns: (keyof Schema)[]) =>
		Object.entries(this.select(columns)).reduce(
			(acc, [col, values]) => ({
				...acc,
				[col]: [...new Set(values)],
			}),
			{} as Record<keyof Schema, Schema[keyof Schema][]>
		);

	where = (conditions: Partial<Schema>) =>
		new DataTable<Schema>(
			this.table.filter(row => Object.entries(conditions).every(([key, val]) => row[key] === val))
		);

	curryWhere = (key: keyof Schema) => (val: Schema[typeof key]) =>
		this.where({ [key]: val } as Partial<Schema>);
}
