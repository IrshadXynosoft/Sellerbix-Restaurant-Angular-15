import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddModifierGroupComponent } from '../add-modifier-group/add-modifier-group.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { EditModifierGroupComponent } from '../edit-modifier-group/edit-modifier-group.component';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


export interface ModifierGroup{
  id:any,
  name:any,
  secondary_name:any;
}
@Component({
  selector: 'app-modifier-group',
  templateUrl: './modifier-group.component.html',
  styleUrls: ['./modifier-group.component.scss']
})
export class ModifierGroupComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  modifierrecords:any=[];
  constructor(private snackBService:SnackBarService ,private httpService:HttpServiceService,private router: Router, public dialog: MatDialog,private dialogService:ConfirmationDialogService) { }
  public displayedColumns: string[] = ['Index','Name','priority','button'];
  public dataSource = new MatTableDataSource<ModifierGroup>();
  ngOnInit(): void {
    this.getmodifiergroup();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  getmodifiergroup(){
    this.httpService.get('modifier-group')
    .subscribe(result => {   
      if (result.status == 200) {
         this.modifierrecords=result.data.modifier_groups; 
         const data:any = [];
        this.modifierrecords.forEach((obj: any) =>{
          let objData = {
            id: obj.id,
            name:obj.name,
            secondary_name:obj.secondary_name,
            priority: obj.priority ? obj.priority : '--',
            type:obj.type
          }
          data.push(objData)
        });
        this.dataSource.data = data as ModifierGroup[];

      } else {
        console.log("Error");
      }
  });
  }
  back() {
   // this.router.navigate(['setup/globalSettings'])
   this.router.navigate(['setup/menuSetup'])
   
  }
  addModifierGroup(): void {
    const dialogRef = this.dialog.open(AddModifierGroupComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getmodifiergroup();
    });
  }
  editModifierGroup(e:any): void {
    const dialogRef = this.dialog.open(EditModifierGroupComponent, {
      width: '500px',
      data:{
        id:e.id,
        name:e.name,
        secondary_name:e.secondary_name,
        type:e.type,
        priority:e.priority
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getmodifiergroup();
    });
  }
  deletemodifiergroup(id:any,name:any){
    const options = {
      title: 'Delete Modifier Group',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('modifier-group' + '/' +id)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Modifier Group Deleted Successfully!!", "Close");
            this.getmodifiergroup();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
            console.log("Error");
          }
        });
      }
    });
   }
   doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
