import { Component, OnInit, inject, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list'; // For direction details
import { MatIconModule } from '@angular/material/icon'; // For icons in tabs or lists

import { ContentService, VenueInfo } from '../../services/content';

interface SanitizedVenueInfo extends Omit<VenueInfo, 'googleMapsEmbedUrl'> {
  googleMapsEmbedUrl?: SafeResourceUrl;
}

@Component({
  selector: 'app-venue-logistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <section class="venue-logistics-section">
      <h2 class="section-title">Venue & Logistics</h2>
      <div *ngIf="venueInfo$ | async as venue; else loadingOrError" class="venue-content-grid">

        <mat-card class="venue-details-card">
          <mat-card-header>
            <mat-card-title>{{ venue.name }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="address"><mat-icon>location_on</mat-icon> {{ venue.address }}</p>

            <h3 class="subsection-title">How to Reach Us</h3>
            <mat-tab-group animationDuration="0ms">
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="tab-icon">directions_car</mat-icon> By Car
                </ng-template>
                <mat-list role="list">
                  <mat-list-item *ngFor="let detail of venue.directions.car.details" role="listitem">
                    {{ detail }}
                  </mat-list-item>
                </mat-list>
              </mat-tab>
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="tab-icon">train</mat-icon> By Train
                </ng-template>
                <mat-list role="list">
                  <mat-list-item *ngFor="let detail of venue.directions.train.details" role="listitem">
                    {{ detail }}
                  </mat-list-item>
                </mat-list>
              </mat-tab>
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="tab-icon">directions_bus</mat-icon> By Bus
                </ng-template>
                <mat-list role="list">
                  <mat-list-item *ngFor="let detail of venue.directions.bus.details" role="listitem">
                    {{ detail }}
                  </mat-list-item>
                </mat-list>
              </mat-tab>
            </mat-tab-group>
          </mat-card-content>
        </mat-card>

        <mat-card class="map-card" *ngIf="venue.googleMapsEmbedUrl">
          <mat-card-header>
            <mat-card-title>Location Map</mat-card-title>
          </mat-card-header>
          <mat-card-content class="map-container">
            <iframe [src]="venue.googleMapsEmbedUrl"
                    width="100%"
                    height="450"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Google Maps view of {{venue.name}}">
            </iframe>
          </mat-card-content>
        </mat-card>

      </div>
      <ng-template #loadingOrError>
        <p>Loading venue information...</p>
      </ng-template>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem 1rem;
      background-color: #f0f0f0; /* Section background */
    }
    .venue-logistics-section {
      max-width: 1200px;
      margin: 0 auto;
    }
    .section-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 2rem;
      color: #333;
      text-align: center;
    }
    .venue-content-grid {
      display: grid;
      grid-template-columns: 1fr; /* Default to single column for mobile */
      gap: 2rem;
    }
    @media (min-width: 960px) { /* Larger screens: 2 columns */
      .venue-content-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    .venue-details-card .address {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .venue-details-card .subsection-title {
      font-size: 1.3rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    .tab-icon {
      margin-right: 8px;
    }
    .map-container {
      padding: 0 !important; /* Remove padding for iframe to fill card content */
      height: 450px; /* Match iframe height */
    }
    .map-card mat-card-header {
      padding-bottom: 0.5rem; /* Reduce bottom padding if title is short */
    }
  `]
})
export class VenueLogisticsComponent implements OnInit {
  private contentService = inject(ContentService);
  private sanitizer = inject(DomSanitizer);

  public venueInfo$!: Observable<SanitizedVenueInfo>;

  ngOnInit(): void {
    this.venueInfo$ = this.contentService.getVenueInfo().pipe(
      map(venue => {
        if (venue && venue.googleMapsEmbedUrl) {
          return {
            ...venue,
            googleMapsEmbedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(venue.googleMapsEmbedUrl)
          };
        }
        return venue as SanitizedVenueInfo; // Cast if URL is undefined
      })
    );
  }
}
