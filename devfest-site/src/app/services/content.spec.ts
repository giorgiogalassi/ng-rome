import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContentService, Speaker, LandingInfo, ProgramInfo, SiteInfo, VenueInfo, AboutInfo, FooterInfo } from './content'; // Adjust path as needed

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;
  const dataRoot = 'assets/data'; // Match the service's dataRoot

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentService]
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch speakers data from speakers.json', () => {
    const mockSpeakers: Speaker[] = [
      { id: '1', name: 'Test Speaker', talkTitle: 'Test Talk', photoUrl: 'url' }
    ];
    service.getSpeakers().subscribe(speakers => {
      expect(speakers.length).toBe(1);
      expect(speakers).toEqual(mockSpeakers);
    });
    const req = httpMock.expectOne(`${dataRoot}/speakers.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpeakers);
  });

  it('should fetch landing info from landing.json', () => {
    const mockLandingInfo: LandingInfo = {
      eventDate: 'Oct 1', eventCityShort: 'City', eventCityFull: 'Full City', eventName: 'DevFest',
      eventYear: '2024', eventPayoff: 'Payoff', chapterId: 'id', ctaButtonText: 'CTA', loadingMessage: 'Loading...'
    };
    service.getLandingInfo().subscribe(info => {
      expect(info).toEqual(mockLandingInfo);
    });
    const req = httpMock.expectOne(`${dataRoot}/landing.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLandingInfo);
  });

  it('should fetch program info from program.json', () => {
    const mockProgramInfo: ProgramInfo = {
      sectionTitle: 'Program', agendaBlocks: []
    };
    service.getProgramInfo().subscribe(info => {
      expect(info).toEqual(mockProgramInfo);
    });
    const req = httpMock.expectOne(`${dataRoot}/program.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProgramInfo);
  });

  it('should fetch site info from site.json', () => {
    const mockSiteInfo: SiteInfo = {
      eventName: 'DevFest', eventLocationShort: 'City', eventYear: '2024', siteNavPlaceholder: 'Nav'
    };
    service.getSiteInfo().subscribe(info => {
      expect(info).toEqual(mockSiteInfo);
    });
    const req = httpMock.expectOne(`${dataRoot}/site.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSiteInfo);
  });

  it('should fetch venue info from venue.json', () => {
    const mockVenueInfo: VenueInfo = { /* provide mock data */ } as VenueInfo; // Cast for brevity
    service.getVenueInfo().subscribe(info => {
      expect(info).toEqual(mockVenueInfo);
    });
    const req = httpMock.expectOne(`${dataRoot}/venue.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVenueInfo);
  });

  it('should fetch about info from about.json', () => {
    const mockAboutInfo: AboutInfo = { /* provide mock data */ } as AboutInfo;
    service.getAboutInfo().subscribe(info => {
      expect(info).toEqual(mockAboutInfo);
    });
    const req = httpMock.expectOne(`${dataRoot}/about.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAboutInfo);
  });

  it('should fetch footer info from footer.json', () => {
    const mockFooterInfo: FooterInfo = { /* provide mock data */ } as FooterInfo;
    service.getFooterInfo().subscribe(info => {
      expect(info).toEqual(mockFooterInfo);
    });
    const req = httpMock.expectOne(`${dataRoot}/footer.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFooterInfo);
  });

});
