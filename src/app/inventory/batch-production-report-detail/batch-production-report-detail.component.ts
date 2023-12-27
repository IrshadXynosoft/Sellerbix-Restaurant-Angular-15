import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';


@Component({
  selector: 'app-batch-production-report-detail',
  templateUrl: './batch-production-report-detail.component.html',
  styleUrls: ['./batch-production-report-detail.component.scss']
})
export class BatchProductionReportDetailComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  showProcessList: any = [];
  total_price: any;
  constructor(
    public dialog: MatDialog,
    public httpService: HttpServiceService,
    public dialogRef: MatDialogRef<BatchProductionReportDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: any },
  ) { }

  ngOnInit(): void {
    this.getBatchProcessList();

  }

  close() {
    this.dialogRef.close();
  }

  getBatchProcessList() {
    this.total_price = 0;
    this.httpService.get('batch-process/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.showProcessList = result.data[0];

        
          this.showProcessList.recipe?.forEach((element: any) => {
            this.total_price = (parseFloat(this.total_price) + parseFloat(element.total)).toFixed(2)
          });
          this.showProcessList.sub_recipe?.forEach((element: any) => {
            this.total_price = (parseFloat(this.total_price) + parseFloat(element.total)).toFixed(2)
          });
        } else {
          console.log("Error in batch-process");
        }
      });




  }
}

