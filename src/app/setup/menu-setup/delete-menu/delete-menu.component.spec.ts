import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMenuComponent } from './delete-menu.component';

describe('DeleteMenuComponent', () => {
  let component: DeleteMenuComponent;
  let fixture: ComponentFixture<DeleteMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
