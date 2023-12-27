import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferalComponent } from './add-referal.component';

describe('AddReferalComponent', () => {
  let component: AddReferalComponent;
  let fixture: ComponentFixture<AddReferalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReferalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
