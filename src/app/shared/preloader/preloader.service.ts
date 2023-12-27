import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/share';

/**
 * Service to start/stop preloader and set preloader messages
 * 
 * @export
 * @class Preloader
 */
@Injectable()
export class Preloader {
	public status: Subject<Object> = new Subject();
	private _active: boolean = false;
	private defaultMessage: string = 'Loading...';
	public message: any;
	private counter: number = 0;

	/**
	 * Creates an instance of Preloader.
	 * 
	 * 
	 * @memberOf Preloader
	 */
	constructor() {
		this.message = this.defaultMessage;
	}

	/**
	 * Method to get status of the preloader
	 * 
	 * @type {boolean}
	 * @memberOf Preloader
	 */
	public get active(): boolean {
		return this._active;
	}

	/**
	 * Method to set the preloader status to true/false
	 * 
	 * 
	 * @memberOf Preloader
	 */
	public set active(v: boolean) {
		this._active = v;
		this.status.next(v);
	}

	/**
	 * Method to start preloader by setting status to true
	 * 
	 * @param {string} [m]
	 * 
	 * @memberOf Preloader
	 */
	public start(m?: string) {    
		this.counter++;
		this.active = true;
		this.message = m ? m : (this.message ? this.message : this.defaultMessage);
	}

	/**
	 * Method to stop preloader by setting status to false
	 * 
	 * 
	 * @memberOf Preloader
	 */
	public stop(): void {
		this.counter--;
		if (this.counter <= 0) {
			this.resetMessage();
			this.active = false;
			this.counter = 0;
		}
	}

	/**
	 * Method to set message of the preloader, if message is not passed with start method
	 * 
	 * @param {any} message
	 * 
	 * @memberOf Preloader
	 */
	public setMessage(message:any): void {
		this.message = message;
	}

	/**
	 * Method to reset the message 
	 * 
	 * 
	 * @memberOf Preloader
	 */
	public resetMessage(): void {
		this.message = null;
	}
}