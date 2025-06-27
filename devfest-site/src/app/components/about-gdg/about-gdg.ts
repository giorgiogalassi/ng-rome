import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // For the CoC link

import { ContentService, AboutInfo } from '../../services/content';

@Component({
  selector: 'app-about-gdg',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <section class="about-gdg-section">
      <div *ngIf="aboutInfo$ | async as about; else loadingOrError" class="about-content">

        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>About GDG</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p [innerHTML]="formatText(about.gdgDescription)"></p>
          </mat-card-content>
        </mat-card>

        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>Code of Conduct</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p *ngIf="about.codeOfConduct.summary" [innerHTML]="formatText(about.codeOfConduct.summary)"></p>
            <a mat-stroked-button
               [href]="about.codeOfConduct.fullTextLink"
               target="_blank"
               rel="noopener noreferrer"
               class="coc-link">
              {{ about.codeOfConduct.linkText }}
            </a>
          </mat-card-content>
        </mat-card>

      </div>
      <ng-template #loadingOrError>
        <p>Loading information...</p>
      </ng-template>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem 1rem;
      background-color: #f9f9f9; /* Light background for the section */
    }
    .about-gdg-section {
      max-width: 900px;
      margin: 0 auto;
    }
    .about-content {
      display: grid;
      grid-template-columns: 1fr; /* Single column for mobile */
      gap: 2rem;
    }
    @media (min-width: 768px) { /* Two columns for larger screens if desired, or keep single for readability */
      .about-content {
        /* grid-template-columns: 1fr 1fr; */ /* Can enable if two distinct blocks are desired side-by-side */
      }
    }
    .content-card mat-card-title {
      font-size: 1.6rem; /* Slightly larger title for these info cards */
      margin-bottom: 0.5rem;
    }
    .content-card mat-card-content p {
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    .content-card mat-card-content p:last-child {
      margin-bottom: 0;
    }
    .coc-link {
      margin-top: 1rem;
      display: inline-block; /* Or block if it should take full width */
    }
  `]
})
export class AboutGdgComponent implements OnInit {
  private contentService = inject(ContentService);
  public aboutInfo$!: Observable<AboutInfo>;

  ngOnInit(): void {
    this.aboutInfo$ = this.contentService.getAboutInfo();
  }

  // Helper to format text if it might contain newlines or simple HTML
  // For basic newlines, CSS white-space: pre-line could also be used on the <p>
  formatText(text: string): string {
    return text.replace(/\\n/g, '<br>');
  }
}
