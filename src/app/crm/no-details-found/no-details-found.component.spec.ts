import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDetailsFoundComponent } from './no-details-found.component';

describe('NoDetailsFoundComponent', () => {
  let component: NoDetailsFoundComponent;
  let fixture: ComponentFixture<NoDetailsFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDetailsFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDetailsFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
