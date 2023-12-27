import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, timeout, map, finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Constants } from '../../constants';
import { Router } from '@angular/router';
import { LocalStorage } from './localstore.service';
import { Preloader } from './../shared/preloader/preloader.service';
import { SnackBarService } from '../_services/snack-bar.service';

const toJSON = (data: any): string => {
  try {
    return JSON.stringify(data)
  } catch (e) {
    return data
  }
}
@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  public accessToken: any;
  constructor(
    private http: HttpClient,
    private constant: Constants,
    private localService: LocalStorage,
    private preloader: Preloader,
    private snackBService: SnackBarService,
    private router: Router) {
  }

  private requestOptions() {
    let httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.localService.get('accessToken'),'mode' : 'from_pos' })
    };
    return httpHeader;
  }

  post(url: any, post: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    let full_url = this.constant.APIBasePath + url;
    return this.http.post<any>(full_url, post, this.requestOptions())
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }

  driver_pool_post(url: any, post: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    let full_url = this.constant.driverPoolBasePath + url;
    return this.http.post<any>(full_url, post, this.requestOptions())
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }

  get(url: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    let full_url = this.constant.APIBasePath + url;
    return this.http.get<any>(full_url, this.requestOptions())
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          // console.log(response)
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }

  driver_pool_get(url: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    let full_url = this.constant.driverPoolBasePath + url;
    return this.http.get<any>(full_url, this.requestOptions())
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          // console.log(response)
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }

  getTimeZone(url: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    return this.http.get<any>(url)
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }
  put(url: any, put: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    let full_url = this.constant.APIBasePath + url;
    return this.http.put<any>(full_url, put, this.requestOptions())
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }

  delete(url: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    let full_url = this.constant.APIBasePath + url;
    return this.http.delete<any>(full_url, this.requestOptions())
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }

  deleteWithBody(url: any, body: any, loader: boolean = true): Observable<any> {
    this.requestInterceptor(loader);
    let full_url = this.constant.APIBasePath + url;
    return this.http.delete<any>(full_url, this.requestOptions())
      .pipe(
        timeout(this.constant.APIRequestTimeout),
        catchError(this.handleError<any>()),
        map(response => {
          return response;
        }),
        finalize(() => {
          this.onFinally();
        })
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      if (error.status == 401) {
        this.snackBService.openSnackBar("Token Expired, please try to login again!", "Close");
        this.localService.remove('accessToken');
        this.localService.remove('branchname');
        this.localService.remove('menuList');
        this.localService.remove('branch_id');
        this.localService.remove('mqtt_token');
        this.router.navigate(['/']);
      } else if (error.status == 403) {
        this.snackBService.openSnackBar("Unauthorized Access, please login again!", "Close");
      } else if (error.status == 404) {
        this.snackBService.openSnackBar("Requested API not found, please check with Administrator", "Close");
      } else if (error.status == 201) {
        this.snackBService.openSnackBar("Validation Error, Invalid data found.", "Close");
      }
      // console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  /**
    * Request interceptor.
    */
  private requestInterceptor(noLoader: any): void {
    if (noLoader == undefined || noLoader == true) {
      this.preloader.start();
    }
  }

  /**
   * Response interceptor.
   */
  private responseInterceptor(): void {
    this.preloader.stop();
  }

  /**
  * onFinally
  */
  private onFinally(): void {
    this.responseInterceptor();
  }
}
