import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-sms-gateway',
  templateUrl: './edit-sms-gateway.component.html',
  styleUrls: ['./edit-sms-gateway.component.scss']
})
export class EditSmsGatewayComponent implements OnInit {
  public smsGatewayForm!: UntypedFormGroup;
  tagsChoosen: any = [];
  templateRecords: any = [];
  triggers: any = [];
  selectedTrigger: any;
  templates: any = [
    { name: '#order_number#' }, { name: '#amount#' }, { name: '#organization_name#' }, { name: '#balance_amount#' }, { name: '#due_amount#' }, { name: '#order_status#' }, { name: '#branch_name#' }
  ]
  constructor(
    private snackBService: SnackBarService, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { id: any },
    public dialogRef: MatDialogRef<EditSmsGatewayComponent>
  ) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getTriggers();
    this.getEditDetails();
  }

  onBuildForm() {
    this.smsGatewayForm = this.formBuilder.group({
      trigger_point: ['', Validators.compose([Validators.required])],
      message_template: ['', Validators.compose([Validators.required])],
      status: false
    });
  }

  getEditDetails() {
    this.httpService.get('message-template/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.smsGatewayForm.patchValue({
            trigger_point: result.data.trigger_id,
            message_template: result.data.template,
            status: result.data.status
          })
          this.selectedTrigger = result.data.trigger_id;
          this.tagsChoosen.push(result.data.template)
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  getTriggers() {
    this.httpService.get('triggers', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.triggers = result.data.triggers;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  backspaceEvent(e: any) {
    this.tagsChoosen = e.target.value.split(' ')
  }

  selectedOptions(note: any) {
    this.tagsChoosen.push(note);
    this.smsGatewayForm.patchValue({
      message_template: this.tagsChoosen.join(' ')
    })
  }

  saveTemplate() {
    let body = {
      template: this.smsGatewayForm.value['message_template'],
      trigger_id: this.smsGatewayForm.value['trigger_point'],
      status: this.smsGatewayForm.value['status']
    }
    if (this.smsGatewayForm.valid) {
      this.httpService.put('message-template/' + this.data.id, body)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.dialogRef.close("done")
          } else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
