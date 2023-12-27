import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerReportsComponent } from './ledger-reports.component';

describe('LedgerReportsComponent', () => {
  let component: LedgerReportsComponent;
  let fixture: ComponentFixture<LedgerReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
