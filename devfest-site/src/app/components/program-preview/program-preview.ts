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
    <section class="program-preview-section" *ngIf="programInfo$ | async as program; else loading">
      <h2 class="section-title">{{ program.sectionTitle }}</h2>
      <div class="agenda-blocks-container" *ngIf="program.agendaBlocks && program.agendaBlocks.length > 0">
        <mat-card *ngFor="let block of program.agendaBlocks" [attr.aria-labelledby]="block.id + '-title'">
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
      padding: 2rem 1rem;
      background-color: #f9f9f9;
    }
    .program-preview-section {
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }
    .section-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 2rem;
      color: #333;
    }
    .agenda-blocks-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      text-align: left;
    }
    mat-card-title {
      font-size: 1.4rem;
    }
    mat-card-subtitle {
      font-size: 1rem;
      color: #666;
    }
  `]
})
export class ProgramPreviewComponent implements OnInit {
  private contentService = inject(ContentService);
  public programInfo$!: Observable<ProgramInfo>;

  ngOnInit(): void {
    this.programInfo$ = this.contentService.getProgramInfo();
  }
}
