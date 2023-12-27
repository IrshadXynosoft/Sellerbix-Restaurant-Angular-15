import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStockReportComponent } from './item-stock-report.component';

describe('ItemStockReportComponent', () => {
  let component: ItemStockReportComponent;
  let fixture: ComponentFixture<ItemStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemStockReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
