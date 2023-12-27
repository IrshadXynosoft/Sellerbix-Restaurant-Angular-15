import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-wastage-report-detail',
  templateUrl: './wastage-report-detail.component.html',
  styleUrls: ['./wastage-report-detail.component.scss']
})
export class WastageReportDetailComponent implements OnInit {

  currency_symbol = localStorage.getItem('currency_symbol');
  stockIssueArray:any=[]
  issuenumber:any;
  comments:any;
  branch:any;
  total_price:any=0;
  constructor(public dialog: MatDialog, 
    public dialogRef: MatDialogRef<WastageReportDetailComponent>,
    private dataservice:DataService,
    private httpService: HttpServiceService, 
    @Inject(MAT_DIALOG_DATA) public data: { id: any },
    private snackBService: SnackBarService) { }

  ngOnInit(): void {
   this.getstockIssueDetails();
  }
  getstockIssueDetails()
  {
    this.httpService.get('stock-issue/' + this.data.id,false)
    .subscribe(result => {
      if (result.status == 200) 
        {
          let issueArray=result.data[0];
        this.issuenumber=issueArray.stock_issuing_number;
        this.comments=issueArray.comments;
        this.branch=issueArray.branch_name
        this.total_price=issueArray.total_amount?.toFixed(2)
        issueArray.recipe?.forEach((element:any) => {
          let objData={
            name:element.name,
            cost_per_unit:element.cost_price+this.currency_symbol+'/'+element.measurement_unit_name,
           issued_Quantity:element.qty+' '+element.measurement_unit_name,
            total:element.total
          }
          this.stockIssueArray.push(objData)
        });
        issueArray.sub_recipe?.forEach((element:any) => {
          let objData={
            name:element.name,
            cost_per_unit:element.cost_per_unit+this.currency_symbol+'/'+element.measurement_unit_name,
            issued_Quantity:element.qty+' '+element.measurement_unit_name,
            total:element.total
          }
          this.stockIssueArray.push(objData)
        });
        issueArray.ingredient?.forEach((element:any) => {
          let objData={
            name:element.name,
            cost_per_unit:element.cost_per_unit+this.currency_symbol+'/'+element.measurement_unit_name,
            issued_Quantity:element.qty+' '+element.measurement_unit_name,
            total:element.total
          }
          this.stockIssueArray.push(objData)
        });
        issueArray.finished_good?.forEach((element:any) => {
          let objData={
            name:element.name,
            cost_per_unit:element.measurement_unit_name?element.cost_per_unit+this.currency_symbol+'/'+element.measurement_unit_name:element.cost_per_unit+this.currency_symbol,
            issued_Quantity:element.qty+' '+element.measurement_unit_name,
            total:element.total
          }
          this.stockIssueArray.push(objData)
        });
      } else {
        console.log("Error in issue details");
      }
    });
 
  }
  
  back() {
    
      this.dialogRef.close();
    }
  
 
}

