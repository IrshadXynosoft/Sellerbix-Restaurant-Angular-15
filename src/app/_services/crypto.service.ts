import { Constants } from '../../constants';
import * as CryptoJS from 'crypto-js';
import { Injectable, Inject } from '@angular/core';

/**
 * 
 * @author Manu M.
 * @export
 * @class CryptoService
 */
@Injectable()
export class CryptoService {
  key: string;
  iv: any;
  
  
  /**
   * Generates encrypted text from raw text
   * 
   * @param {string} rawData
   * @returns {string} 
   * 
   * @memberOf CryptoService
   */
  encrypt(rawData:any) {
    var encrypted = CryptoJS.AES.encrypt(rawData, this.key, {iv: this.iv});
    return encrypted.toString();
  }

  /**
   * Decrypts the encrypted string provided
   * 
   * @param {string} encryptedData
   * @returns {string}
   * 
   * @memberOf CryptoService
   */
  decrypt(encryptedData:any) {
    var decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {iv: this.iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  md5(key:any) {
    var hash = CryptoJS.MD5(key);
    return hash.toString();
  }

  /**
   * Creates an instance of CryptoService.
   * 
   * @param {Constants} AppConstants
   * 
   * @memberOf CryptoService
   */
  constructor(private AppConstants: Constants) { 
    this.key = AppConstants.EncryptKey;
    this.iv = AppConstants.IV;
  }

}