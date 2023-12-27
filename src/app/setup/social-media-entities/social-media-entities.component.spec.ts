import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaEntitiesComponent } from './social-media-entities.component';

describe('SocialMediaEntitiesComponent', () => {
  let component: SocialMediaEntitiesComponent;
  let fixture: ComponentFixture<SocialMediaEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaEntitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
