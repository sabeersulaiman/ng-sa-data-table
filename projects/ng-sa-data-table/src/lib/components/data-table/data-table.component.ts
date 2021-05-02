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
    OnInit,
    ChangeDetectionStrategy,
    ViewChild,
} from '@angular/core';
import { SaColumnDirective } from '../../directives/column/column.directive';
import { SaTableRowComponent } from '../row/row.component';
import { SaTableFilters } from '../../models/public.models';
import { actionNames } from '../../data/internal.data';
import { SaTablePaginationComponent } from '../pagination/pagination.component';

@Component({
    selector: 'sa-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaDataTableComponent
    implements AfterContentInit, AfterViewInit, OnInit {
    /**
     * data for the table
     */
    private _data: any[];
    @Input()
    public get data() {
        return this._data;
    }
    public set data(v: any[]) {
        this._data = v;
        this._onDataChange();
    }

    /**
     * @deprecated
     * title of the table
     */
    @Input()
    public title: string;

    /**
     * name of the table - replaces the title property
     */
    @Input()
    public tableName: string;

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
     * whether pagination is enabled or not
     */
    @Input()
    public pagination = true;

    /**
     * number of items to be shown in one page
     */
    @Input()
    public perPage = 20;

    /**
     * total number of items available for this table to be shown
     */
    @Input()
    public total: number;

    /**
     * per page item options
     */
    @Input()
    public perPageOptions = [20, 50, 100];

    /**
     * whether there should be an event for the initial load
     */
    @Input()
    public initialLoad = false;

    /**
     * last activated filters on table
     */
    public currentFilterData: SaTableFilters;

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
     * filter change event
     */
    @Output()
    public filter = new EventEmitter<SaTableFilters>();

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

    @ViewChild(SaTablePaginationComponent)
    public paginationInstance: SaTablePaginationComponent;

    @Input()
    public actionsEnabled = true;

    @Input()
    public rowColor: (index: number, rowData: any) => string;

    @Input()
    public selectionCheck: (index: number, rowData: any) => boolean;

    @Input()
    public expandable = false;

    @ContentChild('expansionTemplate')
    public expansionTemplate: TemplateRef<any>;

    @Input()
    public expandHeaderPaddings = {
        paddingTop: '24px',
        paddingLeft: '35px',
        paddingBottom: '24px',
        paddingRight: '35px',
    };

    public get gridCount() {
        let count = this.columns
            ? this.columns.filter((x) => x.visible).length + 1
            : 1;
        if (this.selectable) {
            count += 1;
        }
        if (this.expandable) {
            count += 1;
        }

        return count;
    }

    /**
     * emits an event on row expansion
     */
    @Output()
    public rowExpanded = new EventEmitter<any>();

    /**
     * main DI constructor
     */
    constructor(private _cdr: ChangeDetectorRef) {}

    /**
     * init component
     */
    public ngOnInit() {
        this.currentFilterData = {
            page: 1,
            perPage: this.perPage,
        };
        if (this.initialLoad) {
            this.filter.emit(this.currentFilterData);
        }
    }

    public reset() {
        if (this.paginationInstance) {
            this.paginationInstance.switchPage(1, true);
        } else {
            this.filter.emit({
                page: 1,
                perPage: this.perPage,
            });
        }
    }

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

    public handleAction(action: string) {
        if (action === actionNames.reload) {
            this.reload();
        } else {
            // other actions
        }
    }

    private _constructTableConstraints() {
        if (!this.columns) {
            return;
        }

        const colSizes: string[] = [];

        // if column selection is enabled, there is an extra column for selector
        if (this.selectable) {
            colSizes.push('70px');
        }

        // if row expansion is enabled we also need extra column for expansion
        if (this.expandable) {
            colSizes.push('70px');
        }

        for (const col of this.columns) {
            if (!col.visible) {
                continue;
            }

            const minColSize = col.minSize; // in pixels
            const maxColSize = 1.66; // in frs

            if (col.width) {
                if (typeof col.width === 'number') {
                    // fixed width provided
                    colSizes.push(`${col.width}px`);
                } else {
                    colSizes.push(col.width);
                }
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

    public onPaginationFilterChange(f: SaTableFilters) {
        this.currentFilterData = f;
        this.filter.emit(this.currentFilterData);
    }

    private _onDataChange() {
        this._cdr.detectChanges();
    }

    public onColumnSelectionChange() {
        this._constructTableConstraints();
    }

    public reload() {
        this.filter.emit(this.currentFilterData);
    }

    public setPage(page: number, forceLoad: boolean = false) {
        if (this.paginationInstance) {
            this.paginationInstance.setPage(page, forceLoad);
        }
    }

    public triggerChangeDetection() {
        this._onDataChange();
    }
}
