import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
declare const google: any;

@Component({
  selector: 'app-add-delivery-area',
  templateUrl: './add-delivery-area.component.html',
  styleUrls: ['./add-delivery-area.component.scss']
})
export class AddDeliveryAreaComponent implements OnInit {
  public deliveryareaForm!: UntypedFormGroup;
  map: any;
  @ViewChild('mapElement') mapElement: any;
  @ViewChild('search') input: ElementRef<HTMLInputElement> | undefined;
  
  drawingManager: any;
  latitude: any;
  longitude: any;
  branch_id: any;
  selectedShape: any;
  existingPolygon: any;
  coordinates: any = [];
  isAreaSelected: boolean = true;
  defaultcoordinates: any = {};
  ErrorArray: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  suggestions: any = [];

  constructor(private zone: NgZone, public dialog: MatDialog, public dialogRef: MatDialogRef<AddDeliveryAreaComponent>, public formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private httpService: HttpServiceService, private localService: LocalStorage, @Inject(MAT_DIALOG_DATA) public data: { branch_id: string }) {
    //this.branch_id=this.localService.get('branch_id')
    //this.defaultcoordinates=this.localService.get('coordinates')
    this.defaultcoordinates = { lat: 25.2854, lng: 51.5310 }


  }

  ngOnInit(): void {
    this.onBuildForm();

  }
  ngAfterViewInit(): void {
    this.initMap();
    
  }
  onSearchAddress(event: any = {}) {
    let defaultPosition = this.defaultcoordinates;
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
      center: defaultPosition,
    });
    const query = event.target.value;
       console.log(query);
       
    if (query && query.length >= 2) {
      const config = {
        input: query,
      };
      google.maps.places.AutocompleteService.getPlacePredictions(config, (predictions: any) => {
        this.zone.run(() => {
          if (predictions) this.suggestions = predictions;
        });
      });
       console.log(this.suggestions);
      
    }
    if (query.length == 0) {
      this.suggestions = [];
    }
  }
  initMap() {
    let defaultPosition = this.defaultcoordinates;
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
      center: defaultPosition,
    });
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    };
  
   // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    console.log(autocomplete);
    
    autocomplete.bindTo("bounds", this.map);
   
    autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
     if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
  
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
  
        place.formatted_address;
   
    });
  
    let polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true,
      draggable: true,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      fillColor: "#FF0000",
    };

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYLINE,
        ],
      },
      markerOptions: {
        draggable: true
      },
      polylineOptions: {
        editable: true,
        draggable: true,
        fillColor: "#ffff00"
      },
      rectangleOptions: polyOptions,
      circleOptions: polyOptions,
      polygonOptions: polyOptions,
      map: this.map
    });

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (e: any) => {
      if (e.type !== google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        this.drawingManager.setDrawingMode(null);
        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        let newShape = e.overlay;
        console.log(newShape);
        newShape.type = e.type;
        google.maps.event.addListener(newShape, 'click', (e: any) => {
          if (e.vertex !== undefined) {
            if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
              var path = newShape.getPaths().getAt(e.path);
              path.removeAt(e.vertex);
              if (path.length < 3) {
                newShape.setMap(null);
              }
            }
            if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
              var path = newShape.getPath();
              path.removeAt(e.vertex);
              if (path.length < 2) {
                newShape.setMap(null);
              }
            }
          }
          console.log(newShape);
          this.setSelection(newShape);
        });

        // google.maps.event.addListener(newShape, 'set_at', () => {
        //   console.log("set_at");
        //   console.log(newShape);
        // });

        google.maps.event.addListener(newShape, 'insert_at', (e: any) => {
          console.log("insert_at");
          console.log(e);
        });

        /*google.maps.event.addListener(newShape, 'insert_at', (e:any) => {
          console.log("set_at");
          if (e.vertex !== undefined) {
            if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
                var path = newShape.getPaths().getAt(e.path);
                path.removeAt(e.vertex);
                if (path.length < 3) {
                    newShape.setMap(null);
                }
            }
            if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
                var path = newShape.getPath();
                path.removeAt(e.vertex);
                if (path.length < 2) {
                    newShape.setMap(null);
                }
            }
          }else{
            console.log('vertex undefined');
          }
          this.setSelection(newShape);
        });*/

        this.setSelection(newShape);
      }
    });

    google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', () => {
      if (this.selectedShape) {
        this.selectedShape.setMap(null);
      }
    });

    let points = [
      { lat: 1.3151565849851743, lng: 103.72209867258303 },
      { lat: 1.3203050643680954, lng: 103.72347196359866 },
      { lat: 1.3203050643680954, lng: 103.72724851389162 },
      { lat: 1.3166153218904728, lng: 103.73231252451174 },
      { lat: 1.3136978472272454, lng: 103.73154004831545 },
      { lat: 1.310265519733015, lng: 103.72458776254885 },
      { lat: 1.3151565849851743, lng: 103.72209867258303 }
    ];
    // this.addPolylines(points);

    
  }

  addPolylines(points: any) {

    let polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      fillColor: "#FF0000",
    };

    if (!google.maps.Polygon.prototype.getBounds) {
      google.maps.Polygon.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        this.getPath().forEach(function (element: any, _: any) {
          bounds.extend(element);
        });
        return bounds;
      };
    }

    /**
     * used for tracking polygon bounds changes within the drawing manager
     */
    google.maps.Polygon.prototype.enableCoordinatesChangedEvent = function () {
      var me = this,
        isBeingDragged = false,
        triggerCoordinatesChanged = function () {
          //broadcast normalized event
          google.maps.event.trigger(me, "coordinates_changed");
        };

      //if  the overlay is being dragged, set_at gets called repeatedly, so either we can debounce that or igore while dragging, ignoring is more efficient
      google.maps.event.addListener(me, "dragstart", function () {
        isBeingDragged = true;
      });

      //if the overlay is dragged
      google.maps.event.addListener(me, "dragend", function () {
        triggerCoordinatesChanged();
        isBeingDragged = false;
      });

      //or vertices are added to any of the possible paths, or deleted
      var paths = me.getPaths();
      paths.forEach(function (path: any, i: any) {
        google.maps.event.addListener(path, "insert_at", function () {
          triggerCoordinatesChanged();
        });
        google.maps.event.addListener(path, "set_at", function () {
          if (!isBeingDragged) {
            triggerCoordinatesChanged();
          }
        });
        google.maps.event.addListener(path, "remove_at", function () {
          triggerCoordinatesChanged();
        });
      });
    };

    function extractPolygonPoints(data: any) {
      var MVCarray = data.getPath().getArray();

      var to_return = MVCarray.map((point: any) => {
        return `(${point.lat()},${point.lng()})`;
      });
      // first and last must be same
      return to_return.concat(to_return[0]).join(",");
    }

    this.existingPolygon = new google.maps.Polygon({
      paths: points,
      editable: true,
      draggable: false,
      map: this.map,
      ...polyOptions
    });
    this.map.fitBounds(this.existingPolygon.getBounds());

    this.existingPolygon.enableCoordinatesChangedEvent();

    google.maps.event.addListener(this.existingPolygon, 'coordinates_changed', () => {
      console.warn('coordinates changed!', extractPolygonPoints(this.existingPolygon))
    });

  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
    }
    if (this.existingPolygon) {
      this.existingPolygon.setMap(null);
    }
    this.coordinates = [];
  }

  setSelection(shape: any) {
    if (shape == null) {
      shape = this.selectedShape;
    }
    let v = shape.getPath();
    for (let i = 0; i < v.getLength(); i++) {
      let xy = v.getAt(i);
      console.log('Cordinate lat: ' + xy.lat() + ' and lng: ' + xy.lng());
      let coordinatesArray: any = {
        latitude: xy.lat(),
        longitude: xy.lng()
      }

      this.coordinates.push(coordinatesArray)
    }
    this.selectedShape = shape;

  }

  handleLocationError() {
    this.snackBService.openSnackBar("The Geolocation service failed. Always allow to access your location.", "Close");
  }

  onBuildForm() {
    this.deliveryareaForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,])],
      minvalue: ['', [Validators.required, Validators.pattern("[+]?([0-9]*[.])?[0-9]+")]],
      delivery_charge: ['', [Validators.pattern("^[0-9]{1,5}(?:\.[0-9]{1,3})?$")]],
      approximate_time: ['', [Validators.required, Validators.pattern("^[0-9]+[0-9]*$")]],
    });

  }
  close() {
    this.dialogRef.close();
  }
  saveArea() {
    if (this.coordinates.length > 0) {

      let postParams = {
        name: this.deliveryareaForm.value['name'],
        minimum_order_value: this.deliveryareaForm.value['minvalue'],
        branch_id: this.data.branch_id,
        delivery_charge: this.deliveryareaForm.value['delivery_charge'],
        coordinates: this.coordinates,
        apprx_delivery_time: this.deliveryareaForm.value['approximate_time']
      }

      this.httpService.post('delivery-area', postParams)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Delivery area created Successfully!!", "Close");
            this.close();
          } else {
            if (result.data) {
              this.ErrorArray = result.data
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.isAreaSelected = false;
    }
  }

}

