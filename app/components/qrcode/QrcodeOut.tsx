"use client";

import React, {useState} from "react";
import QrScanner from "qr-scanner"
import QRCode from 'qrcode';
import QRCodeLib from "react-qr-code";


interface QRcodeProps {
    url: string;
    width?: number;
}


const QrcodeIn:React.FC<QRcodeProps> = ({url, width = 256}) => {

    const [inputQrValue, setInputQrValue] = useState("")
    const [result, setResult] = useState("")

    const download = async () =>  {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, url, {errorCorrectionLevel: 'H'});

        const pngUrl = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;

        const safeFileName = url ? url.replace(/[:\/]/g, "_") : "qrcode";

        downloadLink.download = `${safeFileName}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };


    const qrScanner = (e : React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.value;
        if (!file) {
            return;
        }
        QrScanner.scanImage(file, { returnDetailedScanResult: true })
            .then(result => setResult(result.data))
            .catch(e => console.log(e));
    };

    return (
         <div style={{
            padding: "2rem",
            borderRadius: "1rem",
            maxWidth: "600px",
            margin: "2rem auto"
        }}>
             <div>


                 <div style={{display: "flex", gap: "4px", alignItems: "center"}}>


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
                     <div style={{height: "auto", margin: "0 auto", maxWidth: 30, width: "100%"}}>
                         <QRCodeLib
                             size={256}
                             style={{height: "auto", maxWidth: "100%", width: "100%"}}
                             value={inputQrValue}
                             viewBox={`0 0 256 256`}
                             id="QRCode"
                         />
                     </div>
                     <button
                         type="button"
                         onClick={(e) => {
                             e.preventDefault(); // 혹시 몰라서
                             download();
                         }}
                         style={{
                             background: 'none',
                             border: 'none',
                             cursor: 'pointer',
                             padding: 0,
                         }}
                     >

                     </button>

                 </div>
             </div>

         </div>

    )
}


export default QrcodeIn;

