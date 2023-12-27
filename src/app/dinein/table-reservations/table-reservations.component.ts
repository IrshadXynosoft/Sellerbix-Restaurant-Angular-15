import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { ShowDetailsComponent } from '../show-details/show-details.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { EditTableReservationsComponent } from '../edit-table-reservations/edit-table-reservations.component';
import { AnyNsRecord } from 'dns';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-table-reservations',
  templateUrl: './table-reservations.component.html',
  styleUrls: ['./table-reservations.component.scss']
})
export class TableReservationsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  reservationRecords: any = [];
  branch_id: any;
  constructor(private dataservice: DataService, private printMqtt: PrintMqttService, private localservice: LocalStorage, private snackBService: SnackBarService, private router: Router, private httpService: HttpServiceService, public dialog: MatDialog) {
    this.branch_id = this.localservice.get('branch_id');
  }

  ngOnInit(): void {
    this.getreservationOrderdetails();
  }

  getreservationOrderdetails() {
    //   this.reservationRecords= [
    //     {
    //         "reservation_id": 1,
    //         "customer_id": 7,
    //         "branch_id": 1,
    //         "staff_id": 1,
    //         "booking_date": "2022-04-22",
    //         "booking_time": "16:42:27",
    //         "reservation_note": "kj",
    //         "branch_dining_id": 1,
    //         "branch_dining_table_id": 1,
    //         "status": 1,
    //         "no_of_pax": 6,
    //         "customer_name": "lidiya",
    //         "branch_dining_name": "Ground Floor"
    //     },
    //     {
    //         "reservation_id": 2,
    //         "customer_id": 1,
    //         "branch_id": 1,
    //         "staff_id": 1,
    //         "booking_date": "2022-04-22",
    //         "booking_time": "10:00:00",
    //         "reservation_note": "",
    //         "branch_dining_id": 1,
    //         "branch_dining_table_id": 1,
    //         "status": 1,
    //         "no_of_pax": 1,
    //         "customer_name": "Mansur",
    //         "branch_dining_name": "Ground Floor"
    //     }
    // ]
    this.httpService.get('get-reserved-order/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.reservationRecords = result.data

        } else {
          console.log("Error");
        }
      });
  }
  reload() {
    this.ngOnInit()
  }

  allTables() {
    this.router.navigate(['dinein']);
  }
  runningOrders() {
    this.router.navigate(['dinein/runningOrders']);
  }
  completedOrders() {
    this.router.navigate(['dinein/completeOrders']);
  }
  tableReservations() {
    this.router.navigate(['dinein/tableReservations']);
  }
  modifyreservation(id: any): void {
    const dialogRef = this.dialog.open(EditTableReservationsComponent, {
      width: '500px',
      data: {
        reseration_id: id
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getreservationOrderdetails();
    });
  }
  conformReservation(table_id: any, reservation: any) {
    let reservationData = {
      reservation_id: reservation.reservation_id,
      order_mode: 1,
      customer_id: reservation.customer_id,
      customer_name: reservation.customer_name,
      contact_no: reservation.contact_no
    }
    this.dataservice.setData('tableName', reservation.branch_dining_table_name)
    this.dataservice.setData('reservationdetails', reservationData);
    this.router.navigate(['home/dinein/' + table_id + '/' + 'reservation']);

  }

}
