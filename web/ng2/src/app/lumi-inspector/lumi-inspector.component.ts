import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
    selector: 'bv-lumi-inspector',
    templateUrl: './lumi-inspector.component.html',
    styleUrls: ['./lumi-inspector.component.css']
})
export class LumiInspectorComponent implements OnInit {

    lumiData = [];
    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.lumiData = this.dataService.lumiData;
    }

}
