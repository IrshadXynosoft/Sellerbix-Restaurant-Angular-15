import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormGroup, Validators  } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-pickup',
  templateUrl: './store-pickup.component.html',
  styleUrls: ['./store-pickup.component.scss']
})
export class StorePickupComponent implements OnInit {
  branchRecords:any=[];
  locationdetails:any ={};
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<StorePickupComponent>,private formBuilder:UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,private router: Router,@Inject(MAT_DIALOG_DATA) public data: {contact_no: string}) { }

  ngOnInit(): void {
    this.getBranch();
  }
  getBranch()
  {
    this.httpService.get('branch',false)
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error");
        }
      });
  }
  saveWithLocation(location_id:any,name:any)
  {
   this.locationdetails = {
    branch_id:location_id,
    branch_name:name
   }
   this.dialogRef.close(this.locationdetails)
  }
  close() {
    this.dialogRef.close();
   }
}
