import { Html5Qrcode } from 'html5-qrcode';

export class ScannerService {
	private html5QrCode: Html5Qrcode | null = null;
	private isScanning = false;
	private elementId: string | null = null;

	async start(elementId: string, onScan: (text: string) => void): Promise<void> {
		try {
			// Prevent double start
			if (this.isScanning) return;

			// Create instance hanya sekali
			if (!this.html5QrCode || this.elementId !== elementId) {
				this.html5QrCode = new Html5Qrcode(elementId);
				this.elementId = elementId;
			}

			await this.html5QrCode.start(
				{ facingMode: 'environment' }, // 🔥 lebih stabil mobile
				{
					fps: 10,
					qrbox: { width: 250, height: 250 }
				},
				(decodedText) => {
					onScan(decodedText);
				},
				() => {
					// ignore scan error
				}
			);

			this.isScanning = true;
		} catch (err) {
			console.error('Scanner start error:', err);
			throw err;
		}
	}

	async stop(): Promise<void> {
		if (!this.html5QrCode || !this.isScanning) return;

		try {
			await this.html5QrCode.stop();
			// ❌ jangan clear di sini → bikin susah restart
		} catch (err) {
			console.error('Scanner stop error:', err);
		} finally {
			this.isScanning = false;
		}
	}

	async destroy(): Promise<void> {
		if (!this.html5QrCode) return;

		try {
			if (this.isScanning) {
				await this.html5QrCode.stop();
			}
			await this.html5QrCode.clear(); // hanya saat destroy
		} catch (err) {
			console.error('Scanner destroy error:', err);
		} finally {
			this.html5QrCode = null;
			this.isScanning = false;
			this.elementId = null;
		}
	}
}
