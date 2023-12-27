import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from '../../_services/http-service.service';
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Constants } from 'src/constants';
declare const google: any;
@Component({
  selector: 'app-select-driver',
  templateUrl: './select-driver.component.html',
  styleUrls: ['./select-driver.component.scss'],
})
export class SelectDriverComponent implements OnInit {
  branch_id = this.localservice.get('branch_id');
  // filteredOptions: Observable<any[]> | undefined;
  driverRecords: any = [];
  selectedDriver: any;
  // list_autocomplete = new UntypedFormControl();
  currency_symbol = localStorage.getItem('currency_symbol');
  imageBasePath = this.constant.imageBasePath;
  map: any;
  isReassign:boolean=false
  @ViewChild('mapElement') mapElement: any;
  lat: any = 25.2854;
  lng: any = 51.5310;
  public generaldetailsForm!: UntypedFormGroup;

  constructor(
    private localservice: LocalStorage,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SelectDriverComponent>,
    public formBuilder: UntypedFormBuilder,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private constant : Constants,
    @Inject(MAT_DIALOG_DATA) public data: { driverRecords: any, order_id: any, driver_id: any,reassign:any },
  ) { }

  ngOnInit(): void {
    this.isReassign=this.data.reassign?this.data.reassign:false
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getDrivers()
  }

  initMap() {
    let defaultPosition = { lat: parseFloat(this.lat), lng: parseFloat(this.lng) };
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
      center: defaultPosition,
    });
  }

  handleLocationError() {
    this.snackBService.openSnackBar("The Geolocation service failed. Always allow to access your location.", "Close");
  }

  private _filterlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.driverRecords.filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }

  close() {
    this.dialogRef.close();
  }

  getDrivers() {
    this.httpService.get('get-available-drivers/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.driverRecords = result.data.drivers_list;
          this.mapInfowindow()
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
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
    for (let i = 0; i < this.driverRecords.length; i++) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.driverRecords[i].driver_latitude, this.driverRecords[i].driver_longitude),
        map: this.map,
        animation: google.maps.Animation.DROP,
        draggable: false,
        title: this.driverRecords[i].driver_name,
        icon: image,
      });
      const infoContent = "<h2>" + this.driverRecords[i].driver_name + '</h2>' + '<p>' + "Distance:  " + '&nbsp;&nbsp;' + this.driverRecords[i].distance_away + "km" + '</p>' + '<p>' + "Last updated: " + '&nbsp;&nbsp;' + this.driverRecords[i].last_updated_time 
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
  }
  driverSelected(id: any) {
    this.selectedDriver = id;
  }

  submit() {
    let params = {
      order_id: this.data.order_id,
      id: this.data.driver_id,
      driver_id: this.selectedDriver,
      status: 2
    }
    if (this.selectedDriver) {
      if(this.isReassign){
        this.httpService.post('mobile/order-reassigned', params)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Order Updated Successfully", "Close");
            this.dialogRef.close(result.data[0]);
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
      }
      else{
        this.httpService.post('change-driver-order-status', params)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Order Updated Successfully", "Close");
            this.dialogRef.close(result.data[0]);
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
      }
     
    }
    else {
      this.snackBService.openSnackBar("Select a driver", "Close")
    }
  }
  reload() {
    this.ngAfterViewInit()
  }
}
