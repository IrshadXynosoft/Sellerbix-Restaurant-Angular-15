import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTaxComponent } from './change-tax.component';

describe('ChangeTaxComponent', () => {
  let component: ChangeTaxComponent;
  let fixture: ComponentFixture<ChangeTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeTaxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
