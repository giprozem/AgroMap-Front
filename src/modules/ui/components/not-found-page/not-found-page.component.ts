import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  standalone: true,
  imports: [TranslateModule, RouterModule],
})
export class NotFoundPageComponent implements OnInit {
  ngOnInit(): void {}
}
