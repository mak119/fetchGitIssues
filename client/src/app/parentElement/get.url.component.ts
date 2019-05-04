import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FetchGitApiService } from '../fetch.git.api.service';

@Component({
    selector: 'app-create-mak',
    templateUrl: './get.url.component.html',
    styleUrls: ['./get.url.component.css']
})

export class GetUrlComponent {
    service: FetchGitApiService;
    baseDataUrl: string;
    isSaveClicked = false;
    baseUrl: '';

    constructor(service: FetchGitApiService, private router: Router, private route: ActivatedRoute) {
        this.service = service;
    }

    goBack() {
        this.isSaveClicked = false;
    }
    onSave() {
        this.isSaveClicked = true;
        const baseData = 'https://api.github.com/repos' + this.baseUrl.substr(18);
        this.baseDataUrl = baseData;
    }

}
