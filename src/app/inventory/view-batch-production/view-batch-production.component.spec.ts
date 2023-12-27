import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBatchProductionComponent } from './view-batch-production.component';

describe('ViewBatchProductionComponent', () => {
  let component: ViewBatchProductionComponent;
  let fixture: ComponentFixture<ViewBatchProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBatchProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBatchProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
