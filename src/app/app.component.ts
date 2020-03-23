import { Component } from '@angular/core';
import * as FullStory from '@fullstory/browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular Shoppe';

  constructor() {
    const { orgId } = environment;

    // load the FullStory recording snippet if an orgId is set
    if (orgId) {
      FullStory.init({ orgId, debug: false });
    }
  }
}
