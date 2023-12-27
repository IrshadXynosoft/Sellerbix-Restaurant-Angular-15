import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfOrderingComponent } from './self-ordering.component';

describe('SelfOrderingComponent', () => {
  let component: SelfOrderingComponent;
  let fixture: ComponentFixture<SelfOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfOrderingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
