import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-utensils',
  templateUrl: './utensils.component.html',
  styleUrls: ['./utensils.component.scss']
})
export class UtensilsComponent implements OnInit {
  constructor(private localservice: LocalStorage,private httpService: HttpServiceService,public dialog: MatDialog, public dialogRef: MatDialogRef<UtensilsComponent>) { }
  utensilArray: any = [];
  branch_id = this.localservice.get('branch_id');
  currency_symbol = localStorage.getItem('currency_symbol');
  ngOnInit(): void {
    this.getUtensils()
  }
  close() {
    this.dialogRef.close();
  }
  toPrice(params:any) {
    return params.toFixed(2);
  }
 
  getUtensils(){
    this.httpService.get('all-utensil/' + this.branch_id,false)
    .subscribe(result => {
      if (result.status == 200) {
        this.utensilArray = result.data ? result.data : []
      } else {
        console.log("Error");
      }
    });
  }

  utensilSelect(utensil: any,index:any) {
      let item = {
        item_id: utensil.id,
        item_name: utensil.name,
        item_sec_name: null,
        price: utensil.selling_price,
        qty:'1',
        description:null,
        is_utensil: true
      }
    this.dialogRef.close(item);
  }
}