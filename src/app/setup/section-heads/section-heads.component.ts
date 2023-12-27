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
import { AddSectionHeadsComponent } from '../add-section-heads/add-section-heads.component';
import { EditSectionHeadsComponent } from '../edit-section-heads/edit-section-heads.component';
export interface SectionHeads{
 id:any;
 name:any;
 items:any;
}


@Component({
  selector: 'app-section-heads',
  templateUrl: './section-heads.component.html',
  styleUrls: ['./section-heads.component.scss']
})
export class SectionHeadsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name','items', 'button'];
  public dataSource = new MatTableDataSource<SectionHeads>();
  sectionData:any=[];
  id:any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.id=this.route.snapshot.params.id;
   }
  ngOnInit(): void {
    this.getSections();
   
   }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getSections() {
    this.httpService.get('online/list-sections/'+this.id,false)
      .subscribe(result => {
        if (result.status == 200) {
         this.sectionData = result.data.menu_sections;
          const data:any = [];
          this.sectionData.forEach(function (obj:any) {
            let item:any;
            if(obj.menu_section_mapping){

              obj.menu_section_mapping.forEach((element:any) => {
                let item_name:any=element.item?element.item.name:'--'
                item=item?item+','+item_name:item_name
              });
            }
           let objData = {
              id:obj.id,
              name:obj.name,
              items:item
              }
            data.push(objData)
          });
         this.dataSource.data = data as SectionHeads[];  
        } else {
          console.log("Error in Section heads");
        }
      });
  }
  back() {
    
    this.router.navigate(['setup/location/'+this.id+'/online'])
  }
  addSectonHeads(): void {
    const dialogRef = this.dialog.open(AddSectionHeadsComponent, {
      width: '500px', data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSections();
    });
  }
  editSectionHead(id: any): void {

    const dialogRef = this.dialog.open(EditSectionHeadsComponent, {
      width: '500px', data: { 'branch_id': this.id, 'id': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSections();
    });
  }
  deleteSectionHead(id: any, name: any): void {
    const options = {
      title: 'Delete Section Head',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('online/sections/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Section Head Deleted Successfully!!", "Close");
              this.getSections();
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

