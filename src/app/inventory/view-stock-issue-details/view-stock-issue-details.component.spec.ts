import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockIssueDetailsComponent } from './view-stock-issue-details.component';

describe('ViewStockIssueDetailsComponent', () => {
  let component: ViewStockIssueDetailsComponent;
  let fixture: ComponentFixture<ViewStockIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockIssueDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStockIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
