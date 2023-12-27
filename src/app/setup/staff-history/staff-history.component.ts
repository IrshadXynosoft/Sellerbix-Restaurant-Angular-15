import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
@Component({
  selector: 'app-staff-history',
  templateUrl: './staff-history.component.html',
  styleUrls: ['./staff-history.component.scss']
})
export class StaffHistoryComponent implements OnInit {
  userHistoryArray:any=[]
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<StaffHistoryComponent>,private httpService:HttpServiceService,private snackBService:SnackBarService,@Inject(MAT_DIALOG_DATA) public data: {user_id: string,user_name:string},) { }

  ngOnInit(): void {
    this.getStaffHistory();
  }
  getStaffHistory()
  {
    let get={
      user_id:this.data.user_id
    }
    this.httpService.get('user-history/'+this.data.user_id)
    .subscribe(result => {
      if (result.status == 200) {

        this.userHistoryArray=result.data
        } else {
          console.log("Error in userHistory");
        }
  });
  }
 close() {
  this.dialogRef.close();
 }
}
