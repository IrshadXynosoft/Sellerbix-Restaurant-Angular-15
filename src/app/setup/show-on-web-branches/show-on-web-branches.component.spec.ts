import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOnWebBranchesComponent } from './show-on-web-branches.component';

describe('ShowOnWebBranchesComponent', () => {
  let component: ShowOnWebBranchesComponent;
  let fixture: ComponentFixture<ShowOnWebBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOnWebBranchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowOnWebBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
