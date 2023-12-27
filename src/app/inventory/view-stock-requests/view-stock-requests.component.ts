import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-view-stock-requests',
  templateUrl: './view-stock-requests.component.html',
  styleUrls: ['./view-stock-requests.component.scss']
})
export class ViewStockRequestsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  stockRequestArray:any=[]
  issuenumber:any;
  comments:any;
  branch:any;
  total_price:any;
  requstArray:any=[]
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ViewStockRequestsComponent>,@Inject(MAT_DIALOG_DATA) public data: { id: any },private dataservice:DataService,private route:ActivatedRoute,private httpService: HttpServiceService, private snackBService: SnackBarService,private router: Router,) { }
  ngOnInit(): void {

   this.getRequestArray();

  }
  getRequestArray(){
    this.httpService
    .get('stock-request/' + this.data.id,false)
    .subscribe((result) => {
      if (result.status == 200) {
        this.requstArray= result.data[0];
        this.issuenumber=this.requstArray.stock_request_number;
        this.comments=this.requstArray.comments;
        this.branch=this.requstArray.to_branch_name
        this.total_price=this.requstArray.total_amount
       
        this.requstArray.ingredient?.forEach((element:any) => {
          let objData={
            name:element.name,
            cost_per_unit:element.cost_per_unit+this.currency_symbol+'/'+element.measurement_unit_name,
            requested_qty:element.requested_qty+' '+element.measurement_unit_name,
            received_qty:element.received_qty?element.received_qty+' '+element.measurement_unit_name:'-',
            total:element.total
          }
          this.stockRequestArray.push(objData)
        });
        this.requstArray.finished_good?.forEach((element:any) => {
          let objData={
            name:element.name,
            cost_per_unit:element.cost_per_unit+this.currency_symbol+'/'+element.measurement_unit_name,
            requested_qty:element.requested_qty +' '+element.measurement_unit_name,
            received_qty:element.received_qty?element.received_qty +' '+element.measurement_unit_name:'-',
            total:element.total
          }
          this.stockRequestArray.push(objData)
        });
        this.requstArray.sub_recipe?.forEach((element:any) => {
          let objData={
            name:element.name,
            cost_per_unit:element.cost_per_unit+this.currency_symbol+'/'+element.measurement_unit_name,
            requested_qty:element.requested_qty +' '+element.measurement_unit_name,
            received_qty:element.received_qty?element.received_qty +' '+element.measurement_unit_name:'-',
            total:element.total
          }
          this.stockRequestArray.push(objData)
        });
      } else {
        console.log('Error in stock Request');
      }
    });
  }

  
  back() {
     this.dialogRef.close();
  }
 
}

