import QrScanner from "qr-scanner";

export const scanQrCode = async (file: File): Promise<string> => {
    try {
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        return result.data;
    } catch (error) {
        console.error("Error occurred during QR code scanning.", error);
        throw new Error("Failed to scan the QR code.")
    }
};
