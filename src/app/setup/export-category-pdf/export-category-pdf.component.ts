import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
// import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { Preloader } from 'src/app/shared/preloader/preloader.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-export-category-pdf',
  templateUrl: './export-category-pdf.component.html',
  styleUrls: ['./export-category-pdf.component.scss']
})
export class ExportCategoryPdfComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  // exportAsConfig: ExportAsConfig = {
  //   type: 'pdf', // the type you want to download
  //   elementIdOrContent: 'myTableElementId', // the id of html/table element
  //   // options: { // html-docx-js document options
  //   //   orientation: 'landscape',
  //   //   margins: {
  //   //     top: '20'
  //   //   }
  //   // }
  // }
  branchName = this.localservice.get('branchname');
  constructor(private preloader : Preloader,
    private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<ExportCategoryPdfComponent>, @Inject(MAT_DIALOG_DATA) public data: { dataSource: any , datePeriod :any}) { }

  ngOnInit(): void {   
  }

  close() {
    this.dialogRef.close();
  }

  currentTime() {
    return moment().format('LT')
  }

  currentDay() {
    return moment().format('LL')
  }

  // downloadPdf() {
  //   this.preloader.start();
  //   // download the file using old school javascript method
  //   this.exportAsService.save(this.exportAsConfig, 'Exportdata').subscribe(() => {
  //     // save started 
  //   });
  //   this.preloader.stop();
  // }
}

