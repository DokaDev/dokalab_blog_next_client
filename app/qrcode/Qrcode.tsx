"use client";

import React, {useState} from "react";
import QrScanner from "qr-scanner"
import QRCode from "qrcode";
import QRCodeLib from "react-qr-code";


const Qrcode:React.FC = () => {

    const [inputQrValue, setInputQrValue] = useState("")
    const [result, setResult] = useState("")

    const download = async () =>  {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, inputQrValue, {errorCorrectionLevel: 'H'});

        const pngUrl = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${inputQrValue}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };


    const qrScanner = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        QrScanner.scanImage(file, { returnDetailedScanResult: true })
            .then(result => setResult(result.data))
            .catch(e => console.log(e));
    };

    return (
        <div style={{
            backgroundColor: "#f6f8fb",  // 연한 파스텔톤 배경
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            margin: "2rem auto"
        }}>
            <div>

                <div style={{height: "auto", margin: "0 auto", maxWidth: 64, width: "100%"}}>
                    <QRCodeLib
                        size={256}
                        style={{height: "auto", maxWidth: "100%", width: "100%"}}
                        value={inputQrValue}
                        viewBox={`0 0 256 256`}
                        id="QRCode"
                    />
                </div>

                <input
                    type="text"
                    onChange={(e) => setInputQrValue(e.target.value)}
                    placeholder="http://"
                    style={{
                        display: "block",
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #ccc"
                    }}
                />
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <input
                    type="button"
                    onClick={download}
                    value="Download"
                    style={{
                        backgroundColor: "#a5d8ff",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer"
                    }}
                />
                </div>
            </div>

            <div style={{marginTop: "2rem"}}>

                <input
                    type="file"
                    id="file"
                    onChange={(e) => qrScanner(e)}
                    style={{display: "block", marginTop: "1rem"}}
                />
                <div style={{
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                    color: "#555",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    textAlign: "center"
                }}>
                    <h3> ☑️ 해당 QR 경로 ☑️</h3>
                    {result}
                </div>
            </div>
        </div>

    )
}


export default Qrcode;

