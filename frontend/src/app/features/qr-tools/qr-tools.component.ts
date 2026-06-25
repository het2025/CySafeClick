import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrToolsService, DecodedQR } from './qr-tools.service';

@Component({
  selector: 'app-qr-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-tools.component.html',
  styleUrls: ['./qr-tools.component.css']
})
export class QrToolsComponent {
  activeTab: 'generate' | 'verify' = 'generate';
  
  // Generator State
  genType: 'upi' | 'url' | 'text' = 'upi';
  upiId: string = '';
  upiName: string = '';
  upiAmount: string = '';
  upiNote: string = '';
  genUrl: string = '';
  genText: string = '';
  generatedQRDataUrl: string = '';
  genError: string = '';

  // Verifier State
  decodedResult: DecodedQR | null = null;
  verifyError: string = '';
  isVerifying: boolean = false;

  constructor(private qrService: QrToolsService) {}

  switchTab(tab: 'generate' | 'verify') {
    this.activeTab = tab;
  }

  async generateCode() {
    this.genError = '';
    let textToEncode = '';

    if (this.genType === 'upi') {
      if (!this.upiId || !this.upiName) {
        this.genError = 'UPI ID and Name are required.';
        return;
      }
      textToEncode = `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(this.upiName)}`;
      if (this.upiAmount) textToEncode += `&am=${this.upiAmount}`;
      if (this.upiNote) textToEncode += `&tn=${encodeURIComponent(this.upiNote)}`;
    } else if (this.genType === 'url') {
      if (!this.genUrl) { this.genError = 'URL is required.'; return; }
      textToEncode = this.genUrl;
    } else {
      if (!this.genText) { this.genError = 'Text is required.'; return; }
      textToEncode = this.genText;
    }

    try {
      this.generatedQRDataUrl = await this.qrService.generateQR(textToEncode);
    } catch (e) {
      this.genError = 'Failed to generate QR code.';
    }
  }

  downloadQR() {
    if (!this.generatedQRDataUrl) return;
    const link = document.createElement('a');
    link.href = this.generatedQRDataUrl;
    link.download = 'safeclick-safe-qr.png';
    link.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.verifyQR(file);
    }
  }

  async verifyQR(file: File) {
    this.isVerifying = true;
    this.verifyError = '';
    this.decodedResult = null;

    try {
      this.decodedResult = await this.qrService.decodeQR(file);
    } catch (err: any) {
      this.verifyError = err.toString();
    } finally {
      this.isVerifying = false;
    }
  }
}
