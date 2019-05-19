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
    totalCount: any;
    dayCount: any;
    dayCountTotal: any;
    weekCount: any;
    weekCountTotal: any;
    moreCount: any;
    moreCountTotal: any;
    isDayLoading = false;
    isWeekLoading = false;
    isMoreThanWeekLoading = false;
    isLoadingHeader = false;

    // this is a life cycle hook which is triggered on initialization of this component
    ngOnInit() {
        this.baseUrl = this.baseUrlForm;
        // calling the business logic containing function
        this.isDayLoading = true;
        this.isWeekLoading = true;
        this.isMoreThanWeekLoading = true;
        this.isLoadingHeader = true;
        this.totalCount = '';
        this.checkForErrors();
    }
    // doing dependency injection i.e. injecting this service into this component so it can have access to the service
    constructor(service: FetchGitApiService) {
        this.service = service;
    }

    checkForErrors() {
        // using Promises to handle repsonse of api call from service file.
        // hitting api to check if user repo combination exists.
        const baseUrl = this.baseUrl;
        const observable: any = this.service.hitApiLoadIssues(baseUrl, null);
        // promises
        observable.toPromise()
            .then((response) => {
                // converting the response to a much more readable json format
                const result_returned = response.json();
                // check to ensure that the repo has issues
                // tslint:disable-next-line:max-line-length
                this.issuesUrl = (result_returned['has_issues'] === true && result_returned['open_issues_count'] > 0) ? result_returned['issues_url'] : null;
                this.isLoadingHeader = this.issuesUrl ? false : true;
                this.count = this.issuesUrl ? result_returned['open_issues_count'] : null;
                if (!this.count) {
                    alert(' No open issues for this repo');
                    return;
                } else {
                    this.loadIssuesWithin24Hours();
                    this.loadIssuesWithinLastWeek();
                    this.loadIssuesMoreThanLastWeek();
                    return;
                }
            }, (error) => {
                alert('invalid URL or the repo is private or limit of 60 API hits has been reached');
                return;
            });
    }
    // this function will fetch all the issues opened in last 24 hours
    loadIssuesWithin24Hours() {
        // using Promises to handle repsonse of api call from service file.
        // hitting api to check if user repo combination exists.
        let baseUrl = this.baseUrl;

        let date: any = new Date().getTime() - 86400000 + 19800000;
        date = new Date(date);
        baseUrl = baseUrl ? baseUrl + `/issues?state=open&per_page=100&since=${date.toISOString()}&sort=updated-asc` : null;
        // now hitting the api for list of issues.
        const observable: any = this.service.hitApiLoadIssues(baseUrl, null);
        observable.toPromise()
            .then((data) => {

                const listOfIssues = JSON.parse(data['_body']);
                const issueWithinDayContainingArray: any = [];

                _.each(listOfIssues, function (issue) {
                    let obj = {};
                    // creating an object to be pushed in arrays.
                    obj = {
                        url: issue.url,
                        htmlUrl: issue.html_url,
                        updateDate: new Date(issue.updated_at)
                    };
                    // condition if last update was within 24 hours from now.
                    issueWithinDayContainingArray.push(obj);
                });
                this.dayCount = issueWithinDayContainingArray.length;
                this.issueWithinDayContainingArray = issueWithinDayContainingArray;
                this.isDayLoading = false;

                // Now since the logic is completed end the animation
                // this.loadIssues();
                return;
            }, (error) => {
                alert('invalid URL or the repo is private');
                return;
            });
    }
    // this function will fetch all the issues opened between last week and prev 24 hours
    loadIssuesWithinLastWeek() {
        // using Promises to handle repsonse of api call from service file.
        // hitting api to check if user repo combination exists.
        let baseUrl = this.baseUrl;

        let date: any = (new Date().getTime() - 604800000) + 19800000;
        date = new Date(date);
        baseUrl = baseUrl ? baseUrl + `/issues?state=open&per_page=100&since=${date.toISOString()}&sort=updated-asc` : null;


        // now hitting the api for list of issues.
        const observable: any = this.service.hitApiLoadIssues(baseUrl, null);
        observable.toPromise()
            .then((data) => {

                const listOfIssues = JSON.parse(data['_body']);
                const issueWithinWeekContainingArray: any = [];
                date = new Date().getTime();
                _.each(listOfIssues, function (issue) {
                    let obj = {};
                    // creating an object to be pushed in arrays.
                    obj = {
                        url: issue.url,
                        htmlUrl: issue.html_url,
                        updateDate: new Date(issue.updated_at)
                    };
                    // condition if last update was within 24 hours from now.
                    if (obj['updateDate'].getTime() < date - 86400000 && obj['updateDate'].getTime() >= date - 604800000) {
                        // condition if last update was betweeen 24 hours and a week from now.
                        issueWithinWeekContainingArray.push(obj);
                    }

                });
                this.weekCount = issueWithinWeekContainingArray.length;
                this.issueWithinWeekContainingArray = issueWithinWeekContainingArray;
                this.moreCount = this.count - (this.dayCount + this.weekCount);
                // Now since the logic is completed end the animation
                this.isWeekLoading = false;
                // this.loadIssuesMoreThanLastWeek();
                // this.loadIssues();
                return;
            }, (error) => {
                alert('invalid URL or the repo is private');
                return;
            });
    }
    // this function will fetch the first 100 issues opened more than a week ago
    loadIssuesMoreThanLastWeek() {
        // using Promises to handle repsonse of api call from service file.
        // hitting api to check if user repo combination exists.
        let baseUrl = this.baseUrl;

        let page = ((this.dayCount + this.weekCount) / 100);
        page = Number(page.toFixed());
        baseUrl = baseUrl ? baseUrl + `/issues?state=open&page=${page}per_page=100&&sort=updated-asc` : null;

        const observable: any = this.service.hitApiLoadIssues(baseUrl, null);
        observable.toPromise()
            .then((data) => {
                const listOfIssues = JSON.parse(data['_body']);
                const issueMoreThanWeekContainingArray: any = [];
                // date = new Date().getTime();
                _.each(listOfIssues, function (issue) {
                    let obj = {};
                    // creating an object to be pushed in arrays.
                    obj = {
                        url: issue.url,
                        htmlUrl: issue.html_url,
                        updateDate: new Date(issue.updated_at)
                    };
                    issueMoreThanWeekContainingArray.push(obj);
                });
                this.issueMoreThanWeekContainingArray = issueMoreThanWeekContainingArray;
                this.isMoreThanWeekLoading = false;
                this.loadAllIssues();
                return;
            }, (error) => {
                alert('invalid URL or the repo is private');
                return;
            });
    }

    // this function fetches all the issues opened
    loadAllIssues() {
        // using Promises to handle repsonse of api call from service file.
        // hitting api to check if user repo combination exists.
        let baseUrl = this.baseUrl;
        this.tempBaseUrl = baseUrl ? baseUrl + '/issues' : null;
        baseUrl = baseUrl ? baseUrl + '/issues?page=1&per_page=100' : null;
        // now hitting the api for list of issues.
        const observable: any = this.service.hitApiLoadIssues(baseUrl, null);
        observable.toPromise()
            .then((data) => {
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
            }, (error) => {
                alert('invalid URL or the repo is private');
                return;
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
                const date = new Date().getTime();
                _.each(listOfIssues, function (issue) {
                    let obj = {};
                    // getting current/now's date and assigning its value in milliseconds to a variable for comparision.
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
            }, (error) => {
                alert('error occured');
            })
            .then((obj) => {
                if (!obj.error) {
                    this.issueWithinDayContainingArray = obj.issueWithinDayContainingArray;
                    this.dayCountTotal = obj.dayCount;
                    this.issueWithinWeekContainingArray = obj.issueWithinWeekContainingArray;
                    this.weekCountTotal = obj.weekCount;
                    this.issueMoreThanWeekContainingArray = obj.issueMoreThanWeekContainingArray;
                    this.moreCountTotal = obj.moreCount;
                    this.totalCount = `   (Total Count: ${this.dayCountTotal + this.weekCountTotal + this.moreCountTotal})`;

                } else {
                    alert('error occured');
                }
                // Now since the logic is completed end the animation
                return;
            });
    }
}
