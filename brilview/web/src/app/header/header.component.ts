import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { docURLFromRouteURL } from '../doc-urls';

@Component({
    selector: 'bv-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    @Output('burgerClick') burgerClick = new EventEmitter();
    public helpLink = docURLFromRouteURL(null);

    constructor(private router: Router) {
        this.router.events.subscribe((val) => {
            this.helpLink =
                docURLFromRouteURL(this.router.routerState.snapshot.url);
        });
    }

    ngOnInit() {
    }

}
