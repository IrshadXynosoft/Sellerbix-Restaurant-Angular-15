import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPerformanceGraphComponent } from './supplier-performance-graph.component';

describe('SupplierPerformanceGraphComponent', () => {
  let component: SupplierPerformanceGraphComponent;
  let fixture: ComponentFixture<SupplierPerformanceGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPerformanceGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPerformanceGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
