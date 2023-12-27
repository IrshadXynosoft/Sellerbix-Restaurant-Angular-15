import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialMediaEntitiesComponent } from './add-social-media-entities.component';

describe('AddSocialMediaEntitiesComponent', () => {
  let component: AddSocialMediaEntitiesComponent;
  let fixture: ComponentFixture<AddSocialMediaEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSocialMediaEntitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSocialMediaEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
