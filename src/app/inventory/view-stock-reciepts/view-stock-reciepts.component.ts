import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-view-stock-reciepts',
  templateUrl: './view-stock-reciepts.component.html',
  styleUrls: ['./view-stock-reciepts.component.scss']
})
export class ViewStockRecieptsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  receiptItem: any = [];
  batch_process_reference_no: any;
  showProcessList: any = [];
  receivingType:any;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ViewStockRecieptsComponent>,private dataservice:DataService,private route:ActivatedRoute,private httpService: HttpServiceService, private snackBService: SnackBarService,private router: Router) { 
    this.receiptItem = this.dataservice.getData('receiptItem');
    this.receivingType=this.receiptItem.receiving_type==0?'Cash Purchase':'Card Purchase';
  }

  ngOnInit(): void {
    this.getReciepetList();
  }

  getReciepetList() {
    this.receiptItem.ingredient?.forEach((element: any) => {
      let obj: any = {
        name: element.name,
        cost_per_unit: element.cost_per_unit+this.currency_symbol+'/'+element.measurement_unit_name,
        qty: element.qty+' '+element.measurement_unit_name,
        total: element.total,
      };
      this.showProcessList.push(obj);
    });
    
    this.receiptItem.sub_recipe?.forEach((element: any) => {
      let obj: any = {
        name: element.name,
        cost_per_unit: element.cost_per_unit+'/'+element.measurement_unit_name,
        qty: element.qty+' '+element.measurement_unit_name,
        total: element.total,
      };
      this.showProcessList.push(obj);
    });
    this.receiptItem.finished_good?.forEach((element: any) => {
      let obj: any = {
        name: element.name,
        cost_per_unit: element.cost_per_unit+'/'+element.measurement_unit_name,
        qty: element.qty+' '+element.measurement_unit_name,
        total: element.total,
      };
      this.showProcessList.push(obj);
    });
  }
  back() {
    
    this.dialogRef.close();
  }
}
