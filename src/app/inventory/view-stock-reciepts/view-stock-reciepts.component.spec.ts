import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockRecieptsComponent } from './view-stock-reciepts.component';

describe('ViewStockRecieptsComponent', () => {
  let component: ViewStockRecieptsComponent;
  let fixture: ComponentFixture<ViewStockRecieptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockRecieptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStockRecieptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
