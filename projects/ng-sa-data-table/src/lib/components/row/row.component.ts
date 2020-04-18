import { Component, Input, Inject, forwardRef } from '@angular/core';
import { SaDataTableComponent } from '../data-table/data-table.component';

@Component({
    selector: '[saTableRow]',
    templateUrl: './row.component.html',
    styleUrls: ['./row.component.scss'],
})
export class SaTableRowComponent {
    @Input()
    public rowData: any;

    @Input()
    public rowNumber: number;

    constructor(
        @Inject(forwardRef(() => SaDataTableComponent))
        public table: SaDataTableComponent
    ) {}
}
