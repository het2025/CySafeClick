import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ai-tools-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" style="padding: 60px 0; text-align: center; max-width: 900px;">
      <h1 style="font-size: 2.5rem; margin-bottom: 10px;">SafeClick AI Tools Hub 🤖✨</h1>
      <p style="font-size: 1.2rem; color: var(--muted); margin-bottom: 40px;">Experience the next generation of cyber safety. Our advanced AI tools analyze threats instantly and guide you in real-time.</p>
      
      <div class="tool-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; text-align: left;">
        
        <a routerLink="/ai-tools/scam-analyzer" class="tool-card ai-card" style="border: 2px solid transparent; background: linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, var(--accent-saffron), #a855f7) border-box; padding: 24px; border-radius: 12px; display: block; text-decoration: none; color: inherit; transition: all 0.3s;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🤖</div>
          <span style="background: linear-gradient(135deg, var(--accent-saffron), #a855f7); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; margin-bottom: 10px; display: inline-block;">✨ AI Powered</span>
          <h3 style="margin: 0 0 10px 0; font-size: 1.3rem;">AI Scam Analyzer</h3>
          <p style="color: var(--muted); margin-bottom: 15px;">Paste any suspicious WhatsApp/SMS message — AI instantly detects if it's a scam.</p>
          <span style="color: var(--accent-saffron); font-weight: bold;">Open Tool →</span>
        </a>

        <a routerLink="/tools/cyber-mitra" class="tool-card ai-card" style="border: 2px solid transparent; background: linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, var(--accent-saffron), #a855f7) border-box; padding: 24px; border-radius: 12px; display: block; text-decoration: none; color: inherit; transition: all 0.3s;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">💬</div>
          <span style="background: linear-gradient(135deg, var(--accent-saffron), #a855f7); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; margin-bottom: 10px; display: inline-block;">✨ AI Powered</span>
          <h3 style="margin: 0 0 10px 0; font-size: 1.3rem;">Cyber Mitra Chatbot</h3>
          <p style="color: var(--muted); margin-bottom: 15px;">Chat with your personal AI cyber safety companion in Hindi or English.</p>
          <span style="color: var(--accent-saffron); font-weight: bold;">Open Tool →</span>
        </a>

        <a routerLink="/ai-tools/transaction-risk" class="tool-card ai-card" style="border: 2px solid transparent; background: linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, var(--accent-saffron), #a855f7) border-box; padding: 24px; border-radius: 12px; display: block; text-decoration: none; color: inherit; transition: all 0.3s;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">💳</div>
          <span style="background: linear-gradient(135deg, var(--accent-saffron), #a855f7); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; margin-bottom: 10px; display: inline-block;">✨ AI Powered</span>
          <h3 style="margin: 0 0 10px 0; font-size: 1.3rem;">Transaction Risk Checker</h3>
          <p style="color: var(--muted); margin-bottom: 15px;">Verify a UPI ID or phone number before sending money.</p>
          <span style="color: var(--accent-saffron); font-weight: bold;">Open Tool →</span>
        </a>
        
      </div>
    </div>
  `
})
export class AiToolsHubComponent { }
