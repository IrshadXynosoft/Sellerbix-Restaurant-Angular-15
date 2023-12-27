import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageModifierComponent } from '../manage-modifier/manage-modifier.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { AddModifierComponent } from '../add-modifier/add-modifier.component';
import { EditModifierComponent } from '../edit-modifier/edit-modifier.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {ModifierList } from './modifier-list.model';
export interface PeriodicElement {
  ModifierName: string;
  ItemsAssigned: string;
  Action: string;
  
}

@Component({
  selector: 'app-modifier-list',
  templateUrl: './modifier-list.component.html',
  styleUrls: ['./modifier-list.component.scss']
})
export class ModifierListComponent implements OnInit {
  modifierListArray:any=[]
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', /*'items_assigned',*/ 'button'];
  public dataSource = new MatTableDataSource<ModifierList>();
  constructor(private router: Router, public dialog: MatDialog,private httpService: HttpServiceService,private snackBService: SnackBarService) {
   }
 
  ngOnInit(): void {
    this.getModifierList();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getModifierList(){
  
    this.httpService.get('modifier')
    .subscribe(result => {     
     
      if (result.status == 200) {
      this.modifierListArray = result.data.modifiers;
      //this.dataSource.data=result.data.modifiers
      const data:any = [];
      let staffs = result.data.modifiers;
      staffs.forEach(function (obj:any) {
       let objData = {
          id: obj.id,
          name: obj.name,
          items_assigned: 1,
          }
        data.push(objData)
      });
     this.dataSource.data = data as ModifierList[];   
      } else {
        console.log("Error in get  modifier");
      }
  }); 
  }
  addModifier(): void {
    const dialogRef = this.dialog.open(AddModifierComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getModifierList();
    });
  }
  back() {
    //this.router.navigate(['setup/globalSettings'])
    this.router.navigate(['setup/menuSetup'])
  }
  manage(id:any): void {
    const dialogRef = this.dialog.open(ManageModifierComponent, {
      width: '500px',data:{'id':id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getModifierList();
    });
  }
  edit(id:any): void {
    const dialogRef = this.dialog.open(EditModifierComponent, {
      width: '500px',data:{'id':id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getModifierList();
    });
  }
  
  SearchModifier(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
