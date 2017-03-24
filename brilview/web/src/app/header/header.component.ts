import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bv-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    @Output('burgerClick') burgerClick = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

}
