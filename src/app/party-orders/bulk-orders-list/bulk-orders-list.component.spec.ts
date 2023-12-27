import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOrdersListComponent } from './bulk-orders-list.component';

describe('BulkOrdersListComponent', () => {
  let component: BulkOrdersListComponent;
  let fixture: ComponentFixture<BulkOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkOrdersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
