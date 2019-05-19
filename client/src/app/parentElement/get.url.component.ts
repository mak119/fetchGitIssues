// importing libraries and files required for this file
import { Component } from '@angular/core';

// Component decorator
@Component({
    // selector is basically a custom html tag for this component
    selector: 'app-create-mak',
    // path for the html file of this component
    templateUrl: './get.url.component.html'
})

export class GetUrlComponent {
    baseDataUrl: string;
    // initializing variable that controls if parent component is visible or child.
    // isSaveClicked == false ? display parent component(url entering form) : display list of issues;
    isSaveClicked = false;
    baseUrl: any;
    errorMessage: any;

    // this function handles going back from list of issues to url entering form page.
    goBack() {
        // if isSaveClicked value is true, reassign values of url and error to blank and isSaveClicked value to false
        if (this.isSaveClicked === true) {
            this.baseUrl = '';
            this.errorMessage = '';
            // this makes the parent component visible again.
            this.isSaveClicked = false;
        }
    }
    onSave() {
        // removing the white spaces from end
        this.baseUrl = this.baseUrl.indexOf(' ') > 0 ? this.baseUrl.substr(0, this.baseUrl.indexOf(' ')) : this.baseUrl;
        // condition to check if entered url is valid or not.
        // length > 22 as minimum url can be : https://github.com/x/x which is of length 21
        if (this.baseUrl.substr(0, 18) === 'https://github.com' && this.baseUrl.length > 21) {
            this.errorMessage = '';
            // changing isSaveClicked value to true makes child component appear.
            this.isSaveClicked = true;
            // recreating url to the one specified to hit git api.
            const baseData = 'https://api.github.com/repos' + this.baseUrl.substr(18);
            // assigning value to baseDataurl as it is mapped to baseUrlForm variable in child component.
            this.baseDataUrl = baseData;
        } else {
            this.errorMessage = '*please enter a valid url of format https://github.com/:user/:repo';
        }
    }
}
