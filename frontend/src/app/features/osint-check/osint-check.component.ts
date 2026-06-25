import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-osint-check',
  standalone: true,
  imports: [CommonModule, FormsModule, StepperComponent, ProgressRingComponent],
  templateUrl: './osint-check.component.html',
  styleUrls: ['./osint-check.component.scss']
})
export class OsintCheckComponent {
  steps = ['Google Yourself', 'Check Truecaller', 'Social Media', 'Data Brokers', 'Results'];
  currentStep = signal<number>(0);

  googleChecks = signal<ChecklistItem[]>([
    { id: 'g1', label: 'I searched my full name in quotes (e.g., "John Doe")', checked: false },
    { id: 'g2', label: 'I searched my phone number', checked: false },
    { id: 'g3', label: 'I searched my primary email address', checked: false },
    { id: 'g4', label: 'I checked Google Images for my face', checked: false }
  ]);

  truecallerChecks = signal<ChecklistItem[]>([
    { id: 't1', label: 'I visited truecaller.com/search and checked my number', checked: false },
    { id: 't2', label: 'I requested removal at truecaller.com/unlisting (if found)', checked: false }
  ]);

  socialChecks = signal<ChecklistItem[]>([
    { id: 's1', label: 'My Facebook profile is not visible to public search', checked: false },
    { id: 's2', label: 'My Instagram account is Private', checked: false },
    { id: 's3', label: 'My LinkedIn contact info (email/phone) is hidden from public', checked: false },
    { id: 's4', label: 'My WhatsApp profile photo is visible to Contacts only', checked: false }
  ]);

  brokerChecks = signal<ChecklistItem[]>([
    { id: 'b1', label: 'I checked JustDial for my number', checked: false },
    { id: 'b2', label: 'I checked IndiaInfo/Sulekha', checked: false },
    { id: 'b3', label: 'I searched HaveIBeenPwned.com for my email', checked: false }
  ]);

  exposureScore = computed(() => {
    // Score out of 100 based on what is NOT checked (since checking implies they secured it or verified it's safe)
    // Wait, the prompt says "Checklist items user marks off as they check."
    // Let's assume if it's checked, they did the check. We should ask "Did you find exposed data?"
    // The prompt: "Checklist items user marks off as they check."
    let completed = 0;
    let total = this.googleChecks().length + this.truecallerChecks().length + this.socialChecks().length + this.brokerChecks().length;
    
    this.googleChecks().forEach(c => { if(c.checked) completed++; });
    this.truecallerChecks().forEach(c => { if(c.checked) completed++; });
    this.socialChecks().forEach(c => { if(c.checked) completed++; });
    this.brokerChecks().forEach(c => { if(c.checked) completed++; });
    
    return Math.round((completed / total) * 100);
  });

  onStepChange(step: number) {
    this.currentStep.set(step);
  }

  toggleCheck(listName: string, id: string) {
    let listSignal: any;
    if (listName === 'google') listSignal = this.googleChecks;
    else if (listName === 'truecaller') listSignal = this.truecallerChecks;
    else if (listName === 'social') listSignal = this.socialChecks;
    else if (listName === 'broker') listSignal = this.brokerChecks;

    if (listSignal) {
      const newList = listSignal().map((item: ChecklistItem) => {
        if (item.id === id) return { ...item, checked: !item.checked };
        return item;
      });
      listSignal.set(newList);
    }
  }
}
