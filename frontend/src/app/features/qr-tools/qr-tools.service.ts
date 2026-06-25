import { Injectable } from '@angular/core';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

export interface DecodedQR {
  raw: string;
  type: 'upi' | 'url' | 'text' | 'unknown';
  upiDetails?: {
    pa?: string; // payee
    pn?: string; // payee name
    am?: string; // amount
    tn?: string; // note
  };
}

@Injectable({
  providedIn: 'root'
})
export class QrToolsService {

  async generateQR(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, { width: 300, margin: 2, color: { dark: '#0A1628', light: '#FFFFFF' } });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  decodeQR(file: File): Promise<DecodedQR> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            reject('Failed to create canvas context');
            return;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            resolve(this.parseQRContent(code.data));
          } else {
            reject('No QR code found in the image. Ensure the image is clear and the QR is fully visible.');
          }
        };
        img.onerror = () => reject('Failed to load image.');
        img.src = e.target.result;
      };
      reader.onerror = () => reject('Failed to read file.');
      reader.readAsDataURL(file);
    });
  }

  private parseQRContent(data: string): DecodedQR {
    const result: DecodedQR = { raw: data, type: 'unknown' };

    if (data.toLowerCase().startsWith('upi://pay')) {
      result.type = 'upi';
      result.upiDetails = {};
      try {
        const url = new URL(data);
        result.upiDetails.pa = url.searchParams.get('pa') || '';
        result.upiDetails.pn = url.searchParams.get('pn') || '';
        result.upiDetails.am = url.searchParams.get('am') || '';
        result.upiDetails.tn = url.searchParams.get('tn') || '';
      } catch(e) {}
    } else if (/^https?:\/\//i.test(data)) {
      result.type = 'url';
    } else {
      result.type = 'text';
    }

    return result;
  }
}
