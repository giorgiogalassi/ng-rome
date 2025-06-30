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
    <footer class="bg-google-gray-800 text-google-gray-200 py-8 px-4 text-center"
            *ngIf="footerInfo$ | async as footer; else loading">
      <div class="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div class="social-links flex gap-3" *ngIf="footer.socialLinks && footer.socialLinks.length > 0">
          <a *ngFor="let link of footer.socialLinks"
             mat-icon-button
             [href]="link.url"
             target="_blank"
             [attr.aria-label]="link.ariaLabel"
             [title]="link.ariaLabel"
             class="text-google-gray-50 hover:text-google-gray-300">
            <mat-icon [svgIcon]="getSvgIconName(link.iconName)" class="social-icon"></mat-icon>
          </a>
        </div>

        <div class="contact-info" *ngIf="footer.contactEmail">
          <a [href]="'mailto:' + footer.contactEmail" class="hover:underline">{{ footer.contactEmail }}</a>
        </div>

        <div class="copyright" *ngIf="footer.copyrightText">
          <p class="text-sm text-google-gray-400">{{ footer.copyrightText }}</p>
        </div>
      </div>
    </footer>
    <ng-template #loading>
      <footer class="bg-google-gray-800 text-google-gray-200 py-8 px-4 text-center min-h-[100px]">
        <p>Loading footer...</p>
      </footer>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }
    /* Custom styles for SVG fill if Tailwind classes don't target it effectively */
    .social-icon {
      fill: currentColor; /* Inherits text color from parent 'a' tag */
      width: 24px;
      height: 24px;
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
