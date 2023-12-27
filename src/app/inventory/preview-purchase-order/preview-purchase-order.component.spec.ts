import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPurchaseOrderComponent } from './preview-purchase-order.component';

describe('PreviewPurchaseOrderComponent', () => {
  let component: PreviewPurchaseOrderComponent;
  let fixture: ComponentFixture<PreviewPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
