import { CryptoService } from './crypto.service';
import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class LocalStorage {
  private cryptoService: CryptoService;

  /**
   * Store data to local storage after encryption
   *
   * @param {string} key
   * @param {string} data
   *
   * @memberOf LocalStorage
   */
  store (key:any, data:any) {
      var encryptedData = this.cryptoService.encrypt(JSON.stringify(data)).toString();
      var keyHashed = this.cryptoService.md5(key);
      window.localStorage.setItem(keyHashed, encryptedData);
  }

  /**
   * Get data from local storage after decryption
   *
   * @param {string} key
   * @returns
   *
   * @memberOf LocalStorage
   */
  get (key:any) {
      var keyHashed = this.cryptoService.md5(key);
      var encryptedData = window.localStorage.getItem(keyHashed);
      if (!_.isNull(encryptedData)){
          if(!_.isEmpty(this.cryptoService.decrypt(encryptedData)))
          {
            return JSON.parse(this.cryptoService.decrypt(encryptedData));
          }
      }

      return null;
  }


  /**
   * Method to clear all local storage items from browser (destructive!)
   *
   *
   * @memberOf LocalStorage
   */
  clear () {
      window.localStorage.clear();
  }

  /**
   * Method to clear particular local storage items from browser (destructive!) using key specified
   *
   *
   * @memberOf LocalStorage
   */
  remove (key:any) {
	var keyHashed = this.cryptoService.md5(key);
      localStorage.removeItem(keyHashed);
  }


  constructor(@Inject(CryptoService) cryptoService: CryptoService) {
    this.cryptoService = cryptoService;
  }

}