import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GetUrlComponent } from './parentElement/get.url.component';
import { FetchGitApiService } from './fetch.git.api.service';
import { ListOfIssuesComponent } from './parentElement/childListElement/list.of.issues.component';

@NgModule({
  declarations: [
    AppComponent,
    GetUrlComponent,
    ListOfIssuesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: 'input', pathMatch: 'full' },
      { path: 'input', component: GetUrlComponent }
    ])
  ],
  providers: [
    FetchGitApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
