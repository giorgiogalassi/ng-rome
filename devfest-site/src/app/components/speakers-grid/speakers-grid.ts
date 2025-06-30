import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

import { ContentService, Speaker } from '../../services/content';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-speakers-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule // Add MatIconModule to imports
  ],
  template: `
    <section class="speakers-grid-section">
      <h2 class="section-title">Our Speakers</h2>
      <div *ngIf="speakers$ | async as speakers; else loadingOrError">
        <div *ngIf="speakers.length > 0; else noSpeakers" class="speakers-container">
          <mat-card *ngFor="let speaker of speakers" class="speaker-card" [attr.aria-labelledby]="speaker.id + '-name'">
            <img mat-card-image [src]="speaker.photoUrl" [alt]="'Photo of ' + speaker.name" loading="lazy">
            <mat-card-header>
              <mat-card-title [id]="speaker.id + '-name'">{{ speaker.name }}</mat-card-title>
              <mat-card-subtitle>{{ speaker.talkTitle }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content *ngIf="speaker.bio">
              <p>{{ speaker.bio }}</p>
            </mat-card-content>
            <mat-card-actions *ngIf="speaker.socialLinks && speaker.socialLinks.length > 0">
              <a mat-icon-button *ngFor="let link of speaker.socialLinks"
                 [href]="link.url"
                 target="_blank"
                 [attr.aria-label]="link.ariaLabel"
                 [title]="link.ariaLabel">
                <mat-icon [svgIcon]="getSvgIconName(link.iconName)"></mat-icon>
              </a>
            </mat-card-actions>
          </mat-card>
        </div>
        <ng-template #noSpeakers>
          <p>Speaker information will be available soon!</p>
        </ng-template>
      </div>
      <ng-template #loadingOrError>
        <p>Loading speakers...</p>
      </ng-template>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem 1rem;
      background-color: #ffffff;
    }
    .speakers-grid-section {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    .section-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 2rem;
      color: #333;
    }
    .speakers-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      text-align: left;
    }
    .speaker-card img[mat-card-image] {
      aspect-ratio: 1 / 1;
      object-fit: cover;
    }
    .speaker-card mat-card-header {
      padding-bottom: 0.5rem;
    }
    /* Removed explicit font-size/color for title, subtitle, content p
       to allow Material theme to control them for consistency.
       Min-height for subtitle is kept for layout stability. */
    .speaker-card mat-card-subtitle {
      min-height: 3em;
      line-height: 1.5em; /* Ensure line-height is set if min-height in em is used */
    }
    .speaker-card mat-card-actions {
      padding: 8px 16px;
      display: flex;
      gap: 8px;
    }
    .speaker-card mat-card-actions a mat-icon {
      fill: #555; /* Default icon color for speaker cards */
      width: 20px;
      height: 20px;
    }
    .speaker-card mat-card-actions a:hover mat-icon {
      fill: #000; /* Darker on hover */
    }
  `]
})
export class SpeakersGridComponent implements OnInit {
  private contentService = inject(ContentService);
  public speakers$!: Observable<Speaker[]>;

  ngOnInit(): void {
    this.speakers$ = this.contentService.getSpeakers();
  }

  getSvgIconName(iconKey: string): string {
    const map: { [key: string]: string } = {
      'twitter': 'social-x',
      'linkedin': 'social-linkedin',
      'youtube': 'social-youtube',
      'instagram': 'social-instagram',
      'github': 'social-github',
      'facebook': 'social-facebook'
    };
    return map[iconKey.toLowerCase()] || 'social-default-link'; // Ensure 'social-default-link' is registered if used as fallback
  }
}
