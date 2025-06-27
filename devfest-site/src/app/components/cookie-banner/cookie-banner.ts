import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Import CommonModule

// Forward declaration for Plausible event queue if needed, or use (window as any).plausible
declare global {
  interface Window {
    plausible?: any; // Define more specific type if Plausible API is used directly
  }
}

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  template: `
    <div *ngIf="showBanner" class="cookie-banner-container" role="region" aria-label="Cookie Consent Banner">
      <div class="banner-content">
        <p>
          We use cookies to enhance your browsing experience and analyze site traffic.
          By clicking "Accept", you consent to our use of cookies for analytics.
        </p>
        <div class="banner-actions">
          <button (click)="acceptCookies()" class="accept-button" aria-label="Accept cookies">Accept</button>
          <!-- <button (click)="declineCookies()" class="decline-button" aria-label="Decline cookies">Decline</button> -->
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .cookie-banner-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #2c3e50; /* Dark background */
      color: #ecf0f1; /* Light text */
      padding: 1rem;
      z-index: 1000;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .banner-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      max-width: 800px;
      text-align: center;
    }
    .banner-content p {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .banner-actions {
      display: flex;
      gap: 1rem;
    }
    .banner-actions button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .accept-button {
      background-color: #27ae60; /* Green */
      color: white;
    }
    /*
    .decline-button {
      background-color: #c0392b; // Red
      color: white;
    }
    */

    @media (min-width: 600px) {
      .banner-content {
        flex-direction: row;
        text-align: left;
      }
    }
  `]
})
export class CookieBannerComponent implements OnInit {
  showBanner = false;
  private readonly consentKey = 'cookie_consent_given';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const consent = localStorage.getItem(this.consentKey);
      if (!consent) {
        this.showBanner = true;
      } else {
        // If consent already given, potentially trigger Plausible load here or ensure it's loaded
        this.loadPlausibleIfNeeded();
      }
    }
  }

  acceptCookies(): void {
    if (this.isBrowser) {
      localStorage.setItem(this.consentKey, 'true');
      this.showBanner = false;
      this.loadPlausibleIfNeeded();
      // Optionally, dispatch a custom event if other services need to react
      // window.dispatchEvent(new CustomEvent('cookieConsentGiven'));
    }
  }

  // declineCookies(): void {
  //   if (this.isBrowser) {
  //     localStorage.setItem(this.consentKey, 'false'); // Or remove item
  //     this.showBanner = false;
  //     // Handle declined state - e.g., ensure Plausible is not loaded
  //   }
  // }

  private loadPlausibleIfNeeded(): void {
    if (this.isBrowser && localStorage.getItem(this.consentKey) === 'true') {
      // Check if Plausible script is already loaded
      if (document.getElementById('plausible-script')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'plausible-script';
      script.defer = true;
      script.setAttribute('data-domain', 'YOUR_DOMAIN.COM'); // Replace with actual domain
      script.src = 'https://plausible.io/js/script.js';
      // To track localhost, use specific extensions like script.local.js as per Plausible docs.
      // For this general setup, using the standard script.

      document.head.appendChild(script);

      // If Plausible script handles SPA navigation changes automatically (script.js usually does),
      // then explicit router event tracking might not be needed.
      // If manual pageview tracking is desired:
      // if (window.plausible) {
      //   window.plausible('pageview'); // Track initial pageview if script loaded after initial content
      // }
    }
  }

  // Call this method if you want to re-show banner (e.g., for testing or if user clears consent via site UI)
  // clearConsent(): void {
  //   if (this.isBrowser) {
  //     localStorage.removeItem(this.consentKey);
  //     this.showBanner = true;
  //     // Also remove the script if it was added
  //     const plausibleScript = document.getElementById('plausible-script');
  //     if (plausibleScript) {
  //       plausibleScript.remove();
  //     }
  //   }
  // }
}
