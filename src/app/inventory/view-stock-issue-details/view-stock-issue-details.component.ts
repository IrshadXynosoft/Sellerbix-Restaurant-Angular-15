import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-view-stock-issue-details',
  templateUrl: './view-stock-issue-details.component.html',
  styleUrls: ['./view-stock-issue-details.component.scss']
})
export class ViewStockIssueDetailsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  stockIssueArray:any=[]
  issuenumber:any;
  comments:any;
  branch:any;
  total_price:any;
  constructor(private dataservice:DataService,private route:ActivatedRoute,private httpService: HttpServiceService, private snackBService: SnackBarService,private router: Router,) { }

  ngOnInit(): void {
   this.getstockIssueDetails();
  }
  getstockIssueDetails()
  {
    let issueArray=this.dataservice.getData('stockIssueItem')
     this.issuenumber=issueArray.stock_issuing_number;
    this.comments=issueArray.comments;
    this.branch=issueArray.branch_name
    this.total_price=issueArray.total_amount.toFixed(2)
    issueArray.recipe?.forEach((element:any) => {
      let objData={
        name:element.name,
        cost_per_unit:element.cost_price+this.currency_symbol,
       issued_Quantity:element.qty,
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
  }
  
  back() {
     this.router.navigate(['inventory/stockIssues'])
  }
 
}

