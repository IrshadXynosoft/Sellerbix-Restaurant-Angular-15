import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxSubstituteComponent } from './tax-substitute.component';

describe('TaxSubstituteComponent', () => {
  let component: TaxSubstituteComponent;
  let fixture: ComponentFixture<TaxSubstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxSubstituteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxSubstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
