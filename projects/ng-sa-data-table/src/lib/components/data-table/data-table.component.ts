import {
    Component,
    Input,
    ContentChildren,
    QueryList,
    AfterContentInit,
    ContentChild,
    TemplateRef,
    ViewChildren,
    ChangeDetectorRef,
    AfterViewInit,
    Output,
    EventEmitter,
} from '@angular/core';
import { SaColumnDirective } from '../../directives/column/column.directive';
import { SaTableRowComponent } from '../row/row.component';

@Component({
    selector: 'sa-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
})
export class SaDataTableComponent implements AfterContentInit, AfterViewInit {
    /**
     * data for the table
     */
    @Input()
    public data: any[];

    /**
     * title of the table
     */
    @Input()
    public title: string;

    /**
     * scroll bar visibility toggle
     */
    @Input()
    public scrollbarVisible = true;

    /**
     * whether selections are enabled or not
     */
    @Input()
    public selectable = true;

    /**
     * columns query list
     */
    @ContentChildren(SaColumnDirective)
    public columnQueryList: QueryList<SaColumnDirective>;

    /**
     * column array to be used for the ops
     */
    public columns: SaColumnDirective[];

    /**
     * extra content to be shown in header right
     */
    @ContentChild('headerExtraRight')
    public headerExtraRight: TemplateRef<any>;

    /**
     * extra content to be shown in header left
     */
    @ContentChild('headerExtraLeft')
    public headerExtraLeft: TemplateRef<any>;

    /**
     * rows currently avaialble in the data table
     */
    @ViewChildren(SaTableRowComponent)
    public rows: QueryList<SaTableRowComponent>;

    /**
     * selection changed event
     */
    @Output()
    public selection = new EventEmitter<any[]>();

    /**
     * selected rows
     */
    public selectedRows: SaTableRowComponent[] = [];

    /**
     * table styles
     */
    public tableStyles = {
        gridTemplateColumns: '',
    };

    /**
     * get the selected row data
     */
    public get selectionData(): any[] {
        return this.selectedRows.map((x) => x.rowData);
    }

    /**
     * main DI constructor
     */
    constructor(private _cdr: ChangeDetectorRef) {}

    public ngAfterContentInit() {
        // create the required styles and data for the table
        this._handleColumnChanges();
        this.columnQueryList.changes.subscribe(
            this._handleColumnChanges.bind(this)
        );
    }

    public ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    private _handleColumnChanges() {
        if (!this.columnQueryList) {
            return;
        }

        this.columns = this.columnQueryList.toArray();
        this._constructTableConstraints();
    }

    public handleAction(action: string) {}

    private _constructTableConstraints() {
        if (!this.columns) {
            return;
        }

        const colSizes: string[] = [];

        // if column selection is enabled, there is an extra column for selector
        if (this.selectable) {
            colSizes.push('70px');
        }

        for (const col of this.columns) {
            if (!col.visible) {
                continue;
            }

            const minColSize = col.minSize; // in pixels
            const maxColSize = 1.66; // in frs

            if (col.width) {
                // fixed width provided
                colSizes.push(`${col.width}px`);
            } else {
                // use minmax col width
                colSizes.push(`minmax(${minColSize}px, ${maxColSize}fr)`);
            }
        }

        this.tableStyles.gridTemplateColumns = colSizes.join(' ');
    }

    public onSelectionChange() {
        this.selectedRows = this.rows.filter((r) => r.selected);
        this.selection.emit(this.selectionData);
    }

    public selectAllRows() {
        this.rows.forEach((r) => r.select());
        this.onSelectionChange();
    }

    public deSelectAllRows() {
        this.rows.forEach((r) => r.deSelect());
        this.onSelectionChange();
    }

    public onToggleFullSelection() {
        if (this.rows.length === this.selectedRows.length) {
            this.deSelectAllRows();
        } else {
            this.selectAllRows();
        }
    }
}
