import { Preloader } from './preloader.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'cgc-preloader',
	templateUrl: './preloader.component.html',
	styleUrls: ['./preloader.component.scss']
})

export class PreloaderComponent implements OnInit {
	public active: any;
	public constructor(private preloader: Preloader) {
		this.preloader.status.subscribe(status => {
			this.active = status;
		});
	}

	ngOnInit() {
	}

}
