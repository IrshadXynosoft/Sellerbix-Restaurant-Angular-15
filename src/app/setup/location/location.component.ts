import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddLocationComponent } from '../add-location/add-location.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog,public httpService:HttpServiceService,public localStorage:LocalStorage) { }
  branchRecords:any=[]
  branchDetails:any=[]
  ngOnInit(): void {
    this.getBranches();
  }
  edit(id:any) {
    this.router.navigate(['setup/'+id+'/editLocation']) 
  }
  addLocation(): void {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBranches();
    });
  }
  getBranches(){
    this.httpService.get('get-logged-in-branch',false)
  .subscribe(result => {
    if (result.status == 200) {
      this.branchRecords = result.data.tenant_branches;
    } else {
      console.log("Error in Get Branch");
    }
  });
  }
  back()
  {
    this.router.navigate(['setup'])
    
  }
}