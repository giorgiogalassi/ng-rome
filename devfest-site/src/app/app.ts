import { Component, inject } from '@angular/core'; // Added inject
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

// Import page components
import { HeaderComponent } from './components/header/header';
import { LandingComponent } from './components/landing/landing';
import { ProgramPreviewComponent } from './components/program-preview/program-preview';
import { SpeakersGridComponent } from './components/speakers-grid/speakers-grid';
import { VenueLogisticsComponent } from './components/venue-logistics/venue-logistics';
import { AboutGdgComponent } from './components/about-gdg/about-gdg';
import { FooterComponent } from './components/footer/footer';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner';

interface SocialIconInfo {
  name: string; // This will be the name used in mat-icon svgIcon input
  path: string; // Path to the SVG file
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    LandingComponent,
    ProgramPreviewComponent,
    SpeakersGridComponent,
    VenueLogisticsComponent,
    AboutGdgComponent,
    FooterComponent,
    CookieBannerComponent,
    // MatIconModule is not directly imported here, but components using mat-icon will import it.
  ],
  template: `
    <app-header></app-header>
    <main>
      <app-landing></app-landing>
      <app-program-preview></app-program-preview>
      <app-speakers-grid></app-speakers-grid>
      <app-venue-logistics></app-venue-logistics>
      <app-about-gdg></app-about-gdg>
    </main>
    <app-footer></app-footer>
    <app-cookie-banner></app-cookie-banner>
  `,
  styles: [`
    :host {
      display: block;
    }
    main {
      display: block;
    }
  `],
})
export class App {
  protected title = 'devfest-site';
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  private socialIconsToRegister: SocialIconInfo[] = [
    { name: 'social-x', path: 'assets/icons/social/x.svg' },
    { name: 'social-linkedin', path: 'assets/icons/social/linkedin.svg' },
    { name: 'social-youtube', path: 'assets/icons/social/youtube.svg' },
    { name: 'social-instagram', path: 'assets/icons/social/instagram.svg' },
    { name: 'social-github', path: 'assets/icons/social/github.svg' },
    { name: 'social-facebook', path: 'assets/icons/social/facebook.svg' },
    { name: 'social-default-link', path: 'assets/icons/social/link.svg' }, // Added default link
  ];

  constructor() {
    this.registerSocialIcons();
  }

  private registerSocialIcons(): void {
    this.socialIconsToRegister.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    });
  }
}
