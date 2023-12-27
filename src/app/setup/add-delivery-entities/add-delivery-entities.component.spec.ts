import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryEntitiesComponent } from './add-delivery-entities.component';

describe('AddDeliveryEntitiesComponent', () => {
  let component: AddDeliveryEntitiesComponent;
  let fixture: ComponentFixture<AddDeliveryEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeliveryEntitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeliveryEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
