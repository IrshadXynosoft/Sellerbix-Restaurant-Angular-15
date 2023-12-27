import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtensilsComponent } from './utensils.component';

describe('UtensilsComponent', () => {
  let component: UtensilsComponent;
  let fixture: ComponentFixture<UtensilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtensilsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtensilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
