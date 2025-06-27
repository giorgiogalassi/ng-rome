import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ContentService, SiteInfo } from '../../services/content'; // Use SiteInfo
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface DisplayHeaderInfo {
  siteTitle: string;
  navPlaceholder: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <header class="site-page-header" *ngIf="headerInfo$ | async as info; else loadingHeader">
      <mat-toolbar color="primary" class="flex justify-between items-center p-4 shadow-md">
        <div class="site-title text-xl font-bold">
          <a href="/">{{ info.siteTitle }}</a>
        </div>
        <nav class="site-nav" aria-label="Main navigation">
          <span class="text-sm">{{ info.navPlaceholder }}</span>
        </nav>
      </mat-toolbar>
    </header>
    <ng-template #loadingHeader>
      <header class="site-page-header">
        <mat-toolbar color="primary" class="flex justify-between items-center p-4 shadow-md">
            <div class="site-title text-xl font-bold">Loading...</div>
            <nav class="site-nav" aria-label="Main navigation">
              <span class="text-sm">...</span>
            </nav>
        </mat-toolbar>
      </header>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .site-page-header a {
      color: inherit;
      text-decoration: none;
    }
  `]
})
export class HeaderComponent implements OnInit {
  private contentService = inject(ContentService);
  public headerInfo$!: Observable<DisplayHeaderInfo>;

  ngOnInit(): void {
    this.headerInfo$ = this.contentService.getSiteInfo().pipe(
      map(siteData => ({
        siteTitle: `${siteData.eventName} ${siteData.eventLocationShort} ${siteData.eventYear}`,
        navPlaceholder: siteData.siteNavPlaceholder
      }))
    );
  }
}
