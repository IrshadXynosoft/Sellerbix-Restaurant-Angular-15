import { Injectable } from '@angular/core';
import { isMoment } from 'moment';
@Injectable()
export class Constants {
  APIBasePath: any;
  driverPoolBasePath: any;
  imageBasePath: any;
  APIRequestTimeout: any;
  commonAPIErrorMessage: string;
  noImage: string;
  EncryptKey: string;
  IV: string;
  is_main: boolean;
  constructor() {

    // Test Link
    // this.APIBasePath = "https://test-restaurant.xynosoft.com/api/";
    // this.imageBasePath = "https://test-restaurant.xynosoft.com/storage";

    // Live Unidiner Link
    // this.APIBasePath = "https://api.unidiner.com/api/";
    // this.imageBasePath = "https://api.unidiner.com/storage";

    // Live sllerbix Link
    this.APIBasePath = "https://apir.sellerbix.com/api/";
    this.imageBasePath = "https://apir.sellerbix.com/storage";

    this.driverPoolBasePath = "https://driverpool.unidiner.com/api/"
    this.is_main = true;
    this.APIRequestTimeout = 25000;
    this.commonAPIErrorMessage = "Server Error";
    this.noImage = 'assets/category/no_photo.png';
    this.EncryptKey = '##Vanp@@l~CGC~2017##';
    this.IV = 'vanp@@lCGC';
  }
}

export let getCountryContant = () => {
  return 1;
};

export const environmentMqtt = {
  production: true,
  hmr: false,
  http: {
    apiUrl: 'mqtt.xynosoft.com',
  },
  mqtt: {
    server: 'mqtt.xynosoft.com',
    protocol: "wss",
    port: 8083,
    username: "unidiner-api",
    password: "KREDa6I10Bn3iJce0QOMnn1O"
  }
};
