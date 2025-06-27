import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatIconRegistry and DomSanitizer are not needed here as registration happens in App component

import { ContentService, FooterInfo } from '../../services/content'; // SocialLink is also exported from content.ts

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <footer class="site-footer" *ngIf="footerInfo$ | async as footer; else loading">
      <div class="footer-content">
        <div class="social-links" *ngIf="footer.socialLinks && footer.socialLinks.length > 0">
          <a *ngFor="let link of footer.socialLinks"
             mat-icon-button
             [href]="link.url"
             target="_blank"
             [attr.aria-label]="link.ariaLabel"
             [title]="link.ariaLabel">
            <mat-icon [svgIcon]="getSvgIconName(link.iconName)"></mat-icon>
          </a>
        </div>

        <div class="contact-info" *ngIf="footer.contactEmail">
          <a [href]="'mailto:' + footer.contactEmail">{{ footer.contactEmail }}</a>
        </div>

        <div class="copyright" *ngIf="footer.copyrightText">
          <p>{{ footer.copyrightText }}</p>
        </div>
      </div>
    </footer>
    <ng-template #loading>
      <footer class="site-footer placeholder">
        <p>Loading footer...</p>
      </footer>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }
    .site-footer {
      background-color: #333; /* Dark background for footer */
      color: #ccc;
      padding: 2rem 1rem;
      text-align: center;
    }
    .site-footer.placeholder {
      min-height: 100px; /* Placeholder height */
    }
    .footer-content {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .social-links {
      display: flex;
      gap: 0.75rem; /* Gap between icons */
    }
    .social-links a mat-icon {
      fill: #fff; /* SVG fill color */
      width: 24px; /* Standard icon size */
      height: 24px;
    }
    .social-links a:hover mat-icon {
      fill: #aaa; /* SVG fill color on hover */
    }
    .contact-info a {
      color: #eee;
      text-decoration: none;
    }
    .contact-info a:hover {
      text-decoration: underline;
    }
    .copyright p {
      font-size: 0.9rem;
      color: #aaa;
      margin: 0;
    }
  `]
})
export class FooterComponent implements OnInit {
  private contentService = inject(ContentService);
  public footerInfo$!: Observable<FooterInfo>;

  ngOnInit(): void {
    this.footerInfo$ = this.contentService.getFooterInfo().pipe(
      map(info => ({
        ...info,
        copyrightText: info.copyrightText.replace('{year}', new Date().getFullYear().toString())
      }))
    );
  }

  getSvgIconName(iconKey: string): string {
    const map: { [key: string]: string } = {
      'twitter': 'social-x',
      'linkedin': 'social-linkedin',
      'youtube': 'social-youtube',
      'instagram': 'social-instagram',
      'github': 'social-github',
      'facebook': 'social-facebook'
      // Add other mappings if new icons are introduced in JSON
    };
    return map[iconKey.toLowerCase()] || 'link'; // Fallback, though 'link' is not a registered SVG here.
                                                 // A generic registered SVG could be 'social-default-link'
  }
}
