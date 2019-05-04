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
    products: any[];

    name = '';
    club = '';
    rating = 0;
    description = '';
    baseUrl = 'https://api.github.com/repositories?since=364';
    issuesUrl = [];
    issuesUrlNeeded: any;
    issueWithinDayContainingArray: any[];
    issueWithinWeekContainingArray: any[];
    issueMoreThanWeekContainingArray: any[];
    count: 0;
    dayCount: any;
    weekCount: any;
    moreCount: any;
    isWithinDay = false;
    isWithinWeek = true;
    isMoreThanWeek = false;
    obnj: any;
    ngOnInit() {
        this.baseUrl = this.baseUrlForm;
        this.reloadProducts();
        // this.getData();
    }
    constructor(service: FetchGitApiService, private router: Router) {
        this.service = service;
    }

    getData() {
        this.obnj = this.service.getData(this.baseUrl);
        // observable.subscribe((data) => {
        //     debugger;
        // })
        debugger;
    }
    reloadProducts() {
        const observable = this.service.getPlayers(this.baseUrl);
        observable.subscribe((response) => {
            console.log('google');
            const result_returned = response.json();
            if (result_returned['has_issues'] !== true) {
                alert('has no issues!');
            }
            if (result_returned['private'] === true) {
                alert('this is a private repo');
            }
            this.issuesUrl = _.pluck(result_returned, 'issues_url');
            this.issuesUrlNeeded = result_returned['issues_url'];
            this.baseUrl = this.issuesUrlNeeded.substr(0, this.issuesUrlNeeded.indexOf('{')) + '?state=open';
            debugger;
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
                    // issueContainingArray.push(obj);
                });
                debugger;
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
            // if (result_returned.message === 'Success') {
            //     this.products = result_returned.result;
            // } else {
            //     alert('error occured');
            // }
            // console.log(result_returned);
            // this.products = result.data;
        });
    }

    onDelete(id) {
        this.service.deletePlayer(id).subscribe((response) => {
            const result = response.json();
            if (result.message === 'Success') {
                this.reloadProducts();
            } else {
                alert('error aya');
            }
        });
    }

    onEdit(id) {
        this.router.navigate(['/update'], { queryParams: { id: id } });
    }

    onWithinWeekClick() {
        this.isWithinWeek = !this.isWithinWeek;
        this.isWithinDay = false;
        this.isMoreThanWeek = false;
    }
    onWithinDayClick() {
        this.isWithinDay = !this.isWithinDay;
        this.isWithinWeek = false;
        this.isMoreThanWeek = false;
    }
    onMoreThanWeekClick() {
        this.isMoreThanWeek = !this.isMoreThanWeek;
        this.isWithinDay = false;
        this.isWithinWeek = false;
    }
}
