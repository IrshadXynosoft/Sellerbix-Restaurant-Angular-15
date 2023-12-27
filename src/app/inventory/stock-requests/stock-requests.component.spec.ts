import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRequestsComponent } from './stock-requests.component';

describe('StockRequestsComponent', () => {
  let component: StockRequestsComponent;
  let fixture: ComponentFixture<StockRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
