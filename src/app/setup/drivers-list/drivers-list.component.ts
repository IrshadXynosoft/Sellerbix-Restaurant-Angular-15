import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddDeliveryAreaComponent } from '../add-delivery-area/add-delivery-area.component';
import { DriverCashSettlementComponent } from '../driver-cash-settlement/driver-cash-settlement.component';
import { DriverOrderSettlementComponent } from '../driver-order-settlement/driver-order-settlement.component';
import { EditDeliveryAreaComponent } from '../edit-delivery-area/edit-delivery-area.component';
import { EditDriverComponent } from '../edit-driver/edit-driver.component';
import { ShowCommissionDetailsComponent } from '../show-commission-details/show-commission-details.component';
import { UploadDeliveryAreaComponent } from '../upload-delivery-area/upload-delivery-area.component';
export interface Drivers{
  id: number;
  name: any;
  delivery_area:any;
  commission:any;
  commission_type:any
  type:any;
  staff_id:any;
  user_id:any
}

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss']
})
export class DriversListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name','commission_type','commission','delivery_area','button'];
  public dataSource = new MatTableDataSource<Drivers>();
  driverRecords:any=[];
   branch_id:any
  constructor(private router: Router, public dialog: MatDialog,private route:ActivatedRoute,private snackBService:SnackBarService,private httpService:HttpServiceService,private localService:LocalStorage,private dialogService:ConfirmationDialogService) {
    this.branch_id=this.localService.get('branch_id')
   }
  ngOnInit(): void {
    this.getDrivers();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getDrivers(){
    this.httpService.get('list-delivery-driver/'+this.branch_id)
    .subscribe(result => {
      if (result.status == 200) {
        this.driverRecords=result.data
        const data:any = [];
        this.driverRecords .forEach( (obj:any) =>{
         
          let areaName:any=null
          let areaSelected:any=[];
          let areaId:any=[];
          let commissionType:any;
          if(obj.driver.length>0){
            obj.driver[0].driver_delivery_area.forEach((element:any) => {
              if(element.delivery_area){
                areaName=areaName?areaName+','+ element.delivery_area.name:element.delivery_area.name
                areaSelected.push(element.delivery_area),
                areaId.push(element.delivery_area.id)
              }
            
            
              });
              commissionType=obj.driver[0].commision_type=="1"?'Percentage':'Value'
                }
         let objData = {
            id: obj.id,
            name: obj.name,
            delivery_area:areaName?areaName:'-',
            commission:obj.driver.length>0?parseFloat(obj.driver[0].commision_value).toFixed(2):'-',
            commission_type:obj.driver.length>0?commissionType:'-',
            type:obj.driver.length>0?'edit':'new',
            staff_id:obj.staff[0].id,
            user_id:obj.staff[0].user_id,
            areaSelected:areaSelected,
            areaIdList:areaId,
            driver_id:obj.driver.length>0?obj.driver[0].id:0
            }
           
          
          data.push(objData)
        });
       this.dataSource.data = data as Drivers[];
       
      } else {
        console.log("Error in get Delivery Area");
      }
    });
   
  }
  

  back() {
    this.router.navigate(['setup/delivery_settings'])
  }

  editDriver(element:any){
    const dialogRef = this.dialog.open(EditDriverComponent, {
      width: '700px', data: { driverData: element,branch_id:this.branch_id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDrivers();
    });
  }

  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  showDetails(id:any){
    const dialogRef = this.dialog.open(ShowCommissionDetailsComponent, {
      width: '80%',
      data:{
        driverId:id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDrivers();
    });
  }
  settleDriver(id:any){
    const dialogRef = this.dialog.open(DriverCashSettlementComponent, {
      width: '80%',
      data:{
        driverId:id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDrivers();
    });
  }
  settleDriverOrders(id:any){
    const dialogRef = this.dialog.open(DriverOrderSettlementComponent, {
      width: '80%',
      data:{
        driverId:id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDrivers();
    });
  }
}
