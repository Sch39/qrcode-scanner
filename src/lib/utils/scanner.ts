import { Html5Qrcode } from 'html5-qrcode';

export class ScannerService {
	private scanner: Html5Qrcode | null = null;
	private lastScan = '';

	async start(elementId: string, onSuccess: (text: string) => void) {
		this.scanner = new Html5Qrcode(elementId);

		const devices = await Html5Qrcode.getCameras();

		if (!devices.length) throw new Error('No camera found');

		await this.scanner.start(
			devices[0].id,
			{ fps: 10, qrbox: { width: 250, height: 250 } },
			(decodedText) => {
				if (decodedText === this.lastScan) return;
				this.lastScan = decodedText;

				onSuccess(decodedText);
			},
			(errorMessage) => {
				console.error('QR Code scan error:', errorMessage);
			}
		);
	}

	async stop() {
		if (this.scanner) {
			await this.scanner.stop();
			this.scanner = null;
		}
	}
}
