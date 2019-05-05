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
  // this is to make directives from current module available to other directives in current module
  //  Declare views to make them privately available in this module.
  declarations: [
    AppComponent,
    GetUrlComponent,
    ListOfIssuesComponent
  ],
  // Makes exported declarations of other modules available in current module
  // This is where you import other modules
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
  // registering the service as a provider to all the components i.e services that can be injected into model's views
  // make services and values known to Dependency Injection
  providers: [
    FetchGitApiService
  ],
  // calls the AppComponent class on the very beginning.
  bootstrap: [AppComponent]
})
export class AppModule { }
