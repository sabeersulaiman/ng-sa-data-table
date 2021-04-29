import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { tableData } from './data';
import { overflowModes, SaTableFilters } from 'ng-sa-data-table';
import { dashData } from './dash-data';
import { SaDataTableComponent } from 'ng-sa-data-table';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @ViewChild(SaDataTableComponent)
    public table: SaDataTableComponent;

    data = tableData;

    tData = [];

    dashData;

    tableOverflowModes = overflowModes;

    weData = 'DOB Placeholder.';

    actionsEnabled = true;

    pageSelection = 1;

    selections: any[];

    constructor(private _cdr: ChangeDetectorRef) {}

    public handleShonan() {
        alert('Shonan Jump');
    }

    public onSelectionChange(d) {
        console.log(d);
        this.selections = d;
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

    public loadDData() {
        setTimeout(
            (() => {
                this.dashData = dashData.data.data;
            }).bind(this),
            3000
        );
    }

    public getTransactionStatus(tran: any) {
        switch (tran.status_id) {
            case 1:
                return 'success';
            case 2:
                return 'pending';
            default:
                return 'failed';
        }
    }

    public findRowColorBySelection(i: number, d: any): string {
        if (!this.selections) {
            return null;
        }

        const selected = this.selections.find((x) => x.id === d.id);

        if (selected) {
            return '#ECF0F4';
        }
    }

    public isSelected(i: number, d: any) {
        if (this.selections && this.selections.find((x) => x.id === d.id)) {
            return true;
        } else {
            return false;
        }
    }

    public onRowExpanded(d) {
        console.log(d);
    }
}
