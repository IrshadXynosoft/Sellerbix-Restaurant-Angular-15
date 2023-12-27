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
import { ShowReservationsComponent } from '../show-reservations/show-reservations.component';
import moment from 'moment';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.scss']
})
export class TableReservationComponent implements OnInit {
  public tableReservationForm!: UntypedFormGroup
  public validationExpression = "^[0-9]*$"
  branchRecords: any = []
  branch_id: any;
  floorRecords: any = [];
  tableRecords: any = [];
  reservationList: any = [];
  todayDate: Date = new Date();
  dateChoosen = new UntypedFormControl({ value: this.todayDate, disabled: false });
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      customer_id: any;
      customer_contact_no: any;
      customer_name: any
    },
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TableReservationComponent>,
    public formBuilder: UntypedFormBuilder,
    private localService: LocalStorage
  ) {
    this.branch_id = this.localService.get('branch_id')
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getBranch();
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
      notes: [''],
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
        branch_id: this.tableReservationForm.value['branch_id'],
        date: moment(this.dateChoosen.value).format('YYYY-MM-DD'),
        time: this.tableReservationForm.value['time'],
        table_id: this.tableReservationForm.value['table_id'],
        paxNumber: this.tableReservationForm.value['paxNumber'],
        status: '',
        notification_note: this.tableReservationForm.value['notes'],
        floor_id: this.tableReservationForm.value['floor_id'],
        notification_time: '',
        customer_name: this.data.customer_name,
        customer_contact_no: this.data.customer_contact_no,
        customer_id : this.data.customer_id
      }
    if (this.tableReservationForm.valid) {
      this.httpService.post('reservation', reservationParams)
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

