import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="content">
        <div class="code">404</div>
        <div class="shield">🛡️</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <p class="tagline">Stay safe — only visit trusted URLs!</p>
        <a routerLink="/" class="home-btn">← Back to CySafeClick Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      font-family: 'Inter', sans-serif;
      padding: 2rem;
      text-align: center;
    }
    .content {
      max-width: 480px;
    }
    .code {
      font-size: 8rem;
      font-weight: 900;
      background: linear-gradient(135deg, #e94560, #f5a623);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .shield {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 1.8rem;
      color: #ffffff;
      margin: 0 0 1rem;
      font-weight: 700;
    }
    p {
      color: #a0aec0;
      font-size: 1rem;
      margin: 0 0 0.5rem;
      line-height: 1.6;
    }
    .tagline {
      color: #f5a623;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    .home-btn {
      display: inline-block;
      padding: 0.85rem 2rem;
      background: linear-gradient(135deg, #e94560, #f5a623);
      color: #ffffff;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: opacity 0.2s, transform 0.2s;
    }
    .home-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {}
