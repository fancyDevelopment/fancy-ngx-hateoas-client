import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ViewBase } from 'fancy-ngx-hateoas-client';

@Component({
  standalone: true,
  imports: [JsonPipe],
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css']
})
export class View1Component extends ViewBase {
}
