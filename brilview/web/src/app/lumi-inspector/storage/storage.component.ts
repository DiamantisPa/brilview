import { Component, OnInit } from '@angular/core';

import { LumiDataService } from '../data.service';

import * as FileSaver from 'file-saver';

@Component({
    selector: 'li-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

    lumiData = [];
    hiddenStorageTable = true;

    constructor(private lumiDataService: LumiDataService) { }

    ngOnInit() {
        this.lumiData = this.lumiDataService.lumiData;
    }

    // openLumiDataJSON(id) {
    //     const popup = window.open('', 'json', '');
    //     popup.document.body.innerHTML =
    //         '<pre>' +
    //         JSON.stringify(
    //             this.dataService.getLumiDataFromStorage(id)['data'],
    //             null,
    //             0) +
    //         '</pre>';
    // }

    removeLumiData(id) {
        this.lumiDataService.removeLumiDataFromStorage(id);
    }

    clearAllLumiData() {
        this.lumiDataService.clearLumiDataStorage();
    }

    openLumiDataCSV(id) {
        const data = this.lumiDataService.getLumiDataFromStorage(id)['data'];
        const keys = ['fillnum', 'runnum', 'lsnum', 'tssec', 'delivered', 'recorded', 'pileup'];
        const len = data[keys[0]].length;
        let csv = keys.join(',') + '\r\n';
        for (let i = 0; i < len; ++i) {
            let line = '';
            for (const k of keys) {
                if (line) {
                    line += ',';
                }
                if (i < data[k].length) {
                    line += data[k][i];
                }
            }
            csv += line + '\r\n';
        }
        const popup = window.open('', 'csv', '');
        popup.document.body.innerHTML = '<pre>' + csv + '</pre>';
    }

    saveLumiDataCSV(id, name) {
        console.log('save lumi data csv id, name', id, name);
        const data = this.lumiDataService.getLumiDataFromStorage(id)['data'];
        console.log('save lumi data csv data', data);    
        let keys;
        if (name.includes('atlaslumi')) {
            keys = ['fillnum', 'runnum', 'lsnum', 'tssec', 'delivered', 'recorded', 'pileup'];
        } else {
            keys = ['single_fillnum', 'timestamp', 'lumi_totinst'];
        }
        console.log('save lumi data csv keys', keys); 
        const len = data[keys[0]].length;
        console.log('save lumi data csv len', len); 
        let csv = keys.join(',') + '\r\n';
        for (let i = 0; i < len; ++i) {
            let line = '';
            for (const k of keys) {
                if (line) {
                    line += ',';
                }
                console.log('save lumi data csv data[k]', data[k]); 
                if (i < data[k].length) {
                    line += data[k][i];
                }
            }
            csv += line + '\r\n';
        }
        const blob = new Blob([csv], {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(blob, name);
    }

}
