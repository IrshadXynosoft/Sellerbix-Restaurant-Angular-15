import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWaiterComponent } from './select-waiter.component';

describe('SelectWaiterComponent', () => {
  let component: SelectWaiterComponent;
  let fixture: ComponentFixture<SelectWaiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectWaiterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
