import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-delivery-manager',
  templateUrl: './delivery-manager.component.html',
  styleUrls: ['./delivery-manager.component.scss']
})
export class DeliveryManagerComponent implements OnInit {
  id=this.route.snapshot.params.id;
  status:any;  
  constructor(private router: Router,private route:ActivatedRoute,private httpService: HttpServiceService, private snackBService: SnackBarService) {
    this.status=false;
   }
 

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['addons'])
  }
  statusChange(status:any){
    let body ={
      status:status._checked
    }
    this.httpService.put('', body)
    .subscribe(result => {
     if (result.status == 200) {
        this.snackBService.openSnackBar("Status updated successfully", "Close");
      } else {
      this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
}
