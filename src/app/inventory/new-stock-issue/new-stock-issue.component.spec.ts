import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStockIssueComponent } from './new-stock-issue.component';

describe('NewStockIssueComponent', () => {
  let component: NewStockIssueComponent;
  let fixture: ComponentFixture<NewStockIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStockIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStockIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
