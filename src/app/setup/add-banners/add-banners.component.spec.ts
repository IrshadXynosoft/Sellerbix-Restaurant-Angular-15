import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBannersComponent } from './add-banners.component';

describe('AddBannersComponent', () => {
  let component: AddBannersComponent;
  let fixture: ComponentFixture<AddBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBannersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
