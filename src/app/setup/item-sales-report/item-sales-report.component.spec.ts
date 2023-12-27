import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSalesReportComponent } from './item-sales-report.component';

describe('ItemSalesReportComponent', () => {
  let component: ItemSalesReportComponent;
  let fixture: ComponentFixture<ItemSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSalesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
