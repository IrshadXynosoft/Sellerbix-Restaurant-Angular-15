import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProductsComponent } from './map-products.component';

describe('MapProductsComponent', () => {
  let component: MapProductsComponent;
  let fixture: ComponentFixture<MapProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
