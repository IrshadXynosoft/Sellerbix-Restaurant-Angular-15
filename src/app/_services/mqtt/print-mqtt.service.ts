import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Observable } from "rxjs";
import { LocalStorage } from '../localstore.service';

@Injectable({
  providedIn: 'root'
})
export class PrintMqttService {

  private endpoint: string;

  constructor(private _mqttService: MqttService, private localService: LocalStorage) { 
    this.endpoint = this.localService.get('mqtt_token');  
  }

  topic(deviceId: string): Observable<IMqttMessage> {
    let topicName = `/${this.endpoint}/${deviceId}`;     
    return this._mqttService.observe(topicName);
  }

  publish(topic: string,message:any): Observable<any> {
    console.log('Printed :) ');
    // let topicName = `${this.endpoint}`; 
    let topicName = `${this.endpoint}-${topic}`; 
    return this._mqttService.publish(topicName, message);
  }

  checkPrinterAvailablity(printObj:any) {
    console.log(printObj);
    let obj:any;
    if(printObj.canPrint) {
       obj = {
        'status':true,
        'message':"",
        'printObj': JSON.stringify(printObj.printObj)
      }
    }
    else {
       obj = {
        'status':false,
        'message':printObj.message,
        'printObj': null
      }
    }
    return obj;
  }
}
