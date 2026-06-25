import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwoFactorAdvisorService, Platform2FAInfo, TwoFAMethod } from './two-factor-advisor.service';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';

@Component({
  selector: 'app-two-factor-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule, StepperComponent, AccordionComponent, RiskBadgeComponent],
  templateUrl: './two-factor-advisor.component.html',
  styleUrls: ['./two-factor-advisor.component.scss']
})
export class TwoFactorAdvisorComponent implements OnInit {
  steps = ['Select Platforms', 'Current Status', 'Upgrade Path'];
  currentStep = signal<number>(0);
  
  platforms = signal<Platform2FAInfo[]>([]);
  searchQuery = signal<string>('');
  
  selectedPlatformIds = signal<Set<string>>(new Set());
  
  // Mapping of platform ID to currently used 2FA method
  currentMethods = signal<Map<string, TwoFAMethod>>(new Map());

  filteredPlatforms = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.platforms().filter(p => p.name.toLowerCase().includes(q));
  });

  selectedPlatforms = computed(() => {
    return this.platforms().filter(p => this.selectedPlatformIds().has(p.id));
  });

  results = computed(() => {
    const sorted = [...this.selectedPlatforms()].sort((a, b) => {
      const methodA = this.currentMethods().get(a.id) || 'none';
      const methodB = this.currentMethods().get(b.id) || 'none';
      return this.twoFactorService.getMethodRank(methodA) - this.twoFactorService.getMethodRank(methodB);
    });
    return sorted;
  });

  constructor(public twoFactorService: TwoFactorAdvisorService) {}

  ngOnInit() {
    this.twoFactorService.getPlatforms().subscribe(data => {
      this.platforms.set(data);
    });
  }

  onStepChange(step: number) {
    if (step === 1 && this.selectedPlatformIds().size === 0) {
      alert('Please select at least one platform.');
      return;
    }
    this.currentStep.set(step);
  }

  togglePlatformSelection(id: string) {
    const newSet = new Set(this.selectedPlatformIds());
    if (newSet.has(id)) {
      newSet.delete(id);
      const newMethods = new Map(this.currentMethods());
      newMethods.delete(id);
      this.currentMethods.set(newMethods);
    } else {
      newSet.add(id);
      const newMethods = new Map(this.currentMethods());
      newMethods.set(id, 'none');
      this.currentMethods.set(newMethods);
    }
    this.selectedPlatformIds.set(newSet);
  }

  setMethod(platformId: string, method: TwoFAMethod) {
    const newMethods = new Map(this.currentMethods());
    newMethods.set(platformId, method);
    this.currentMethods.set(newMethods);
  }

  getMethodRank(method: TwoFAMethod) {
    return this.twoFactorService.getMethodRank(method);
  }

  getMethodName(method: TwoFAMethod) {
    return this.twoFactorService.getMethodName(method);
  }

  getRiskLevel(platformId: string): 'safe' | 'suspicious' | 'dangerous' {
    const current = this.currentMethods().get(platformId) || 'none';
    const rank = this.getMethodRank(current);
    if (rank >= 3) return 'safe';
    if (rank === 2) return 'suspicious'; // SMS is suspicious/medium
    return 'dangerous'; // None is dangerous
  }
}
