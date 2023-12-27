import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPoolKeyComponent } from './driver-pool-key.component';

describe('DriverPoolKeyComponent', () => {
  let component: DriverPoolKeyComponent;
  let fixture: ComponentFixture<DriverPoolKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverPoolKeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverPoolKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
