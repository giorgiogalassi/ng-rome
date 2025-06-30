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
    <section class="py-12 px-4 sm:px-6 lg:px-8 bg-google-gray-50">
      <div class="max-w-6xl mx-auto"> {/* Wider max-width for this section */}
        <h2 class="text-3xl md:text-4xl font-bold text-google-gray-800 mb-10 text-center">Venue & Logistics</h2>
        <div *ngIf="venueInfo$ | async as venue; else loadingOrError" class="venue-content-grid">

          <mat-card class="venue-details-card">
            <mat-card-header>
              <mat-card-title>{{ venue.name }}</mat-card-title> {/* Theme will style this */}
            </mat-card-header>
            <mat-card-content>
              <p class="address text-lg text-google-gray-700 mb-6 flex items-center gap-2">
                <mat-icon>location_on</mat-icon>
                <span>{{ venue.address }}</span>
              </p>

              <h3 class="text-xl font-semibold text-google-gray-800 mt-6 mb-4">How to Reach Us</h3>
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
      /* Background and padding now handled by Tailwind in template */
    }
    /* .venue-logistics-section, .section-title, .venue-content-grid,
       .venue-details-card .address, .venue-details-card .subsection-title
       are now styled via Tailwind classes in the template. */

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
