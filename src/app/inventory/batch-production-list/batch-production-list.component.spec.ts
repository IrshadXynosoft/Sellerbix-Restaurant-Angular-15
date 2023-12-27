import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchProductionListComponent } from './batch-production-list.component';

describe('BatchProductionListComponent', () => {
  let component: BatchProductionListComponent;
  let fixture: ComponentFixture<BatchProductionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchProductionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchProductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
