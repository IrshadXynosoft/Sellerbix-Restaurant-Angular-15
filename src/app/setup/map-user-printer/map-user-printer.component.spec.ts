import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapUserPrinterComponent } from './map-user-printer.component';

describe('MapUserPrinterComponent', () => {
  let component: MapUserPrinterComponent;
  let fixture: ComponentFixture<MapUserPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapUserPrinterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapUserPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
