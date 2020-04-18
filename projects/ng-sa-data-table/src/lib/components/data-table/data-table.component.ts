import {
    Component,
    Input,
    ContentChildren,
    QueryList,
    AfterContentInit,
    ContentChild,
    TemplateRef,
} from '@angular/core';
import { SaColumnDirective } from '../../directives/column/column.directive';

@Component({
    selector: 'sa-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
})
export class SaDataTableComponent implements AfterContentInit {
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
     * columns query list
     */
    @ContentChildren(SaColumnDirective)
    public columnQueryList: QueryList<SaColumnDirective>;

    /**
     * column array to be used for the ops
     */
    public columns: SaColumnDirective[];

    /**
     * extra content to be shown in header
     */
    @ContentChild('headerExtra')
    public headerExtra: TemplateRef<any>;

    /**
     * table styles
     */
    public tableStyles = {
        gridTemplateColumns: '',
    };

    /**
     * main DI constructor
     */
    constructor() {}

    public ngAfterContentInit() {
        // create the required styles and data for the table
        this._handleColumnChanges();
        this.columnQueryList.changes.subscribe(
            this._handleColumnChanges.bind(this)
        );
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
}
