interface ParsedQR {
	hari: string;
	cell: string;
	pasok: string;
}

export function parseQR(text: string) {
	try {
		const lines = text.split('\n');

		const data: any = {};

		lines.forEach((line) => {
			const [key, value] = line.split(':').map((s) => s.trim());

			if (!key || !value) return;

			switch (key.toUpperCase()) {
				case 'HARI':
					data.hari = Number(value);
					break;
				case 'CELL':
					data.cell = value;
					break;
				case 'PASOK':
					data.pasok = value;
					break;
			}
		});

		if (!data.hari || !data.cell || !data.pasok) return null;

		return data;
	} catch {
		return null;
	}
}
