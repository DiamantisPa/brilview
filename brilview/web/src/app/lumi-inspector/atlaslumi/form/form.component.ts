import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'li-atlaslumi-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    fillnum = 5020;
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
        console.log('clickAtlasQuery');
        this.onAtlasQuery.emit({fillnum: this.fillnum});
    }

    clickBrilQuery() {
        this.onBrilQuery.emit({
            begin: this.fillnum,
            end: this.fillnum,
            type: this.brilLumiType,
            normtag: this.brilNormtag,
            unit: 'hz/ub',
            byls: true
        });
    }

}
