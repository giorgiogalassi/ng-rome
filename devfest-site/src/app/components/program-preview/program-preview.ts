import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ContentService, ProgramInfo } from '../../services/content'; // Import ProgramInfo
import { Observable } from 'rxjs';

// AgendaBlock interface is now imported from ContentService or defined there globally.
// No need to redefine it here if it's identical.

@Component({
  selector: 'app-program-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <section class="py-12 px-4 sm:px-6 lg:px-8 bg-google-gray-50" *ngIf="programInfo$ | async as program; else loading">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-google-gray-800 mb-10">{{ program.sectionTitle }}</h2>
        <div class="agenda-blocks-container" *ngIf="program.agendaBlocks && program.agendaBlocks.length > 0">
          <mat-card *ngFor="let block of program.agendaBlocks" class="text-left" [attr.aria-labelledby]="block.id + '-title'">
            <mat-card-header>
            <mat-card-title [id]="block.id + '-title'">{{ block.title }}</mat-card-title>
            <mat-card-subtitle>{{ block.timeRange }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ block.description }}</p>
          </mat-card-content>
        </mat-card>
      </div>
      <div *ngIf="!program.agendaBlocks || program.agendaBlocks.length === 0">
        <p>Program details coming soon!</p>
      </div>
    </section>
    <ng-template #loading>
      <section class="program-preview-section">
        <h2 class="section-title">Program Preview</h2>
        <p>Loading program details...</p>
      </section>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      /* Tailwind classes for padding and background applied in template if preferred, or use SCSS variables */
    }
    .program-preview-section {
      /* Using Tailwind classes in template for these now */
    }
    .section-title {
      /* Using Tailwind classes in template for these now */
    }
    .agenda-blocks-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      text-align: left;
    }
    /* Removed explicit font-size for mat-card-title and mat-card-subtitle
       to allow Material theme to control them for consistency.
       The theme typically sets them to Title Medium and Body Medium/Small.
       Custom color for subtitle also removed, will rely on theme's secondary text color.
    */
  `]
})
export class ProgramPreviewComponent implements OnInit {
  private contentService = inject(ContentService);
  public programInfo$!: Observable<ProgramInfo>;

  ngOnInit(): void {
    this.programInfo$ = this.contentService.getProgramInfo();
  }
}
