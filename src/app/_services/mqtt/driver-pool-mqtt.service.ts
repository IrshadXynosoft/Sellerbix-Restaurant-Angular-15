import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Observable } from "rxjs";
import { LocalStorage } from '../localstore.service';

@Injectable({
  providedIn: 'root'
})
export class DriverPoolMqttService {

  private endpoint: any = null;
  constructor(private _mqttService: MqttService, private localService: LocalStorage) { 
  }

  topic(topic: string): Observable<IMqttMessage> {  
    this.endpoint = this.localService.get('driverPoolKey') 
    let topicName = `${this.endpoint}/${topic}`; 
    console.log(topicName);
    return this._mqttService.observe(topicName);
  }

  publish(topic: string,message:any): Observable<any> {
    this.endpoint = this.localService.get('driverPoolKey') 
    let topicName = `${this.endpoint}/${topic}`; 
    return this._mqttService.publish(topicName, message);    
  }
}
