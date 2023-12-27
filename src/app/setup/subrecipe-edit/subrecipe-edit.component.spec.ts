import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrecipeEditComponent } from './subrecipe-edit.component';

describe('SubrecipeEditComponent', () => {
  let component: SubrecipeEditComponent;
  let fixture: ComponentFixture<SubrecipeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubrecipeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubrecipeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
