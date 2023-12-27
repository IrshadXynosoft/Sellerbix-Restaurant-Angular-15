import { Injectable } from '@angular/core';


import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  spinner = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private snackBar:MatSnackBar) { }

  /*
  Definition: To show the popup message
  @param: message => The message to show 
  @param: action => Input can be any string to close the Popup
  */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 4000,
    });
  }
  spinnerloader(){
    this.spinner=true;
  }
}
