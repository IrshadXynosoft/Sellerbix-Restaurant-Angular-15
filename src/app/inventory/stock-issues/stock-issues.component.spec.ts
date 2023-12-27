import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssuesComponent } from './stock-issues.component';

describe('StockIssuesComponent', () => {
  let component: StockIssuesComponent;
  let fixture: ComponentFixture<StockIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
