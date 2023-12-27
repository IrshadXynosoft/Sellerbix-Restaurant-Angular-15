import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadsComponent } from './section-heads.component';

describe('SectionHeadsComponent', () => {
  let component: SectionHeadsComponent;
  let fixture: ComponentFixture<SectionHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionHeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
