// importing libraries and files required by this file
import { Component, OnInit, Input } from '@angular/core';
import { FetchGitApiService } from '../../fetch.git.api.service';
import * as _ from 'underscore';

// Component decorator
@Component({
    // selector is basically a custom html tag for this component
    selector: 'app-movie-list-mak',
    // path of the html file for this component
    templateUrl: './list.of.issues.component.html',
    // path of the css file for this component
    styleUrls: ['./list.of.issues.component.css']
})

export class ListOfIssuesComponent implements OnInit {
    // this takes the value of baseUrlForm from its parent component using Input decorator.
    @Input() baseUrlForm: string;
    // specifying service class
    service: FetchGitApiService;
    // initializing variables
    baseUrl: any;
    tempBaseUrl: any;
    issuesUrl: any;
    issueWithinDayContainingArray: any[];
    issueWithinWeekContainingArray: any[];
    issueMoreThanWeekContainingArray: any[];
    count: 0;
    dayCount: any;
    weekCount: any;
    moreCount: any;
    isLoading = false;

    // this is a life cycle hook which is triggered on initialization of this component
    ngOnInit() {
        this.baseUrl = this.baseUrlForm;
        // calling the business logic containing function
        this.isLoading = true;
        this.loadIssues();
    }
    // doing dependency injection i.e. injecting this service into this component so it can have access to the service
    constructor(service: FetchGitApiService) {
        this.service = service;
    }

    // function containing all the business logic
    loadIssues() {
        // using Promises to handle repsonse of api call from service file.
        // hitting api to check if user repo combination exists.
        const observable: any = this.service.hitApiLoadIssues(this.baseUrl, null);
        // promises
        observable.toPromise()
            .then((response) => {
                // converting the response to a much more readable json format
                const result_returned = response.json();
                // checking if the repo is private or not
                if (result_returned['private'] === true) {
                    alert('this is a private repo');
                }
                // check to ensure that the repo has issues
                // tslint:disable-next-line:max-line-length
                this.issuesUrl = (result_returned['has_issues'] === true && result_returned['open_issues_count'] > 0) ? result_returned['issues_url'] : null;
                // appending a query to only hit api to fetch 1 page and max 100 in that page.
                this.tempBaseUrl = this.issuesUrl ? this.issuesUrl.substr(0, this.issuesUrl.indexOf('{')) : null;
                this.baseUrl = this.tempBaseUrl ? this.tempBaseUrl + '?page=1&per_page=100' : null;
                // now hitting the api for list of issues.
                const observable2: any = this.service.hitApiLoadIssues(this.baseUrl, null);
                return observable2.toPromise();
            }, (reject) => {
                alert('invalid URL or the repo is private');
            }).then((data) => {
                // retrieving the link parameter from response headers.
                // Below logic is written to extract the no. of pages required at 100 issues per page.
                let link = data.headers['_headers'].get('link')[0];
                // Extracting the second string in link field
                link = link.substr(link.indexOf(',') + 1);
                let link1 = link;
                link = link.substr(link.indexOf(';') + 1);
                // confirming if the extracted string contains this specific string.
                if (link === ` rel="last"`) {
                    // trying to get the number out of that string.
                    let start = link1.indexOf('?') + 1;
                    let end = link1.indexOf('&');
                    end = end - start;
                    link1 = link1.substr(start, end);
                    start = link1.indexOf('=') + 1;
                    // assigningthe extracted no. of pages from the link.
                    const noOfPages = parseInt(link1.substr(start), 10);
                    // now calling the function in service with value of second parameter for iteration count
                    const observable3: any = this.service.hitApiLoadIssues(this.tempBaseUrl, noOfPages);
                    // the function from service file returns an array of promises.
                    return Promise.all(observable3);
                }
            })
            .then((data_from_promise: any) => {
                const data1: any[] = [];
                // creating an array with all the responses from hitting the issues api in json format.
                for (const i of data_from_promise) {
                    data1.push(i.json());
                }
                // converting the data into a flat array format
                const listOfIssues = _.flatten(data1);
                // initializing some local scope variables.
                const count = listOfIssues.length;
                const issueWithinDayContainingArray = [];
                const issueWithinWeekContainingArray = [];
                const issueMoreThanWeekContainingArray = [];
                // looping through all the issues to filter them according to the last updated time.
                _.each(listOfIssues, function (issue) {
                    let obj = {};
                    // getting current/now's date and assigning its value in milliseconds to a variable for comparision.
                    const date = new Date().getTime();
                    // creating an object to be pushed in arrays.
                    obj = {
                        url: issue.url,
                        htmlUrl: issue.html_url,
                        updateDate: new Date(issue.updated_at)
                    };
                    if (obj['updateDate'].getTime() >= date - 86400000) {
                        // condition if last update was within 24 hours from now.
                        issueWithinDayContainingArray.push(obj);
                    } else if (obj['updateDate'].getTime() < date - 86400000 && obj['updateDate'].getTime() >= date - 604800000) {
                        // condition if last update was betweeen 24 hours and a week from now.
                        issueWithinWeekContainingArray.push(obj);
                    } else {
                        // condition if last update was more than a week from now.
                        issueMoreThanWeekContainingArray.push(obj);
                    }
                });
                let tempObj = {};
                // if count of issues was more than 0, give value of local variables to global ones to be accessed by html
                if (count > 0) {
                    tempObj = {
                        count: count,
                        issueWithinDayContainingArray: issueWithinDayContainingArray,
                        dayCount: issueWithinDayContainingArray.length,
                        issueWithinWeekContainingArray: issueWithinWeekContainingArray,
                        weekCount: issueWithinWeekContainingArray.length,
                        issueMoreThanWeekContainingArray: issueMoreThanWeekContainingArray,
                        moreCount: issueMoreThanWeekContainingArray.length
                    };
                } else {
                    tempObj = {
                        error: true
                    };
                }
                // returning the above created temporary object.
                return tempObj;
            })
            .then((obj) => {
                if (!obj.error) {
                    this.count = obj.count;
                    this.issueWithinDayContainingArray = obj.issueWithinDayContainingArray;
                    this.dayCount = obj.dayCount;
                    this.issueWithinWeekContainingArray = obj.issueWithinWeekContainingArray;
                    this.weekCount = obj.weekCount;
                    this.issueMoreThanWeekContainingArray = obj.issueMoreThanWeekContainingArray;
                    this.moreCount = obj.moreCount;
                } else {
                    alert('error occured');
                }
                // Now since the logic is completed end the animation
                this.isLoading = false;
                return;
            });
    }
}
