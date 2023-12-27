import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { Constants } from 'src/constants';
import { map, startWith } from 'rxjs/operators';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { PrintDetailsHistoryComponent } from '../print-details-history/print-details-history.component';
declare const google: any;

@Component({
  selector: 'app-detailed-order-view',
  templateUrl: './detailed-order-view.component.html',
  styleUrls: ['./detailed-order-view.component.scss']
})
export class DetailedOrderViewComponent implements OnInit {
  public id: string = this.route.snapshot.params.order_id;
  orderDetails: any = [];
  driverRecords: any;
  currency_symbol = localStorage.getItem('currency_symbol');
  imageBasePath = this.constant.imageBasePath;
  map!: any;
  isReassign: boolean = false
  @ViewChild('mapElement') mapElement: any;
  lat: any = 25.2854;
  lng: any = 51.5310;
  constructor(private dialog :MatDialog, private httpService: HttpServiceService, private route: ActivatedRoute, private constant: Constants, private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.getDetails();
  }

  ngAfterViewInit(): void {
  }

  initMap() {
    let defaultPosition = { lat: parseFloat(this.lat), lng: parseFloat(this.lng) };
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
      center: defaultPosition,
    });
  }

  mapInfowindow() {
    const image = {
      url: `assets/images/delivery.png`,
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(31, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    };
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.driverRecords.driver_latitude, this.driverRecords.driver_longitude),
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
      title: this.driverRecords.driver_name,
      icon: image,
    });
    const infoContent = "<h2>" + this.driverRecords.driver_name + '</h2>' + '<p>' + "Distance:  " + '&nbsp;&nbsp;' + this.driverRecords.distance_away + "km" + '</p>' + '<p>' + "Last updated: " + '&nbsp;&nbsp;' + this.driverRecords.last_updated_time
    const infowindow = new google.maps.InfoWindow({
      content: infoContent,
      maxWidth: 200,
    });
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }

  getDetails() {
    this.httpService.get('order-detailed-data/' + this.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.orderDetails = result.data[0];
          this.driverRecords = this.orderDetails.driver_order?.driver
          if (this.driverRecords) {
            console.log("jh" ,this.driverRecords);
            
            this.initMap();
            this.mapInfowindow()
          }
        }
      });
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  dayCheck(day: any) {
    let newDate = moment(day).format("DD-MM-YYYY");
    return newDate;
  }


  modifiercheck(modifierList: any) {
    let flag = false;
    for (let list of modifierList) {
      if (list.status) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }

  handleLocationError() {
    this.snackBService.openSnackBar("The Geolocation service failed. Always allow to access your location.", "Close");
  }

  printDetails(data:any) {
    const dialogRef = this.dialog.open(PrintDetailsHistoryComponent, {
      width: '600px',
      data: {
        print: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }
}
