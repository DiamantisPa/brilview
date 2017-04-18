import { Component, OnInit, Input } from '@angular/core';
import * as ArrStat from '../../utils/arr-stat';

@Component({
    selector: 'li-stats',
    templateUrl: './stats.component.html',
    styleUrls: [
        '../lumi-inspector.component.css',
        './stats.component.css']
})
export class StatsComponent implements OnInit {

    @Input('chart') chart;
    stats = [];

    constructor() { }

    ngOnInit() {
    }

    protected getSeries() {
        return this.chart.getNativeChartElement().data;
    }

    recalculate() {
        const series = this.getSeries();
        const new_stats = [];
        let values = null;
        for (const s of series) {
            values = s.y.filter(Number.isFinite);
            new_stats.push({
                name: s.name,
                min: ArrStat.min(values),
                max: ArrStat.max(values),
                mean: ArrStat.mean(values),
                variance: ArrStat.variance(values),
                std: ArrStat.standardDeviation(values),
                rms: ArrStat.rms(values)
            });
        }
        this.stats = new_stats;
    }
}
