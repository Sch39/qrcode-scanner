interface ParsedQR {
	hari: string;
	cell: string;
	pasok: string;
}

export function parseQR(text: string): ParsedQR | null {
	try {
		const parts = text.split('\n');
		if (parts.length >= 3) {
			return {
				hari: parts[0],
				cell: parts[1],
				pasok: parts[2]
			};
		}
		return null;
	} catch {
		return null;
	}
}
