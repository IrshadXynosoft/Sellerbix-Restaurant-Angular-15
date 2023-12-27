import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOrderDetailsComponent } from './bulk-order-details.component';

describe('BulkOrderDetailsComponent', () => {
  let component: BulkOrderDetailsComponent;
  let fixture: ComponentFixture<BulkOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
