import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeliveryEntitiesComponent } from './edit-delivery-entities.component';

describe('EditDeliveryEntitiesComponent', () => {
  let component: EditDeliveryEntitiesComponent;
  let fixture: ComponentFixture<EditDeliveryEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeliveryEntitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeliveryEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
