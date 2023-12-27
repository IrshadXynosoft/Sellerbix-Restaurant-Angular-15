import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDiscountReportComponent } from './item-discount-report.component';

describe('ItemDiscountReportComponent', () => {
  let component: ItemDiscountReportComponent;
  let fixture: ComponentFixture<ItemDiscountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDiscountReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDiscountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
