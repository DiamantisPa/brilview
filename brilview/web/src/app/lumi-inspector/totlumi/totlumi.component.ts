import { Component, OnInit } from '@angular/core';
import { LumiDataService } from '../data.service';

@Component({
    selector: 'bv-lumi-inspector',
    templateUrl: './totlumi.component.html',
    styleUrls: ['./totlumi.component.css', '../lumi-inspector.css']
})
export class TotlumiComponent implements OnInit {

    lumiData = [];
    constructor(private lumiDataService: LumiDataService) { }

    ngOnInit() {
        this.lumiData = this.lumiDataService.lumiData;
    }

}
