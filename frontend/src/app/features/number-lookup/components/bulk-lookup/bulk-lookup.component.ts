import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumberLookupService } from '../../number-lookup.service';

interface BulkResultRow {
  number: string;
  normalized: string;
  status: 'guidance' | 'invalid';
  scamType: string;
  riskLevel: string;
}

@Component({
  selector: 'app-bulk-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bulk-lookup-container">
      <h3>Bulk Number Format Check</h3>
      <p>Paste up to 10 numbers (one per line). This checks format only and does not query a public scam-number database.</p>
      
      <div class="input-area">
        <textarea 
          [(ngModel)]="bulkInput" 
          rows="5" 
          placeholder="9876543210&#10;+91 99999 88888&#10;011-23456789"
        ></textarea>
        <button class="btn-primary" (click)="processBulk()" [disabled]="isProcessing() || !bulkInput">
          {{ isProcessing() ? 'Checking...' : 'Check All Numbers' }}
        </button>
      </div>

      <div class="results-table-container" *ngIf="results().length > 0">
        <table class="results-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Status</th>
              <th>Scam Type</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let res of results()" [ngClass]="'row-' + res.status">
              <td>{{res.number}}</td>
              <td>
                <span class="badge" [ngClass]="res.status">
                  {{ res.status === 'guidance' ? 'NO PUBLIC LOOKUP' : 'INVALID' }}
                </span>
              </td>
              <td>{{res.scamType || '-'}}</td>
              <td>
                <span class="risk" [ngClass]="'risk-' + res.riskLevel" *ngIf="res.riskLevel !== 'unknown'">
                  {{res.riskLevel | uppercase}}
                </span>
                <span *ngIf="res.riskLevel === 'unknown'">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .bulk-lookup-container {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 3rem;
      animation: fadeIn 0.4s ease;

      h3 { margin-top: 0; color: #ff9933; }
      p { color: #aaa; margin-bottom: 1.5rem; }

      .input-area {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
        
        textarea {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1rem;
          color: white;
          font-family: monospace;
          resize: vertical;
          &:focus { outline: none; border-color: #ff9933; }
        }
        
        .btn-primary {
          align-self: flex-start;
          background: #ff9933; color: black; border: none;
          padding: 0.8rem 2rem; border-radius: 8px; font-weight: bold;
          cursor: pointer;
          &:disabled { opacity: 0.5; cursor: not-allowed; }
        }
      }

      .results-table-container {
        overflow-x: auto;
        .results-table {
          width: 100%;
          border-collapse: collapse;
          th, td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
          th { color: #aaa; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; }
          
          tbody tr {
            transition: background 0.2s;
            &:hover { background: rgba(255,255,255,0.02); }
            &.row-guidance { background: rgba(37, 99, 235, 0.05); }
          }

          .badge {
            font-size: 0.75rem; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: bold;
            &.guidance { background: #2563eb; color: white; }
            &.invalid { background: #4b5563; color: white; }
          }

          .risk {
            font-size: 0.75rem; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: bold;
            &.risk-critical { color: #dc2626; }
            &.risk-high { color: #ef4444; }
            &.risk-medium { color: #f59e0b; }
            &.risk-low { color: #10b981; }
          }
        }
      }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class BulkLookupComponent {
  bulkInput: string = '';
  isProcessing = signal(false);
  results = signal<BulkResultRow[]>([]);
  
  private service = inject(NumberLookupService);

  async processBulk() {
    if (!this.bulkInput.trim()) return;

    this.isProcessing.set(true);
    this.results.set([]);

    const lines = this.bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0).slice(0, 10);
    const resultRows: BulkResultRow[] = [];

    for (const num of lines) {
      const normalized = this.service.normalizeNumber(num);
      
      if (!this.service.validateIndianNumber(normalized)) {
        resultRows.push({
          number: num,
          normalized,
          status: 'invalid',
          scamType: '',
          riskLevel: 'unknown'
        });
        continue;
      }

      const res = await this.service.lookupNumber(num);
      
      resultRows.push({
        number: num,
        normalized,
        status: 'guidance',
        scamType: res.entry?.scamType || '',
        riskLevel: res.riskLevel
      });
    }

    this.results.set(resultRows);
    this.isProcessing.set(false);
  }
}
