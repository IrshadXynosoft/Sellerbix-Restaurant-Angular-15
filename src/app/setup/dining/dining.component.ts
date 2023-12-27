import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddDiningComponent } from '../add-dining/add-dining.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-dining',
  templateUrl: './dining.component.html',
  styleUrls: ['./dining.component.scss']
})
export class DiningComponent implements OnInit {
  diningArray: any = [];
  //fieldArray: Array<any> =[];
  fieldArray: Array<{ name: any }> = [];
  newAttribute: any = {};
  tablesArray: any = [];
  branch_id:any
  id=this.route.snapshot.params.id;
  constructor(private router: Router, public dialog: MatDialog,private localService:LocalStorage,  private route:ActivatedRoute,private httpService: HttpServiceService, private snackBService: SnackBarService) {
    this.branch_id=this.localService.get('branch_id')
   }

  
  ngOnInit(): void {
    this.getDining();

  }
  back() {
   
    
    this.router.navigate(['setup/'+this.id+'/editLocation'])
  }

  addDining(): void {
    const dialogRef = this.dialog.open(AddDiningComponent, {
      width: '500px',data:{branch_id:this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDining();
    });
  }
  
  editDining(tab:any) {    
    const dialogRef = this.dialog.open(AddDiningComponent, {
      data:{
        operation: 'edit',
        table :{
          id: tab.id,
          name : tab.name,
          sequence_no : tab.sequence_no
        },
        branch_id:this.id
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDining();
    });
  }

  getDining() {
    this.httpService.get('branch-dining-by-location/'+this.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.diningArray = result.data.branch_dinings;

        } else {
          console.log("Error in get branch dining");
        }
      });
  }
  addFieldValue(id: any) {
    let temp = this.diningArray[id].branch_dining_table.length
    this.diningArray[id].branch_dining_table.push({ table_name: temp + 1 });
  }

  deleteFieldValue(id: any, index: any) {
    this.diningArray[id].branch_dining_table.splice(index, 1);
  }
  saveTable(index: any, id: any) {
    let temp = this.diningArray[index].branch_dining_table.length
    if(temp > 0){
      
      for (let i = 0; i < temp; i++) {
        this.tablesArray.push(this.diningArray[index].branch_dining_table[i].table_name)
      }
    }

    let post = {
      'branch_dining_id': id,
      'tables': this.tablesArray,
      'branch_id':this.id
    }

    this.httpService.post('dining-table', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.tablesArray=[];
          this.snackBService.openSnackBar("Tables added Successfully", "Close");
          this.getDining();
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
}
