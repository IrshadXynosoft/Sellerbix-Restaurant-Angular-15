import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInventoryItemComponent } from './delete-inventory-item.component';

describe('DeleteInventoryItemComponent', () => {
  let component: DeleteInventoryItemComponent;
  let fixture: ComponentFixture<DeleteInventoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteInventoryItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInventoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
