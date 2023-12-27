import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeliveryAreaComponent } from './edit-delivery-area.component';

describe('EditDeliveryAreaComponent', () => {
  let component: EditDeliveryAreaComponent;
  let fixture: ComponentFixture<EditDeliveryAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeliveryAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeliveryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
