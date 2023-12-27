import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedLedgersComponent } from './approved-ledgers.component';

describe('ApprovedLedgersComponent', () => {
  let component: ApprovedLedgersComponent;
  let fixture: ComponentFixture<ApprovedLedgersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedLedgersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
