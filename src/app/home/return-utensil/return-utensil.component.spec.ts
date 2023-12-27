import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnUtensilComponent } from './return-utensil.component';

describe('ReturnUtensilComponent', () => {
  let component: ReturnUtensilComponent;
  let fixture: ComponentFixture<ReturnUtensilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnUtensilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnUtensilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
