import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
// import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { Preloader } from 'src/app/shared/preloader/preloader.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-export-pdf-report',
  templateUrl: './export-pdf-report.component.html',
  styleUrls: ['./export-pdf-report.component.scss']
})
export class ExportPdfReportComponent implements OnInit {
  // exportAsConfig: ExportAsConfig = {
    // type: 'pdf', // the type you want to download
    // elementIdOrContent: 'myTableElementId', // the id of html/table element
    // options: { // html-docx-js document options
    //   orientation: 'landscape',
    //   margins: {
    //     top: '20'
    //   }
    // }
  // }
  branchName = this.localservice.get('branchname');
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private preloader : Preloader,
    private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<ExportPdfReportComponent>, @Inject(MAT_DIALOG_DATA) public data: { dataSource: any , datePeriod :any ,paymentSummary : any}) { }

  ngOnInit(): void {
    console.log(this.data);
    
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
    // this.preloader.start();
    // download the file using old school javascript method
    // this.exportAsService.save(this.exportAsConfig, 'Exportdata').subscribe(() => {
      // save started 
    // });
    // this.preloader.stop();
  // }
}
