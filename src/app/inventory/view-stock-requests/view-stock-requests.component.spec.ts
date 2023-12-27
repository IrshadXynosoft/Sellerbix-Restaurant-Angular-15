import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockRequestsComponent } from './view-stock-requests.component';

describe('ViewStockRequestsComponent', () => {
  let component: ViewStockRequestsComponent;
  let fixture: ComponentFixture<ViewStockRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStockRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
