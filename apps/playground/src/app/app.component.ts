import { Component, OnInit } from '@angular/core';
import { HateoasClient } from 'fancy-ngx-hateoas-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'playground';

  constructor(private hateoasClient: HateoasClient) {}

  ngOnInit() {
  }
}
