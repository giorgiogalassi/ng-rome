import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Speaker {
  id: string;
  name: string;
  talkTitle: string;
  bio?: string;
  photoUrl: string;
  socialLinks?: {
    iconName: string;
    url: string;
    ariaLabel: string;
  }[];
}

export interface VenueInfo {
  name: string;
  address: string;
  googleMapsEmbedUrl?: string;
  directions: {
    car: { title: string; details: string[] };
    train: { title: string; details: string[] };
    bus: { title: string; details: string[] };
  };
}

export interface AboutInfo {
  gdgDescription: string;
  codeOfConduct: {
    summary?: string;
    fullTextLink: string;
    linkText: string;
  };
}

export interface SocialLink {
  iconName: string;
  url: string;
  ariaLabel: string;
}

export interface FooterInfo {
  socialLinks: SocialLink[];
  copyrightText: string;
  contactEmail: string;
}

export interface LandingInfo {
  eventDate: string;
  eventCityShort: string;
  eventCityFull: string;
  eventName: string;
  eventYear: string;
  eventPayoff: string;
  chapterId: string;
  ctaButtonText: string;
  loadingMessage: string; // Added loadingMessage
}

export interface AgendaBlock {
  id: string;
  title: string;
  timeRange: string;
  description: string;
}

export interface ProgramInfo {
  sectionTitle: string;
  agendaBlocks: AgendaBlock[];
}

export interface SiteInfo { // New interface for site.json
  eventName: string;
  eventLocationShort: string;
  eventYear: string;
  siteNavPlaceholder: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private dataRoot = 'assets/data';
  private speakersDataUrl = `${this.dataRoot}/speakers.json`;
  private venueDataUrl = `${this.dataRoot}/venue.json`;
  private aboutDataUrl = `${this.dataRoot}/about.json`;
  private footerDataUrl = `${this.dataRoot}/footer.json`;
  private landingDataUrl = `${this.dataRoot}/landing.json`;
  private programDataUrl = `${this.dataRoot}/program.json`;
  private siteDataUrl = `${this.dataRoot}/site.json`; // Added site data URL

  constructor(private http: HttpClient) { }

  getSpeakers(): Observable<Speaker[]> {
    return this.http.get<Speaker[]>(this.speakersDataUrl);
  }

  getVenueInfo(): Observable<VenueInfo> {
    return this.http.get<VenueInfo>(this.venueDataUrl);
  }

  getAboutInfo(): Observable<AboutInfo> {
    return this.http.get<AboutInfo>(this.aboutDataUrl);
  }

  getFooterInfo(): Observable<FooterInfo> {
    return this.http.get<FooterInfo>(this.footerDataUrl);
  }

  getLandingInfo(): Observable<LandingInfo> {
    return this.http.get<LandingInfo>(this.landingDataUrl);
  }

  getProgramInfo(): Observable<ProgramInfo> {
    return this.http.get<ProgramInfo>(this.programDataUrl);
  }

  getSiteInfo(): Observable<SiteInfo> { // Added method for site info
    return this.http.get<SiteInfo>(this.siteDataUrl);
  }
}
