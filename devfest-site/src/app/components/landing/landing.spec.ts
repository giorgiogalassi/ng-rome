import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LandingComponent } from './landing';
import { ContentService, LandingInfo } from '../../services/content';
import { Observable, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // For Material components
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

// Mock ContentService
class MockContentService {
  getLandingInfo(): Observable<LandingInfo> {
    return of({
      eventDate: 'October 26-27, 2024',
      eventCityShort: 'Goa',
      eventCityFull: 'Goa, India',
      eventName: 'DevFest',
      eventYear: '2024',
      eventPayoff: 'The biggest Google tech conference in Goa!',
      chapterId: 'gdg-goa',
      ctaButtonText: 'Book Ticket',
      loadingMessage: 'Loading...'
    });
  }
}

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LandingComponent, NoopAnimationsModule], // LandingComponent is standalone
      providers: [
        { provide: ContentService, useClass: MockContentService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges(); // Trigger ngOnInit and initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event information from ContentService', (done) => {
    fixture.whenStable().then(async () => { // Use whenStable for async operations like service calls
      const compiled = fixture.nativeElement as HTMLElement;

      // Check data derived in component's map operator
      component.landingInfo$.subscribe(info => {
        expect(compiled.querySelector('.event-date')?.textContent).toContain('October 26-27, 2024');
        expect(compiled.querySelector('.event-title')?.textContent).toContain('DevFest Goa 2024');
        expect(compiled.querySelector('.event-payoff')?.textContent).toContain('The biggest Google tech conference in Goa!');

        const ctaButton = await loader.getHarness(MatButtonHarness.with({text: 'Book Ticket'}));
        expect(await ctaButton.getText()).toBe('Book Ticket');
        // Check href on the <a> tag directly for this test
        const ctaAnchor = compiled.querySelector('.cta-button') as HTMLAnchorElement;
        expect(ctaAnchor.href).toBe('https://gdg.community.dev/gdg-goa?utm_source=devfest-site&utm_medium=cta');
        done();
      });
    });
  });

  it('should correctly generate ticketLink', (done) => {
    component.landingInfo$.subscribe(info => {
      // The map operator in component creates ticketLink within the DisplayLandingInfo
      expect(info.ticketLink).toBe('https://gdg.community.dev/gdg-goa?utm_source=devfest-site&utm_medium=cta');
      done();
    });
  });
});
