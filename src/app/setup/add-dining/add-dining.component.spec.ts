import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiningComponent } from './add-dining.component';

describe('AddDiningComponent', () => {
  let component: AddDiningComponent;
  let fixture: ComponentFixture<AddDiningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
