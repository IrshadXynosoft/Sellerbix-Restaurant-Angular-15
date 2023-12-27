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
import { AddEditUtensilsComponent } from '../add-edit-utensils/add-edit-utensils.component';
export interface Utensils{
  id: number;
  name: any;
  selling_price:any;
  total_qty: any;
  remaining_qty:any;
}
@Component({
  selector: 'app-utensils',
  templateUrl: './utensils.component.html',
  styleUrls: ['./utensils.component.scss']
})
export class UtensilsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', 'selling_price','total_qty','remaining_qty','damaged_qty', 'button'];
  public dataSource = new MatTableDataSource<Utensils>();
  utensilsArray: any = []
  id:any;
  branch_id:any;
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.id=this.route.snapshot.params.id;
    this.branch_id=this.localService.get('branch_id') 
   }
  ngOnInit(): void {
    this.getUtensils();
   
   }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getUtensils() {
    this.httpService.get('all-utensil/'+this.id,false)
      .subscribe(result => {
        if (result.status == 200) {
         this.utensilsArray = result.data;
          const data:any = [];
          this.utensilsArray.forEach(function (obj:any) {
           let objData = {
              id: obj.id,
              name: obj.name,
              selling_price:(obj.selling_price).toFixed(2),
              total_qty: obj.total_qty,
              remaining_qty:obj.remaining_qty,
              damaged_qty:obj.damaged_qty
              }
            data.push(objData)
          });
         this.dataSource.data = data as Utensils[];  
        } else {
          const data:any = [];
          this.dataSource.data = data as Utensils[];  
          console.log("Error in Utensils");
        }
      });
  }
  back() {
    
    this.router.navigate(['setup/location/'+this.id+'/menuManagement'])
  }
  addUtensils(): void {
    const dialogRef = this.dialog.open(AddEditUtensilsComponent, {
      width: '500px',data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUtensils();
    });
  }
  editUtensils(id: any): void {

    const dialogRef = this.dialog.open(AddEditUtensilsComponent, {
      width: '500px', data: { 'id': id,'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUtensils();
    });
  }
  deleteUtensils(id: any, name: any): void {
    const options = {
      title: 'Delete Utensils',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('utensil/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Utensils Deleted Successfully!!", "Close");
              this.getUtensils();
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

  
}
