import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalItemPreferenceComponent } from './global-item-preference.component';

describe('GlobalItemPreferenceComponent', () => {
  let component: GlobalItemPreferenceComponent;
  let fixture: ComponentFixture<GlobalItemPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalItemPreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalItemPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
