import { Html5Qrcode } from 'html5-qrcode';

export class ScannerService {
	private html5QrCode: Html5Qrcode | null = null;
	private isScanning = false;

	async start(elementId: string, onScan: (text: string) => void): Promise<void> {
		try {
			// Hapus instance lama jika ada
			if (this.html5QrCode) {
				await this.stop();
			}

			this.html5QrCode = new Html5Qrcode(elementId);

			const devices = await Html5Qrcode.getCameras();
			if (devices && devices.length) {
				const cameraId = devices[0].id; // Gunakan camera pertama

				await this.html5QrCode.start(
					cameraId,
					{
						fps: 10,
						qrbox: { width: 250, height: 250 }
					},
					(decodedText) => {
						onScan(decodedText);
					},
					(undefined) => {
						// Ignore errors during scanning
					}
				);

				this.isScanning = true;
			} else {
				throw new Error('No cameras found');
			}
		} catch (err) {
			console.error('Scanner start error:', err);
			throw err;
		}
	}

	async stop(): Promise<void> {
		if (this.html5QrCode && this.isScanning) {
			try {
				await this.html5QrCode.stop();
				await this.html5QrCode.clear();
			} catch (err) {
				console.error('Scanner stop error:', err);
			}
			this.isScanning = false;
			this.html5QrCode = null;
		}
	}
}
