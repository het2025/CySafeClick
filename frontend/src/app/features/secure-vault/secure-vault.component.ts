import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebCryptoService, VaultNote } from './web-crypto.service';

@Component({
  selector: 'app-secure-vault',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './secure-vault.component.html',
  styleUrls: ['./secure-vault.component.css']
})
export class SecureVaultComponent implements OnInit {
  viewState: 'setup' | 'login' | 'list' | 'edit' = 'setup';
  
  // Auth State
  passwordInput: string = '';
  confirmPasswordInput: string = '';
  understandRisk: boolean = false;
  activeKey: CryptoKey | null = null;
  authError: string = '';
  
  // Auto-lock timer
  lockTimeout: any;

  // Notes State
  notes: VaultNote[] = [];
  activeNote: VaultNote | null = null;
  decryptedContent: string = '';
  
  categories = ['financial', 'personal', 'passwords', 'contacts', 'documents', 'other'];

  constructor(private cryptoService: WebCryptoService) {}

  ngOnInit(): void {
    if (this.cryptoService.hasVault()) {
      this.viewState = 'login';
    } else {
      this.viewState = 'setup';
    }
  }

  resetTimer() {
    if (this.lockTimeout) clearTimeout(this.lockTimeout);
    if (this.activeKey) {
      this.lockTimeout = setTimeout(() => this.lockVault(), 5 * 60 * 1000); // 5 minutes
    }
  }

  async createVault() {
    if (this.passwordInput !== this.confirmPasswordInput) {
      this.authError = "Passwords do not match.";
      return;
    }
    if (this.passwordInput.length < 8) {
      this.authError = "Password must be at least 8 characters.";
      return;
    }
    if (!this.understandRisk) {
      this.authError = "You must acknowledge the recovery risk.";
      return;
    }

    try {
      this.activeKey = await this.cryptoService.deriveKey(this.passwordInput);
      this.cryptoService.saveNotes([]); // init
      this.notes = [];
      this.passwordInput = '';
      this.confirmPasswordInput = '';
      this.authError = '';
      this.viewState = 'list';
      this.resetTimer();
    } catch (e) {
      this.authError = "Failed to create vault.";
    }
  }

  async unlockVault() {
    try {
      this.activeKey = await this.cryptoService.deriveKey(this.passwordInput);
      this.notes = this.cryptoService.getNotes();
      
      // Test decryption with the first note if exists
      if (this.notes.length > 0) {
        await this.cryptoService.decryptText(this.notes[0].encryptedContent, this.notes[0].iv, this.activeKey);
      }
      
      this.passwordInput = '';
      this.authError = '';
      this.viewState = 'list';
      this.resetTimer();
    } catch (e) {
      this.authError = "Incorrect password.";
      this.activeKey = null;
    }
  }

  lockVault() {
    this.activeKey = null;
    this.decryptedContent = '';
    this.activeNote = null;
    this.passwordInput = '';
    this.viewState = 'login';
    if (this.lockTimeout) clearTimeout(this.lockTimeout);
  }

  createNewNote() {
    this.activeNote = {
      id: Date.now().toString(),
      title: 'New Note',
      encryptedContent: '',
      iv: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'personal'
    };
    this.decryptedContent = '';
    this.viewState = 'edit';
    this.resetTimer();
  }

  async openNote(note: VaultNote) {
    try {
      if (!this.activeKey) return;
      this.decryptedContent = await this.cryptoService.decryptText(note.encryptedContent, note.iv, this.activeKey);
      this.activeNote = note;
      this.viewState = 'edit';
      this.resetTimer();
    } catch (e) {
      alert("Failed to decrypt this note.");
    }
  }

  async saveNote() {
    if (!this.activeNote || !this.activeKey) return;
    
    try {
      const { encrypted, iv } = await this.cryptoService.encryptText(this.decryptedContent, this.activeKey);
      this.activeNote.encryptedContent = encrypted;
      this.activeNote.iv = iv;
      this.activeNote.updatedAt = new Date().toISOString();

      const existingIndex = this.notes.findIndex(n => n.id === this.activeNote!.id);
      if (existingIndex >= 0) {
        this.notes[existingIndex] = { ...this.activeNote };
      } else {
        this.notes.push({ ...this.activeNote });
      }

      this.cryptoService.saveNotes(this.notes);
      this.viewState = 'list';
      this.activeNote = null;
      this.decryptedContent = '';
      this.resetTimer();
    } catch (e) {
      alert("Failed to encrypt and save.");
    }
  }

  deleteNote(id: string) {
    if (confirm("Are you sure you want to delete this note?")) {
      this.notes = this.notes.filter(n => n.id !== id);
      this.cryptoService.saveNotes(this.notes);
    }
  }

  exportData() {
    const dataStr = JSON.stringify(this.notes);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'CySafeClick_vault_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}
