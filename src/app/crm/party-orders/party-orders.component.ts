import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { DataService } from 'src/app/_services/data.service';
import { Router } from '@angular/router';
import { AvailableTablesComponent } from '../available-tables/available-tables.component';
import moment from 'moment';

@Component({
  selector: 'app-party-orders',
  templateUrl: './party-orders.component.html',
  styleUrls: ['./party-orders.component.scss']
})
export class PartyOrdersComponent implements OnInit {
  public partyOrdersForm!:UntypedFormGroup
  public validationExpression="^[0-9]$"
  branchRecords:any=[]
  branch_id:any;
  branch_name:any;
  todayDate: Date = new Date();
  dateChoosen = new UntypedFormControl({ value: this.todayDate, disabled: false });
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      arrayData:any
    },
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PartyOrdersComponent>,
    public formBuilder: UntypedFormBuilder,
    private localService:LocalStorage,
    private dataservice:DataService,
    private router:Router,

  ) {
    this.branch_id=this.localService.get('branch_id');
    this.branch_name=this.localService.get('branchname')
  }

  ngOnInit(): void {
     this.onBuildForm();
  }
  
  onBuildForm() {
    this.partyOrdersForm = this.formBuilder.group({
      branch_id:[this.branch_id, Validators.compose([Validators.required])],
      order_type:['', Validators.compose([Validators.required])],
      event:[''],
      pax_no:['']
    });
  }

  close() {
    this.dialogRef.close();
   }

  //  branchSelected(name:any)
  //  {
  //    this.branch_name=name
  //  }

  //  getBranch()
  //  {
  //    this.httpService.get('branch',false)
  //      .subscribe(result => {
  //        if (result.status == 200) {
  //          this.branchRecords = result.data.tenant_branches;
  //        } else {
  //          console.log("Error");
  //        }
  //      });
  //  }
  
takeOrder()
  {
  if(this.dateChoosen.value){
    let partyData={
      branch_id:this.partyOrdersForm.value['branch_id'],
      order_type:this.partyOrdersForm.value['order_type'],
      date: moment(this.dateChoosen.value).format('YYYY-MM-DD'),
      event:this.partyOrdersForm.value['event'],
      branch_name:this.branch_name,
      pax_no : this.partyOrdersForm.value['pax_no']
    }
    this.data.arrayData.party_details= partyData;
    let tempdata = this.data.arrayData
    this.dataservice.setData('Crmdetails', tempdata);
    if(this.partyOrdersForm.value['order_type'] == 3){
      this.dialogRef.close("Delivery")
    }
    else {
    this.router.navigate(['party_orders/new_order'])
    this.close();
    }
  }
  else {
    this.snackBService.openSnackBar("Please choose date","Close")
  }
  }
}
