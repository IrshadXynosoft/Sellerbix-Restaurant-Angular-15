import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyMenuComponent } from './copy-menu.component';

describe('CopyMenuComponent', () => {
  let component: CopyMenuComponent;
  let fixture: ComponentFixture<CopyMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
