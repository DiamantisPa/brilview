import { Component, OnInit } from '@angular/core';
import { LumiDataService } from './data.service';

@Component({
    selector: 'bv-lumi-inspector',
    templateUrl: './lumi-inspector.component.html',
    styleUrls: ['./lumi-inspector.component.css']
})
export class LumiInspectorComponent implements OnInit {

    lumiData = [];
    constructor(private lumiDataService: LumiDataService) { }

    ngOnInit() {
        this.lumiData = this.lumiDataService.lumiData;
    }

}
