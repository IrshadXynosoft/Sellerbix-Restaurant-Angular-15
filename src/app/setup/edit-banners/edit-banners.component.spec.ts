import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBannersComponent } from './edit-banners.component';

describe('EditBannersComponent', () => {
  let component: EditBannersComponent;
  let fixture: ComponentFixture<EditBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBannersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
