import { Component, EventEmitter, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScamCallType, UserReport } from '../../number-lookup.service';
// import { Store } from '@ngrx/store';
// import { CySafeClickShieldActions } from '...'; // Placeholder for integration

@Component({
  selector: 'app-report-number',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        
        <div class="modal-header">
          <h2>Report a Scam Number</h2>
          <button class="btn-close" (click)="close.emit()">×</button>
        </div>

        <div class="report-form" *ngIf="!isSubmitted()">
          <p class="form-help">Public number reports are disabled to avoid storing or publishing personal identifiers. Please report through official channels.</p>
          
          <div class="form-group">
            <label>Phone Number *</label>
            <input type="text" name="number" [(ngModel)]="formData.number" readonly>
          </div>

          <div class="form-group">
            <label>Scam Type *</label>
            <select name="scamType" [(ngModel)]="formData.scamType" disabled>
              <option value="" disabled>Select the type of scam...</option>
              <option *ngFor="let type of scamTypes" [value]="type">{{type | uppercase}}</option>
            </select>
          </div>

          <div class="form-group">
            <label>What happened? *</label>
            <textarea name="description" [(ngModel)]="formData.description" 
              rows="3" disabled
              placeholder="E.g., Caller claimed to be from Customs and demanded ₹50,000 for a parcel..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date of Call *</label>
              <input type="date" name="date" [(ngModel)]="formData.date" disabled>
            </div>
            <div class="form-group">
              <label>Amount Lost (optional)</label>
              <div class="input-icon">
                <span>₹</span>
                <input type="number" name="amountLost" [(ngModel)]="formData.amountLost" placeholder="0" disabled>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Your City *</label>
              <input type="text" name="city" [(ngModel)]="formData.city" disabled>
            </div>
            <div class="form-group">
              <label>Your State *</label>
              <select name="state" [(ngModel)]="formData.state" disabled>
                <option value="" disabled>Select State</option>
                <option *ngFor="let state of statesList" [value]="state">{{state}}</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="close.emit()">Cancel</button>
            <a class="btn-submit" href="https://cybercrime.gov.in" target="_blank" rel="noopener">Open Official Portal</a>
          </div>
        </div>

        <div class="success-message" *ngIf="isSubmitted()">
          <div class="icon">✅</div>
          <h3>Public reporting is disabled</h3>
          <p>No report was saved. Please use 1930, cybercrime.gov.in, your bank, or local police.</p>
          <button class="btn-primary" (click)="submitted.emit()">Close</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(5px);
      display: flex; justify-content: center; align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: #1e1e24; width: 100%; max-width: 500px;
      border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      animation: popIn 0.3s ease;
    }
    .modal-header {
      padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex; justify-content: space-between; align-items: center;
      h2 { margin: 0; color: #fff; font-size: 1.3rem; }
      .btn-close { background: none; border: none; color: #aaa; font-size: 1.5rem; cursor: pointer; }
    }
    .report-form {
      padding: 1.5rem;
      .form-help { color: #ff9933; margin-top: 0; font-size: 0.9rem; margin-bottom: 1.5rem; }
      
      .form-group {
        margin-bottom: 1rem;
        label { display: block; margin-bottom: 0.3rem; color: #ccc; font-size: 0.9rem; }
        input, select, textarea {
          width: 100%; padding: 0.8rem; border-radius: 8px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: white; font-family: inherit;
          &:focus { outline: none; border-color: #ff9933; }
          &[readonly] { opacity: 0.7; cursor: not-allowed; }
        }
        .input-icon {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          span { padding: 0 1rem; color: #aaa; }
          input { border: none; background: transparent; padding-left: 0; }
        }
      }
      .form-row {
        display: flex; gap: 1rem;
        .form-group { flex: 1; }
      }
      .form-actions {
        display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;
        button { padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: bold; border: none; }
        .btn-cancel { background: transparent; color: #aaa; &:hover { color: #fff; } }
        .btn-submit { background: #ff9933; color: black; &:disabled { opacity: 0.5; cursor: not-allowed; } }
      }
    }
    .success-message {
      padding: 3rem 2rem; text-align: center;
      .icon { font-size: 4rem; margin-bottom: 1rem; }
      h3 { color: #4ade80; margin-bottom: 0.5rem; }
      p { color: #ccc; margin-bottom: 2rem; }
      .btn-primary { background: #ff9933; color: black; padding: 0.8rem 2rem; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; }
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ReportNumberComponent implements OnInit {
  @Input() prefilledNumber: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  isSubmitted = signal(false);

  scamTypes: ScamCallType[] = [
    'digital-arrest', 'fake-trai', 'fake-police', 
    'fake-bank', 'fake-kyc', 'investment-scam', 
    'job-scam', 'lottery-scam', 'courier-scam', 
    'tech-support', 'aadhaar-misuse', 
    'electricity-bill', 'insurance-fraud', 
    'income-tax', 'other'
  ];

  statesList = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh'
  ];

  formData: Partial<UserReport> = {
    scamType: '' as any,
    state: ''
  };

  ngOnInit() {
    this.formData.number = this.prefilledNumber || '';
    this.formData.date = new Date().toISOString().split('T')[0];
  }

  submitReport() {
    this.isSubmitted.set(true);
  }
}
