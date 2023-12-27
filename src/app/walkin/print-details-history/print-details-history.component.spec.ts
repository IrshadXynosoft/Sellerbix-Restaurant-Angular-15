import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDetailsHistoryComponent } from './print-details-history.component';

describe('PrintDetailsHistoryComponent', () => {
  let component: PrintDetailsHistoryComponent;
  let fixture: ComponentFixture<PrintDetailsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDetailsHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintDetailsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
