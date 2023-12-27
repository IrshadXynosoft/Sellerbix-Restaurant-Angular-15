import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryEntitiesComponent } from './delivery-entities.component';

describe('DeliveryEntitiesComponent', () => {
  let component: DeliveryEntitiesComponent;
  let fixture: ComponentFixture<DeliveryEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryEntitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
