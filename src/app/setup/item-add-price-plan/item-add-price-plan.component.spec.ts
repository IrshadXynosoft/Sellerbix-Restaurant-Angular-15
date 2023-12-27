import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAddPricePlanComponent } from './item-add-price-plan.component';

describe('ItemAddPricePlanComponent', () => {
  let component: ItemAddPricePlanComponent;
  let fixture: ComponentFixture<ItemAddPricePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemAddPricePlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAddPricePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
