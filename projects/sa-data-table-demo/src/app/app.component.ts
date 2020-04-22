import { Component, ChangeDetectorRef } from '@angular/core';
import { tableData } from './data';
import { overflowModes, SaTableFilters } from 'ng-sa-data-table';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    data = tableData;

    tData = [];

    tableOverflowModes = overflowModes;

    weData = 'DOB Placeholder.';

    constructor(private _cdr: ChangeDetectorRef) {}

    public handleShonan() {
        alert('Shonan Jump');
    }

    public onSelectionChange(d) {
        console.log(d);
    }

    public deleteUser(d) {
        console.log(d);
    }

    public onTableReload(filter: SaTableFilters) {
        this.tData = this._loadPage(filter.page, filter.perPage);
        this._cdr.detectChanges();

        console.log(filter, 'Filtering....');
    }

    private _loadPage(page: number, perPage: number): any[] {
        const min = (page - 1) * perPage;
        const max = page * perPage;
        return this.data.filter((_x, i) => {
            if (i >= min && i < max) {
                return true;
            } else {
                return false;
            }
        });
    }
}
