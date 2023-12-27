import { Binary } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { type } from 'os';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
//import * as XLSX from 'xlsx'
@Component({
  selector: 'app-upload-menu',
  templateUrl: './upload-menu.component.html',
  styleUrls: ['./upload-menu.component.scss']
})
export class UploadMenuComponent implements OnInit {
  excelData: any;
  menuFile: any | ArrayBuffer = null;
  file:any ;
  ImageBaseDataRegular: any | ArrayBuffer = null;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<UploadMenuComponent>, private snackBService: SnackBarService, private httpService: HttpServiceService) { }

  ngOnInit(): void {
  }
  onFileChange(event: any) {
    let files: FileList= event.target.files;
    this.file =files.item(0);
    // console.log(this.file);
    // let me = this;
    // let file = event.target.files[0];
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = function () {
    //   me.ImageBaseDataRegular = reader.result?.toString();
    // };
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
  }

  uploadMenu() {
  // if(this.file){}
    const formData = new FormData();
    formData.append("file", this.file,this.file.name);
    // console.log(formData);
   let post:any={'file':formData}
    this.httpService.post('menu-upload', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  close() {
    this.dialogRef.close();
  }
}
