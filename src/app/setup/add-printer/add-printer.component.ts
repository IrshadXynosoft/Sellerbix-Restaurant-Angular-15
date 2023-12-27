import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-printer',
  templateUrl: './add-printer.component.html',
  styleUrls: ['./add-printer.component.scss']
})
export class AddPrinterComponent implements OnInit {
  public addPrinterForm!: UntypedFormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { branchid:any ,method:any, printer_id:any},private snackBService: SnackBarService,private httpService: HttpServiceService,private formBuilder: UntypedFormBuilder,public dialog: MatDialog, public dialogRef: MatDialogRef<AddPrinterComponent>) { }

  ngOnInit(): void {
    this.OnBuildForm();
    this.printerDetails();
  }
  OnBuildForm() {
    this.addPrinterForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      printer_type: ['', Validators.compose([Validators.required])],
      ip: [null],
      port_no: [null],
      comport_name:[null],
      baud_rate:[null],
      printer_task_sec:[null],
      system_printer_name:[null],
    })
  }

  printerDetails(){
    if(this.data.method == "update") {
      this.httpService.get('printer/' + this.data.printer_id , false)
      .subscribe(result => {
        this.addPrinterForm.patchValue({
          'name': result.data.name,
          'printer_type': result.data.type,
          'ip':result.data.ip,
          'port_no':result.data.port_no,
          'comport_name':result.data.comport_name,
          'baud_rate': result.data.printer_baud_rate,
          'printer_task_sec':result.data.printer_task_sec,
          'system_printer_name':result.data.sys_print_name
        })
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
  
  printerSave() {
    let post = this.addPrinterForm.value;
    post.branch_id=this.data.branchid;
    this.httpService.post('printer', post)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Printer added Successfully", "Close");
        this.close();
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }

  updatePrinter(){
    let post = this.addPrinterForm.value;
    post.branch_id=this.data.branchid;
    console.log(this.data.branchid);
    
    this.httpService.put('printer/' +this.data.printer_id, post)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Printer updated Successfully", "Close");
        this.close();
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
}
