import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fetchgitissues';


  constructor(private router: Router) { }
  navigate() {
    // this.router.navigate(['/update'], { queryParams: { loadParent: 'load' } });
    this.router.navigateByUrl('/update');
  }
}
