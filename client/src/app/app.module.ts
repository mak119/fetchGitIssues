import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { products_m } from './productList/product.list.component';
// import { product2_m } from './productList2/product2.list.component';
// import { Product2Service } from './product2.service';
import { GetUrlComponent } from './parentElement/get.url.component';
import { FetchGitApiService } from './fetch.git.api.service';
import { ListOfIssuesComponent } from './parentElement/childListElement/list.of.issues.component';

@NgModule({
  declarations: [
    AppComponent,
    // products_m,
    // product2_m,
    GetUrlComponent,
    ListOfIssuesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: 'update', component: GetUrlComponent },
      { path: 'list', component: ListOfIssuesComponent }
    ])
  ],
  providers: [
    // Product2Service,
    FetchGitApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
