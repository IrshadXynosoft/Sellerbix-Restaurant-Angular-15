import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCategoryPdfComponent } from './export-category-pdf.component';

describe('ExportCategoryPdfComponent', () => {
  let component: ExportCategoryPdfComponent;
  let fixture: ComponentFixture<ExportCategoryPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportCategoryPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportCategoryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
