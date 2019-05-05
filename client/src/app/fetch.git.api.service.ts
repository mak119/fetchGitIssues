// importing libraries and files required by this file
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// @Injectable() decorator to indicate that a component or other class has a dependency
// @Injectable allows Angular to inject it into another class as a dependecy
@Injectable()
export class FetchGitApiService {
    http: Http;

    constructor(http: Http) {
        this.http = http;
    }
    // function being called by the components which basically returns the result of a api hit by http GET method.
    public hitApiLoadIssues(baseUrl) {
        return this.http.get(baseUrl);
    }
}
