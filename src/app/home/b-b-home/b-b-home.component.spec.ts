import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BBHomeComponent } from './b-b-home.component';

describe('BBHomeComponent', () => {
  let component: BBHomeComponent;
  let fixture: ComponentFixture<BBHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BBHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BBHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
