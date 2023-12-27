import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotapprovedLedgersComponent } from './notapproved-ledgers.component';

describe('NotapprovedLedgersComponent', () => {
  let component: NotapprovedLedgersComponent;
  let fixture: ComponentFixture<NotapprovedLedgersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotapprovedLedgersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotapprovedLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
