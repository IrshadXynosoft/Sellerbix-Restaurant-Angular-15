import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateLanguageComponent } from './alternate-language.component';

describe('AlternateLanguageComponent', () => {
  let component: AlternateLanguageComponent;
  let fixture: ComponentFixture<AlternateLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternateLanguageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
