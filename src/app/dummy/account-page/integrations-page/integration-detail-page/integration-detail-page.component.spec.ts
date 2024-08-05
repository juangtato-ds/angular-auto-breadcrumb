import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationDetailPageComponent } from './integration-detail-page.component';

describe('IntegrationDetailPageComponent', () => {
  let component: IntegrationDetailPageComponent;
  let fixture: ComponentFixture<IntegrationDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
