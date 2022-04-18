export class DataTable<Schema extends Record<string, any>> {
	dataRows: Partial<Schema>[] = [];

	constructor(data: Partial<Schema>[] = []) {
		this.dataRows = data;
	}

	insert = (row: Partial<Schema>) => this.dataRows.push(row);

	insertRows = (rows: Partial<Schema>[]) => this.dataRows.push(...rows);

	select = (columns: (keyof Schema)[]) =>
		columns.reduce((acc, col) => ({ ...acc, [col]: this.dataRows.map(row => row[col]) }), {});

	query = (conditions: Partial<Schema>) =>
		this.dataRows.filter(row => Object.entries(conditions).every(([key, val]) => row[key] === val));

	curryQuery = (key: keyof Schema) => (val: Schema[typeof key]) =>
		this.query({ [key]: val } as Partial<Schema>);
}
