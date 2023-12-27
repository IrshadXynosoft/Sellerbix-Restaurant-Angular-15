import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-change-tax',
  templateUrl: './change-tax.component.html',
  styleUrls: ['./change-tax.component.scss']
})
export class ChangeTaxComponent implements OnInit {
  branch_id = this.localservice.get('branch_id');
  currency_symbol = localStorage.getItem('currency_symbol');
  inclusive:any=[];
  exclusive:any=[];
  allTax:any=[]
  constructor( private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<ChangeTaxComponent>, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getTax()
  }

  getTax() {
    this.httpService.get('tax', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.allTax = result.data;
          this.allTax.forEach((obj:any) => {
            if(obj.type ==0) {
               this.exclusive.push(obj)
            }
            else{
              this.inclusive.push(obj)
            }
          });
        } else {
          console.log("Error");
        }
      });
  }
  close() {
    this.dialogRef.close();
  }

  changeTax(tax:any) {
    this.allTax.forEach((obj:any) => {
      if(obj.id == tax.id){
        obj.is_default =1;
      }
      else {
        obj.is_default =0;
      }
    });
    this.dialogRef.close(this.allTax)
  }
}
