import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidOrderComponent } from './void-order.component';

describe('VoidOrderComponent', () => {
  let component: VoidOrderComponent;
  let fixture: ComponentFixture<VoidOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
