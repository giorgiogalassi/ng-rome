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
    <section class="py-12 px-4 sm:px-6 lg:px-8 bg-google-gray-50 text-google-gray-800">
      <div class="max-w-3xl mx-auto about-content"> {/* Max width for readability */}

        <mat-card class="mb-8"> {/* Added margin bottom for spacing between cards */}
          <mat-card-header>
            <mat-card-title class="text-2xl font-semibold mb-2">About GDG</mat-card-title> {/* Tailwind for title */}
          </mat-card-header>
          <mat-card-content>
            <p class="leading-relaxed" [innerHTML]="formatText(aboutInfo.gdgDescription)"></p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title class="text-2xl font-semibold mb-2">Code of Conduct</mat-card-title> {/* Tailwind for title */}
          </mat-card-header>
          <mat-card-content>
            <p *ngIf="aboutInfo.codeOfConduct.summary" class="leading-relaxed mb-4" [innerHTML]="formatText(aboutInfo.codeOfConduct.summary)"></p>
            <a mat-stroked-button
               color="primary" {/* Use theme color for button */}
               [href]="aboutInfo.codeOfConduct.fullTextLink"
               target="_blank"
               rel="noopener noreferrer"
               class="mt-4 inline-block">
              {{ aboutInfo.codeOfConduct.linkText }}
            </a>
          </mat-card-content>
        </mat-card>

      </div>
      <ng-template #loadingOrError>
        <div class="max-w-3xl mx-auto py-12 px-4 text-center">
            <p>Loading information...</p>
        </div>
      </ng-template>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    /* .about-content can remain single column or be made grid via Tailwind if needed */
    /* Removed most styles as they are now handled by Tailwind or Material theme */
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
