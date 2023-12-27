import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenuRequestComponent } from './edit-menu-request.component';

describe('EditMenuRequestComponent', () => {
  let component: EditMenuRequestComponent;
  let fixture: ComponentFixture<EditMenuRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMenuRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenuRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
