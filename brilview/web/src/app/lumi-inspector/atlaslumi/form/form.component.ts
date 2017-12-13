import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'li-atlaslumi-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    fillnum = null;
    brilLumiType = 'Online';
    brilNormtag = undefined;
    brilLumiTypeOptions = [
        'Online', 'PLTZERO', 'HFOC', 'HFET', 'BCM1F', 'PXL', 'DT', '-normtag-'
    ];
    @Output() onAtlasQuery = new EventEmitter<{}>();
    @Output() onBrilQuery = new EventEmitter<{}>();

    constructor() { }

    ngOnInit() {
    }

    clickAtlasQuery() {
        this.onAtlasQuery.emit({fillnum: this.fillnum});
    }

    clickBrilQuery() {
        this.onBrilQuery.emit({
            type: this.brilLumiType,
            normtag: this.brilNormtag,
            unit: 'hz/ub',
            byls: true
        });
    }

}
