import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DineinComponent } from './dinein.component';

describe('DineinComponent', () => {
  let component: DineinComponent;
  let fixture: ComponentFixture<DineinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DineinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DineinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
