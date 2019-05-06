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
    public hitApiLoadIssues(baseUrl, iterations) {
        const promises = [];
        let tempBaseUrl;
        // if iterations is null, just hit the api once and exit.
        if (iterations == null) {
            return this.http.get(baseUrl);
        } else { // else initiate a for loop to run for specified number of iterations
            for (let i = 1; i <= iterations; i++) {
                tempBaseUrl = baseUrl;
                // create a URL with query "?page=<number>&per_page=100"
                if (i !== iterations) {
                    tempBaseUrl = `${tempBaseUrl}?page=${i}&per_page=100`;
                } else { // for the last page, create a URL with query "?page=<number>"
                    tempBaseUrl = `${tempBaseUrl}?page=${i}`;
                }
                // pushing the promises into an array
                promises.push(this.http.get(tempBaseUrl).toPromise());
            }
            return promises;
        }

    }
}
