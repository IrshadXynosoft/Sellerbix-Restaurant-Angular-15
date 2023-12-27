import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLoyaltyGroupComponent } from './map-loyalty-group.component';

describe('MapLoyaltyGroupComponent', () => {
  let component: MapLoyaltyGroupComponent;
  let fixture: ComponentFixture<MapLoyaltyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapLoyaltyGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapLoyaltyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
