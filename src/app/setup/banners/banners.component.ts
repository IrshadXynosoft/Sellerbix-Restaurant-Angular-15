import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { AddBannersComponent } from '../add-banners/add-banners.component';
import { EditBannersComponent } from '../edit-banners/edit-banners.component';
export interface Banners{
 id:any;
 name:any;
 link:any;
}

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', 'link', 'range' , 'button'];
  public dataSource = new MatTableDataSource<Banners>();
  bannerData:any=[];
  id:any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.id=this.route.snapshot.params.id;
   }
  ngOnInit(): void {
    this.getBanners();

   }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getBanners() {
    this.httpService.get('online/list-banners/'+this.id,false)
      .subscribe(result => {
        if (result.status == 200) {
         this.bannerData = result.data.banners;
          const data:any = [];
          this.bannerData.forEach(function (obj:any) {
           let objData = {
              id:obj.id,
              name:obj.name,
              link:obj.link,
              range : obj.from_date + '  to   ' + obj.to_date
              }
            data.push(objData)
          });
         this.dataSource.data = data as Banners[];
        } else {
          console.log("Error in Banners");
        }
      });
  }
  back() {

    this.router.navigate(['setup/location/'+this.id+'/online'])
  }
  addBanner(): void {
    const dialogRef = this.dialog.open(AddBannersComponent, {
      width: '800px', data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBanners();
    });
  }
  editBanner(id: any): void {

    const dialogRef = this.dialog.open(EditBannersComponent, {
      width: '800px', data: { 'branch_id': this.id,'id': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBanners();
    });
  }
  deleteBanner(id: any, name: any): void {
    const options = {
      title: 'Delete Banner',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('online/banners/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Banner Deleted Successfully!!", "Close");
              this.getBanners();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  statusChange(status:any,element:any){
    let body ={

    }
    this.httpService.put(''+ element.id, body)
    .subscribe(result => {
     if (result.status == 200) {
        this.snackBService.openSnackBar("Status updated successfully", "Close");
      } else {
      this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
}

