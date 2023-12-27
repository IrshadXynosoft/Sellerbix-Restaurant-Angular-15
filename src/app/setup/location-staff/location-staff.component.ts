import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LocationStaff } from './location-staff-list.model';
@Component({
  selector: 'app-location-staff',
  templateUrl: './location-staff.component.html',
  styleUrls: ['./location-staff.component.scss']
})
export class LocationStaffComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
 // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  staffRoleArray:any=[]
  id=this.route.snapshot.params.id;
  public displayedColumns: string[] = ['index','name', 'email','contact_no'];
  public dataSource = new MatTableDataSource<LocationStaff>();
  constructor(private router: Router,private httpService:HttpServiceService,private snackBService:SnackBarService,private route:ActivatedRoute) { }
  
  ngOnInit(): void {
    this.getStaffDetails();
   }
   ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  back() {
   
    this.router.navigate(['setup/'+this.id+'/editLocation'])
  }
  getStaffDetails(){
    this.httpService.get('role-users/'+this.id)
    .subscribe(result => {
      if (result.status == 200) {
        const data:any = [];
        let staffs = result.data;
        
          staffs.forEach(function (obj:any) {
            let usersData:any=[]
            if(obj.user.length>0)
            {
              for(let i=0;i<obj.user.length;i++)
              {
                let users={
                  name: obj.user[i].name,
                  role_id:obj.user[i].role_id,
                  branch_id: obj.user[i].branch_id,
                  email:obj.user[i].email,
                  contact_no:obj.user[i].contact_no
                }
                usersData.push(users)
    
              }
              let objData = {
                id: obj.id,
                name:obj.name,
                users:usersData
                }
              data.push(objData)
            }
             
          });
           this.staffRoleArray= data
        
       } else {
        console.log("Error");
      }
    });
  }

roleChanged(event:any) {
 let data:any=[];
 for(let i=0;i<this.staffRoleArray.length;i++)
 {
   if(this.staffRoleArray[i].name==event.tab.textLabel)
   {
    this.staffRoleArray[i].users.forEach(function (obj:any) {
      let objData={
       name: obj.name,
       role_id:obj.role_id,
       branch_id: obj.branch_id,
       contact_no:obj.contact_no,
       email:obj.email
      }
      data.push(objData)
    });
    this.dataSource.data = data as LocationStaff[];    
   }
 }
}
doFilter(filterValue: any) {
  this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
}
}
