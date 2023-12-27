import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-available-tables',
  templateUrl: './available-tables.component.html',
  styleUrls: ['./available-tables.component.scss']
})
export class AvailableTablesComponent implements OnInit {
  diningSectionRecords:any;
  diningTableArray:any;
  availableTableArray:any;
  branch_id = this.localservice.get('branch_id');
  constructor(private router:Router,private dataservice: DataService,private localservice: LocalStorage,private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getTableOrders()
  }

  
  getTableOrders() {
    this.httpService.get('table-orders/' + this.branch_id, false).subscribe((result) => {
      if (result.status == 200) {
        this.diningSectionRecords = result.data;
        this.diningTableArray = this.diningSectionRecords[0].branch_dining_table;
        this.diningTableArray.forEach((obj: any) => {
          if (!obj.orders) {
            this.availableTableArray = this.diningTableArray;
          }
        })
      } else {
        console.log('Error in get branch dining');
      }
    });
  }

  diningSelected(event: any) {
    let id = event.target.value;
    if (id > 0) {
      this.availableTableArray = [];
      this.diningSectionRecords.forEach((element: any) => {
        element.branch_dining_table.forEach((obj: any) => {
          if (element.dinning_section_id == id && !obj.orders) {
            this.availableTableArray = element.branch_dining_table;
          }
        })
      });
    }
  }

  moveTable(id:any){
  this.dataservice.setData('tableid', id);
  this.router.navigate(['party_orders/confirm_order']);
  }
}
