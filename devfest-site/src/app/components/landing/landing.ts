import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // For async pipe
import { MatButtonModule } from '@angular/material/button';
import { ContentService, LandingInfo } from '../../services/content';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map if not already there

interface DisplayLandingInfo extends LandingInfo {
  ticketLink: string;
  fullEventName: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule], // Added CommonModule
  template: `
    <section *ngIf="landingInfo$ | async as info; else loading"
      class="hero-section text-center
             flex flex-col justify-center items-center
             min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]
             py-12 px-4 sm:px-6 lg:px-8
             bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white">
      <div class="hero-content max-w-2xl">
        <p class="event-date text-xl md:text-2xl font-light opacity-90 mb-3 tracking-wide">
          {{ info.eventDate }}
        </p>
        <h1 class="event-title text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          {{ info.fullEventName }}
        </h1>
        <p class="event-payoff text-lg md:text-xl opacity-90 mb-10">
          {{ info.eventPayoff }}
        </p>
        <a mat-flat-button
           color="accent"
           [href]="info.ticketLink"
           target="_blank"
           rel="noopener noreferrer"
           class="cta-button py-3 px-8 md:py-4 md:px-10 text-base md:text-lg font-semibold uppercase rounded-md
                  transform hover:scale-105 transition-transform duration-150 ease-in-out shadow-lg hover:shadow-xl">
          {{ info.ctaButtonText }}
        </a>
      </div>
    </section>
    <ng-template #loading>
      <section class="hero-section text-center flex flex-col justify-center items-center min-h-[calc(100vh-64px)] py-12 px-4 bg-gray-100">
        <!-- Assuming info object is not available in #loading, so using a default or fetching separately if needed -->
        <p>{{ (landingInfo$ | async)?.loadingMessage || 'Loading...' }}</p>
      </section>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LandingComponent implements OnInit {
  private contentService = inject(ContentService);
  public landingInfo$!: Observable<DisplayLandingInfo>;

  ngOnInit(): void {
    this.landingInfo$ = this.contentService.getLandingInfo().pipe(
      map(data => ({
        ...data,
        ticketLink: \`https://gdg.community.dev/\${data.chapterId}?utm_source=devfest-site&utm_medium=cta\`,
        fullEventName: \`\${data.eventName} \${data.eventCityShort} \${data.eventYear}\`
      }))
    );
  }
}
