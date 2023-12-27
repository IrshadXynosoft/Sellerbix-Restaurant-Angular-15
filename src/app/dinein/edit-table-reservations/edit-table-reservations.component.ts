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
import { ShowReservationsComponent } from 'src/app/crm/show-reservations/show-reservations.component';
import moment from 'moment';
@Component({
  selector: 'app-edit-table-reservations',
  templateUrl: './edit-table-reservations.component.html',
  styleUrls: ['./edit-table-reservations.component.scss']
})
export class EditTableReservationsComponent implements OnInit {
  public tableReservationForm!: UntypedFormGroup
  public validationExpression = "^[0-9]*$"
  branchRecords: any = []
  branch_id: any;
  floorRecords: any = [];
  tableRecords: any = [];
  reservationList: any = [];
  todayDate: Date = new Date();
  reservationData:any=[]
  dateChoosen = new UntypedFormControl({ value: this.todayDate, disabled: false });
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      customer_id: any;
      customer_contact_no: any;
      customer_name: any,
      reseration_id: any;
    },
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditTableReservationsComponent>,
    public formBuilder: UntypedFormBuilder,
    private localService: LocalStorage
  ) {
    this.branch_id = this.localService.get('branch_id')
  }

  ngOnInit(): void {
     this.onBuildForm();
     this.getReservation();
     this.getBranch();
     
    
  }
  getDining() {
    this.httpService.get('branch-dining-by-location/'+ this.reservationData[0].branch_id,false)
      .subscribe(result => {
        if (result.status == 200) {
          this.floorRecords = result.data.branch_dinings;
          this.floorRecords.forEach((element:any) => {
            if(element.id==this.reservationData[0].branch_dining_id){
              element.branch_dining_table.forEach((element:any) => {
                this.tableRecords.push(element)
              });
            }
          
          });
          
          this.patchValues();
        } else {
          console.log("Error in get branch dining");
        }
      });
  }
 
  getReservation()
  {
    this.httpService.get('reservation/'+this.data.reseration_id,false)
       .subscribe(result => {
         if (result.status == 200) {
          this.reservationData=result.data
          this.getDining();
         
         } else {
           console.log("Error");
         }
       });
  }
 
  patchValues()
  {
    this.tableReservationForm.patchValue({
    branch_id:this.reservationData[0].branch_id,
    table_id:this.reservationData[0].branch_dining_table_id,
    paxNumber:this.reservationData[0].no_of_pax,
    //date:this.reservationData[0].booking_date,
    time: this.reservationData[0].booking_time,
    notes:this.reservationData[0].reservation_note,
    floor_id:this.reservationData[0].branch_dining_id
    })
    this.dateChoosen.setValue(this.reservationData[0].booking_date)
  }
  getAvailableTables(){
    if (this.tableReservationForm.value['branch_id'] && this.dateChoosen.value && this.tableReservationForm.value['time']) {
      let postData = {
        branch_id: this.tableReservationForm.value['branch_id'],
        booking_date: moment(this.dateChoosen.value).format('YYYY-MM-DD'),
        booking_time: this.tableReservationForm.value['time'],
      }
      this.httpService.post('get-available-tables', postData)
        .subscribe(result => {
          if (result.status == 200) {
            this.tableRecords=[]
            this.tableReservationForm.controls['floor_id'].enable();
            this.floorRecords = result.data;
            this.showResrvationData();
          } else {
            this.snackBService.openSnackBar(result.message,"Close")
          }
        });
    }
    else {
      this.tableReservationForm.value['floor_id'] = '';
      this.tableReservationForm.value['table_id'] = '';
      this.tableReservationForm.controls['floor_id'].disable();
      this.tableReservationForm.controls['table_id'].disable();
    }
  }

  DatetimeSelected() {
    if (this.dateChoosen.value && this.tableReservationForm.value['time']) {
      this.tableReservationForm.controls['branch_id'].enable();
      this.getAvailableTables()
    }
    else {
      this.tableReservationForm.controls['branch_id'].disable();
    }
  }

  onBuildForm() {
    this.tableReservationForm = this.formBuilder.group({
      branch_id: [{value: '', disabled: true}, Validators.compose([Validators.required])],
      table_id: [{value: '', disabled: true}, Validators.compose([Validators.required])],
      paxNumber: ['', Validators.compose([Validators.required, Validators.pattern(this.validationExpression), Validators.maxLength(3)])],
       time: ['', Validators.compose([Validators.required])],
      notes: ['', Validators.compose([Validators.required])],
      floor_id: [{value: '', disabled: true}, Validators.compose([Validators.required])]
    });
  }
 
  close() {
    this.dialogRef.close();
  }

  getBranch() {
    this.httpService.get('branch', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error");
        }
      });
  }

  showResrvationData() {
    this.reservationList = []
    this.floorRecords.forEach((element: any) => {
      if (element.reservation.length > 0) {
        element.reservation.forEach((obj: any) => {
          let objData = {
            floor_id: element.id,
            Floor_name: element.name,
            booking_time: obj.booking_time,
            booking_date: obj.booking_date,
            pax_number: obj.no_of_pax,
            table_id: obj.branch_dining_table_id,
            table_name: this.findTableName(element.id, obj.branch_dining_table_id)
          }
          this.reservationList.push(objData)
        });
        const dialogRef = this.dialog.open(ShowReservationsComponent, {
          width: '500px',
          data: { 'reservationList': this.reservationList }
        });
        dialogRef.afterClosed().subscribe(result => {

        });
      }
    });

  }
  findTableName(floorId: any, tableId: any) {
    let tableName: any;
    this.floorRecords.forEach((element: any) => {
      if (element.id == floorId) {
        element.branch_dining_table.forEach((obj: any) => {
          if (obj.id == tableId) {
            tableName = obj.table_name
          }
        });
      }
    });
    return tableName;
  }
  floorSelected(event: any) {
    let floor = event.target.value
    this.tableRecords = [];
    this.floorRecords.forEach((obj: any) => {
      if (obj.id == floor) {
        if (this.tableReservationForm.controls['floor_id']) {
          this.tableReservationForm.controls['table_id'].enable();
          obj.branch_dining_table.forEach((element: any) => {
            this.tableRecords.push(element)
          });
        }
        else {
          this.tableReservationForm.value['table_id'] = '';
          this.tableReservationForm.controls['table_id'].disable();
        }
      }
    });
    if (this.tableRecords.length == 0) {
      this.snackBService.openSnackBar("No tables For Selected Floor,please add Tables", "Close");
    }
  }
  addReservation() {
    let reservationParams: any;
      reservationParams = {
        branch_id: this.tableReservationForm.value['branch_id']?this.tableReservationForm.value['branch_id']:this.reservationData[0].branch_id,
       customer_id: this.reservationData[0].customer_id,
        date:moment(this.dateChoosen.value).format('YYYY-MM-DD'),
        time:this.tableReservationForm.value['time']?this.tableReservationForm.value['time']:this.reservationData[0].booking_time,
        table_id:this.tableReservationForm.value['table_id']?this.tableReservationForm.value['table_id']:this.reservationData[0].branch_dining_table_id,
        paxNumber:this.tableReservationForm.value['paxNumber'],
        status:'',
        notification_note:this.tableReservationForm.value['notes'],
        floor_id:this.tableReservationForm.value['floor_id']?this.tableReservationForm.value['floor_id']:this.reservationData[0].branch_dining_id,
        notification_time:''
      }
    if (this.tableReservationForm.valid) {
      this.httpService.put('reservation/'+this.data.reseration_id, reservationParams)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Reservation Booked Successfully!!", "Close");
            this.close();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.snackBService.openSnackBar("Please enter all required fields", "Close");
      if (this.tableReservationForm.value['paxNumber'].length >3) {
        this.snackBService.openSnackBar("Pax Number should be maximum 3 digits", "Close")
      }
    }
  }

}

