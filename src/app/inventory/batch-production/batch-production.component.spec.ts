import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchProductionComponent } from './batch-production.component';

describe('BatchProductionComponent', () => {
  let component: BatchProductionComponent;
  let fixture: ComponentFixture<BatchProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
