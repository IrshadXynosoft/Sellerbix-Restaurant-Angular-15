import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-add-surcharge',
  templateUrl: './add-surcharge.component.html',
  styleUrls: ['./add-surcharge.component.scss']
})
export class AddSurchargeComponent implements OnInit {
  branch_id = this.localservice.get('branch_id');
  currency_symbol = localStorage.getItem('currency_symbol');
  surchargeRecords:any =[];
  selectedSurcharge:any =[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: { entity_id:any },private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<AddSurchargeComponent>, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.surchargeGet();
  }

  close() {
    this.dialogRef.close();
  }
  surchargeGet() {
    this.httpService.get('scheduled-surcharge/' + this.branch_id + '/' + this.data.entity_id , false)
      .subscribe(result => {
        if (result.status == 200) {
          this.surchargeRecords = result.data;
        } else {
          console.log("Error");
        }
      });
  }

  addingSurcharge(surcharge:any){
    this.selectedSurcharge.push(surcharge);
    this.dialogRef.close(this.selectedSurcharge)
  }

}
