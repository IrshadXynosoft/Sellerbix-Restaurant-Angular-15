import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPricePlanComponent } from './item-price-plan.component';

describe('ItemPricePlanComponent', () => {
  let component: ItemPricePlanComponent;
  let fixture: ComponentFixture<ItemPricePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPricePlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemPricePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
