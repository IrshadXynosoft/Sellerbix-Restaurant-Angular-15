import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotApprovedReceiptComponent } from './not-approved-receipt.component';

describe('NotApprovedReceiptComponent', () => {
  let component: NotApprovedReceiptComponent;
  let fixture: ComponentFixture<NotApprovedReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotApprovedReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotApprovedReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
