import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcommerceFraudService, DealAnalysis } from './ecommerce-fraud.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-ecommerce-fraud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ecommerce-fraud.component.html',
  styleUrls: ['./ecommerce-fraud.component.css']
})
export class EcommerceFraudComponent {
  activeTab: 'deal' | 'seller' | 'scammed' = 'deal';

  // Deal Analysis State
  productName = '';
  actualPrice: number | null = null;
  dealPrice: number | null = null;
  url = '';
  hasTimer = false;
  isPrepaidOnly = false;
  dealResult: DealAnalysis | null = null;

  constructor(private ecommerceService: EcommerceFraudService, public t: TranslationService) {}

  analyzeDeal() {
    if (!this.actualPrice || !this.dealPrice) return;
    this.dealResult = this.ecommerceService.analyzeDeal(
      this.productName, this.actualPrice, this.dealPrice, this.url, this.hasTimer, this.isPrepaidOnly
    );
  }

  getVerdictText(verdict: string) {
    if (verdict.includes('HIGH')) return this.t.translate('ECOMMERCE.VERDICT.HIGH');
    if (verdict.includes('MEDIUM')) return this.t.translate('ECOMMERCE.VERDICT.MED');
    return this.t.translate('ECOMMERCE.VERDICT.LOW');
  }
}
