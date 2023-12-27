import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePromotionsDetailComponent } from './advance-promotions-detail.component';

describe('AdvancePromotionsDetailComponent', () => {
  let component: AdvancePromotionsDetailComponent;
  let fixture: ComponentFixture<AdvancePromotionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePromotionsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePromotionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
