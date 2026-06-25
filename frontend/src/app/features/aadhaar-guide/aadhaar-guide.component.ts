import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aadhaar-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aadhaar-guide.component.html',
  styleUrls: ['./aadhaar-guide.component.scss']
})
export class AadhaarGuideComponent {
  
  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
