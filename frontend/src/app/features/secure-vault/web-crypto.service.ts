import { Injectable } from '@angular/core';

export interface VaultNote {
  id: string;
  title: string;
  encryptedContent: string;
  iv: string;
  createdAt: string;
  updatedAt: string;
  category: 'financial' | 'personal' | 'passwords' | 'contacts' | 'documents' | 'other';
}

@Injectable({ providedIn: 'root' })
export class WebCryptoService {
  
  private bufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private getOrCreateSalt(): Uint8Array {
    const saved = localStorage.getItem('Cycysafeclick_vault_salt');
    if (saved) {
      return new Uint8Array(this.base64ToBuffer(saved));
    }
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    localStorage.setItem('Cycysafeclick_vault_salt', this.bufferToBase64(salt.buffer));
    return salt;
  }

  async deriveKey(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: this.getOrCreateSalt(),
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async encryptText(text: string, key: CryptoKey): Promise<{ encrypted: string, iv: string }> {
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(text)
    );
    
    return {
      encrypted: this.bufferToBase64(encryptedBuffer),
      iv: this.bufferToBase64(iv.buffer)
    };
  }

  async decryptText(encryptedBase64: string, ivBase64: string, key: CryptoKey): Promise<string> {
    const encryptedBuffer = this.base64ToBuffer(encryptedBase64);
    const iv = new Uint8Array(this.base64ToBuffer(ivBase64));
    
    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedBuffer
      );
      const dec = new TextDecoder();
      return dec.decode(decryptedBuffer);
    } catch (e) {
      throw new Error("Decryption failed. Incorrect password or corrupted data.");
    }
  }

  hasVault(): boolean {
    return !!localStorage.getItem('Cycysafeclick_vault_salt');
  }

  getNotes(): VaultNote[] {
    const saved = localStorage.getItem('Cycysafeclick_vault_notes');
    return saved ? JSON.parse(saved) : [];
  }

  saveNotes(notes: VaultNote[]): void {
    localStorage.setItem('Cycysafeclick_vault_notes', JSON.stringify(notes));
  }
}
