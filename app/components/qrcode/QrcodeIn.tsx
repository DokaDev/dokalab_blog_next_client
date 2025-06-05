"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { scanQrCode } from "./scanQrCode";  // 경로에 맞게 수정

interface QRcodeProps {
    url: string;
    width?: number;
}

const QrcodeIn: React.FC<QRcodeProps> = ({ url, width = 40 }) => {
    const [result, setResult] = useState("");
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateQR = async () => {
            try {
                const dataUrl = await QRCode.toDataURL(url, {
                    width,
                    errorCorrectionLevel: 'H',
                });
                setQrImage(dataUrl);
            } catch (err) {
                console.error("Failed to generate QR code", err);
            }
        };

        generateQR();
    }, [url, width]);

    const qrScanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const data = await scanQrCode(file);
            setResult(data);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
            setResult("");
        }
    };

    return (
        <div style={{marginTop: "2rem", textAlign: "center"}}>


                <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={qrScanner}
                    style={{display: "block"}}
                />
                {qrImage &&  result && (
                    <img
                        src={qrImage}
                        alt="Generated QR Code"
                        width={width}
                        height={width}

                    />
                )}


            <div
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    minWidth: "200px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {error ? (
                    <span style={{color: "red"}}>{error}</span>
                ) : result ? (
                    isValidUrl(result) ? (
                        <a href={result} target="_blank" rel="noopener noreferrer" style={{color: "#0070f3"}}>
                            {result}
                        </a>
                    ) : (
                        <span>{}</span>
                    )
                ) : (
                    <h5>No QR code scanned</h5>
                )}
            </div>

        </div>

    );
};

const isValidUrl = (str: string): boolean => {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
};

export default QrcodeIn;
