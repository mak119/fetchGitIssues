import { Component, OnInit, Input } from '@angular/core';
import { FetchGitApiService } from '../../fetch.git.api.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';

@Component({
    selector: 'app-movie-list-mak',
    templateUrl: './list.of.issues.component.html',
    styleUrls: ['./list.of.issues.component.css'],
    providers: [FetchGitApiService]
})

export class ListOfIssuesComponent implements OnInit {
    @Input() baseUrlForm: string;
    service: FetchGitApiService;

    baseUrl: any;
    issuesUrl: any;
    issueWithinDayContainingArray: any[];
    issueWithinWeekContainingArray: any[];
    issueMoreThanWeekContainingArray: any[];
    count: 0;
    dayCount: any;
    weekCount: any;
    moreCount: any;
    ngOnInit() {
        this.baseUrl = this.baseUrlForm;
        this.reloadProducts();
    }
    constructor(service: FetchGitApiService, private router: Router) {
        this.service = service;
    }

    reloadProducts() {
        const observable = this.service.getPlayers(this.baseUrl);
        observable.subscribe((response) => {
            const result_returned = response.json();
            if (result_returned['has_issues'] !== true) {
                alert('has no issues!');
            }
            if (result_returned['private'] === true) {
                alert('this is a private repo');
            }
            this.issuesUrl = result_returned['issues_url'];
            this.baseUrl = this.issuesUrl.substr(0, this.issuesUrl.indexOf('{')) + '?state=open';
            const observable2 = this.service.getPlayers(this.baseUrl);
            observable2.subscribe((data) => {
                const listOfIssues = data.json();
                const count = listOfIssues.length;
                const issueWithinDayContainingArray = [];
                const issueWithinWeekContainingArray = [];
                const issueMoreThanWeekContainingArray = [];
                _.each(listOfIssues, function (issue) {
                    let obj = {};
                    const date = new Date().getTime();
                    obj = {
                        url: issue.url,
                        htmlUrl: issue.html_url,
                        updateDate: new Date(issue.updated_at)
                    };
                    if (obj['updateDate'].getTime() >= date - 86400000) {
                        issueWithinDayContainingArray.push(obj);
                    } else if (obj['updateDate'].getTime() < date - 86400000 && obj['updateDate'].getTime() >= date - 604800000) {
                        issueWithinWeekContainingArray.push(obj);
                    } else {
                        issueMoreThanWeekContainingArray.push(obj);
                    }
                });
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
            });
        });
    }
}
