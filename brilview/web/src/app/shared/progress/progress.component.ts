import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'bv-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

    @Input() progress: number;
    @Input() status: string;

    constructor() { }

    ngOnInit() {
    }

}
