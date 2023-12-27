import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-view-batch-production',
  templateUrl: './view-batch-production.component.html',
  styleUrls: ['./view-batch-production.component.scss'],
})
export class ViewBatchProductionComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  batchProcessedlist: any = [];
  batch_process_reference_no: any;
  showProcessList: any = [];
  total_price:any;
  constructor(private router: Router, private dataservice: DataService) {
    this.batchProcessedlist = this.dataservice.getData('batchProcessedItem');
   }

  ngOnInit(): void {
    this.getBatchProcessList();
  }
  back() {
    this.router.navigate(['inventory/batchProduction']);
  }
  getBatchProcessList() {
    this.total_price = 0;
    this.batchProcessedlist.recipe?.forEach((element: any) => {
      let obj: any = {
        name: element.name,
        cost_per_unit: element.cost_price,
        qty: element.qty,
        stock_on_hand:element.stock_on_hand,
        total: element.total,
      };
      this.showProcessList.push(obj);
     this.total_price = (parseFloat(this.total_price) + parseFloat(element.total)).toFixed(2)
      
    });
    this.batchProcessedlist.sub_recipe?.forEach((element: any) => {
      let obj: any = {
        name: element.name,
        cost_per_unit: element.cost_per_unit+'/'+element.measurement_unit_name,
        qty: element.qty+' '+element.measurement_unit_name,
        stock_on_hand:element.stock_on_hand+' '+element.measurement_unit_name, 
        total: element.total,
      };
      this.total_price = (parseFloat(this.total_price) + parseFloat(element.total)).toFixed(2)
      this.showProcessList.push(obj);
    });
  }
}
