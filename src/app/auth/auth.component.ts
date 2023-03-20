import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  type: string = '';
  sub: Subscription | undefined;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sub = this.route.url.subscribe((url) => {
      this.type = url[0].path;
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
