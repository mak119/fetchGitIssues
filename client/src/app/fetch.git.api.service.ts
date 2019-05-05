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

    public getData(baseUrl) {
        const observable = this.http.get(baseUrl);
        observable.subscribe((response) => {
            console.log('google');
            const result_returned = response.json();
            this.issuesUrl = _.pluck(result_returned, 'issues_url');
            this.issuesUrlNeeded = result_returned[99]['issues_url'];
            baseUrl = this.issuesUrlNeeded.substr(0, this.issuesUrlNeeded.indexOf('{')) + '?state=open';
            debugger;
            const observable2 = this.http.get(baseUrl);
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
                    if (obj['updateDate'].getTime() > date - 86400000) {
                        issueWithinDayContainingArray.push(obj);
                    } else if (obj['updateDate'].getTime() < date - 86400000 && obj['updateDate'].getTime() > date - 604800000) {
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
                    this.issueWithinWeekContainingArray = issueWithinWeekContainingArray;
                    this.issueMoreThanWeekContainingArray = issueMoreThanWeekContainingArray;
                    const objectForReturn = {
                        count: count,
                        issueWithinDayContainingArray: issueWithinDayContainingArray,
                        issueWithinWeekContainingArray: issueWithinWeekContainingArray,
                        issueMoreThanWeekContainingArray: issueMoreThanWeekContainingArray
                    };
                    this.objectForReturn = objectForReturn;
                    return this.objectForReturn;
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

    public postPlayers(name, club, rating, description, image: any) {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('club', club);
        formData.append('rating', '' + rating);
        formData.append('description', description);
        formData.append('image', image);

        return this.http.post(this.baseUrl + '/upload', formData);
    }

    public deletePlayer(id) {
        return this.http.delete(this.baseUrl + '/' + id);
    }

    public getById(id) {
        return this.http.get(this.baseUrl + '/' + id);
    }
}
