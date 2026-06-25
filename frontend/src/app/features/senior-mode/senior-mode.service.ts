import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeniorModeService {
  private isSeniorMode = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const saved = localStorage.getItem('safeclick_senior_mode');
    if (saved === 'true') {
      this.enableMode();
    }
  }

  toggleMode(): void {
    if (this.isSeniorMode) {
      this.disableMode();
    } else {
      this.enableMode();
    }
  }

  private enableMode(): void {
    this.isSeniorMode = true;
    this.document.body.classList.add('senior-mode-active');
    localStorage.setItem('safeclick_senior_mode', 'true');
  }

  private disableMode(): void {
    this.isSeniorMode = false;
    this.document.body.classList.remove('senior-mode-active');
    localStorage.setItem('safeclick_senior_mode', 'false');
  }

  isActive(): boolean {
    return this.isSeniorMode;
  }
}
