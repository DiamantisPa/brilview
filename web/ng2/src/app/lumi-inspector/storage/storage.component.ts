import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

@Component({
    selector: 'li-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

    lumiData = [];
    hiddenStorageTable = true;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.lumiData = this.dataService.lumiData;
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
        this.dataService.removeLumiDataFromStorage(id);
    }

    openLumiDataCSV(id) {
        const data = this.dataService.getLumiDataFromStorage(id)['data'];
        const keys = ['fillnum', 'runnum', 'lsnum', 'tssec', 'delivered', 'recorded'];
        const len = data[keys[0]].length;
        let csv = keys.join(',') + '\r\n';
        for (let i = 0; i < len; ++i) {
            let line = '';
            for (const k of keys) {
                if (line) {
                    line += ',';
                }
                line += data[k][i];
            }
            csv += line + '\r\n';
        }
        const popup = window.open('', 'csv', '');
        popup.document.body.innerHTML = '<pre>' + csv + '</pre>';
    }

}
