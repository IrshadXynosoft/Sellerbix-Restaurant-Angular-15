import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedItemComponent } from './grouped-item.component';

describe('GroupedItemComponent', () => {
  let component: GroupedItemComponent;
  let fixture: ComponentFixture<GroupedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
