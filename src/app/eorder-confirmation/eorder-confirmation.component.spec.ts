import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EorderConfirmationComponent } from './eorder-confirmation.component';

describe('EorderConfirmationComponent', () => {
  let component: EorderConfirmationComponent;
  let fixture: ComponentFixture<EorderConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EorderConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EorderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
