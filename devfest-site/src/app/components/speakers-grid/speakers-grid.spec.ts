import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SpeakersGridComponent } from './speakers-grid';
import { ContentService, Speaker } from '../../services/content';
import { Observable, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card'; // MatCardModule is used in template
import { CommonModule } from '@angular/common'; // For async pipe, *ngFor

// Mock ContentService
class MockContentService {
  getSpeakers(): Observable<Speaker[]> {
    return of([
      { id: '1', name: 'Ada Lovelace', talkTitle: 'Analytical Engine', photoUrl: 'ada.jpg', bio: 'Bio1' },
      { id: '2', name: 'Grace Hopper', talkTitle: 'Compilers', photoUrl: 'grace.jpg', bio: 'Bio2' }
    ]);
  }
}

describe('SpeakersGridComponent', () => {
  let component: SpeakersGridComponent;
  let fixture: ComponentFixture<SpeakersGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SpeakersGridComponent, NoopAnimationsModule, MatCardModule, CommonModule], // SpeakersGridComponent is standalone
      providers: [
        { provide: ContentService, useClass: MockContentService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display speakers from ContentService', (done) => {
    fixture.whenStable().then(() => {
      const compiled = fixture.nativeElement as HTMLElement;
      // Wait for async pipe
      component.speakers$.subscribe(speakers => {
        fixture.detectChanges(); // Update view with speakers data
        const speakerCards = compiled.querySelectorAll('mat-card.speaker-card');
        expect(speakerCards.length).toBe(2);
        expect(speakerCards[0].querySelector('mat-card-title')?.textContent).toContain('Ada Lovelace');
        expect(speakerCards[1].querySelector('mat-card-title')?.textContent).toContain('Grace Hopper');
        done();
      });
    });
  });

  it('should display "no speakers" message if no speakers are returned', (done) => {
    // Override service for this specific test
    const contentService = TestBed.inject(ContentService) as unknown as MockContentService; // Get the mock instance
    spyOn(contentService, 'getSpeakers').and.returnValue(of([])); // Spy and return empty array

    // Re-run ngOnInit or trigger change detection if component already initialized
    component.ngOnInit(); // Re-fetch data with the new mock setup
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.speakers$.subscribe(speakers => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.speakers-container mat-card')).toBeNull();
        expect(compiled.querySelector('p')?.textContent).toContain('Speaker information will be available soon!'); // Or the message from JSON
        done();
      });
    });
  });
});
