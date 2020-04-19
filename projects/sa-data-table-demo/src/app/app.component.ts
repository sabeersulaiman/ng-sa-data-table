import { Component } from '@angular/core';
import { tableData } from './data';
import { overflowModes } from 'ng-sa-data-table';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    data = tableData;

    tableOverflowModes = overflowModes;

    public handleShonan() {
        alert('Shonan Jump');
    }

    public onSelectionChange(d) {
        console.log(d);
    }
}
