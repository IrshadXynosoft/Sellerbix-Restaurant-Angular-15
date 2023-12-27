import { Injectable } from '@angular/core';
import { LocalStorage } from './localstore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean = false;
  constructor(private localService: LocalStorage,) { }

  isLoggedIn() {
    this.loggedIn=this.localService.get('accessToken')?true:false
    return this.loggedIn;
  }
}

