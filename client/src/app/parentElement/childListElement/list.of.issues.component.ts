// importing libraries and files required by this file
import { Component, OnInit, Input } from '@angular/core';
import { FetchGitApiService } from '../../fetch.git.api.service';
import * as _ from 'underscore';

// Component decorator
@Component({
    // selector is basically a custom html tag for this component
    selector: 'app-movie-list-mak',
    // path of the html file for this component
    templateUrl: './list.of.issues.component.html'
})

export class ListOfIssuesComponent implements OnInit {
    // this takes the value of baseUrlForm from its parent component using Input decorator.
    @Input() baseUrlForm: string;
    // specifying service class
    service: FetchGitApiService;
    // initializing variables
    baseUrl: any;
    issuesUrl: any;
    issueWithinDayContainingArray: any[];
    issueWithinWeekContainingArray: any[];
    issueMoreThanWeekContainingArray: any[];
    count: 0;
    dayCount: any;
    weekCount: any;
    moreCount: any;

    // this is a life cycle hook which is triggered on initialization of this component
    ngOnInit() {
        this.baseUrl = this.baseUrlForm;
        // calling the business logic containing function
        this.loadIssues();
    }
    // doing dependency injection i.e. injecting this service into this component so it can have access to the service
    constructor(service: FetchGitApiService) {
        this.service = service;
    }

    // function containing all the business logic
    loadIssues() {
        // using observables to handle repsonse of api call from service file.
        // hitting api to check if user repo combination exists.
        const observable = this.service.hitApiLoadIssues(this.baseUrl);
        // subscribing to the response
        observable.subscribe((response) => {
            // converting the response to a much more readable json format
            const result_returned = response.json();
            // checking if the repo is private or not
            if (result_returned['private'] === true) {
                alert('this is a private repo');
            }
            // check to ensure that the repo has issues
            // tslint:disable-next-line:max-line-length
            this.issuesUrl = (result_returned['has_issues'] === true && result_returned['open_issues_count'] > 0) ? result_returned['issues_url'] : null;
            // appending a query to only hit api for open issues
            this.baseUrl = this.issuesUrl ? this.issuesUrl.substr(0, this.issuesUrl.indexOf('{')) + '?state=open' : null;
            // now hitting the api for list of issues.
            const observable2 = this.service.hitApiLoadIssues(this.baseUrl);
            // subscribing to the response of the api.
            observable2.subscribe((data) => {
                // converting the response to a more readable and accessible json format.
                const listOfIssues = data.json();
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
                // if count of issues was more than 0, give value of local variables to global ones to be accessed by html
                if (count > 0) {
                    this.count = count;
                    this.issueWithinDayContainingArray = issueWithinDayContainingArray;
                    this.dayCount = issueWithinDayContainingArray.length;
                    this.issueWithinWeekContainingArray = issueWithinWeekContainingArray;
                    this.weekCount = issueWithinWeekContainingArray.length;
                    this.issueMoreThanWeekContainingArray = issueMoreThanWeekContainingArray;
                    this.moreCount = issueMoreThanWeekContainingArray.length;
                } else {
                    alert('error occured');
                }
            }, // this block is like a catch block which executes when api hit has any error
                (reject) => {
                    alert('The repo has no open issues!');
                });
        }, // this block is like a catch block which executes when api hit has any error
            (reject) => {
                alert('invalid url-entered, please go-back and re-enter OR the repo is private');
            });
    }
}
