import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-child-safety',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './child-safety.component.html',
  styleUrls: ['./child-safety.component.css']
})
export class ChildSafetyComponent {
  childName: string = '';
  parentName: string = '';

  constructor(public t: TranslationService) {}

  printAgreement() {
    window.print();
  }
}
