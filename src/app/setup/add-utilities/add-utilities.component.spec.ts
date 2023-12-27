import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUtilitiesComponent } from './add-utilities.component';

describe('AddUtilitiesComponent', () => {
  let component: AddUtilitiesComponent;
  let fixture: ComponentFixture<AddUtilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUtilitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
