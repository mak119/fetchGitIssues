import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as _ from 'underscore';

@Injectable()
export class FetchGitApiService {
    // baseUrl = 'https://api.github.com/repositories?since=364';
    baseUrl = '';
    http: Http;
    issuesUrl = [];
    issuesUrlNeeded: any;
    issueWithinDayContainingArray: any[];
    issueWithinWeekContainingArray: any[];
    issueMoreThanWeekContainingArray: any[];
    objectForReturn: any;
    count: 0;

    constructor(http: Http) {
        this.http = http;
    }

    public getPlayers(baseUrl) {
        return this.http.get(baseUrl);
    }
}
