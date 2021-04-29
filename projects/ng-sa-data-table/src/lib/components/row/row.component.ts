import {
    Component,
    Input,
    Inject,
    forwardRef,
    Output,
    EventEmitter,
    OnInit,
    TemplateRef,
} from '@angular/core';
import { SaDataTableComponent } from '../data-table/data-table.component';
import { IfStmt } from '@angular/compiler';

@Component({
    selector: '[saTableRow]',
    templateUrl: './row.component.html',
    styleUrls: ['./row.component.scss'],
})
export class SaTableRowComponent implements OnInit {
    @Input()
    public rowData: any;

    @Input()
    public rowNumber: number;

    @Input()
    public rowColor: (index: number, data: any) => string;

    @Output()
    public selection = new EventEmitter<SaTableRowComponent>();

    @Output()
    public deSelection = new EventEmitter<SaTableRowComponent>();

    @Input()
    public selectionCheck: (index: number, rowData: any) => boolean;

    public selected = false;

    @Input()
    public expansionTemplate: TemplateRef<any>;

    private _expanded = false;

    public get expanded() {
        return this._expanded;
    }

    constructor(
        @Inject(forwardRef(() => SaDataTableComponent))
        public table: SaDataTableComponent
    ) {}

    public ngOnInit() {
        if (this.selectionCheck) {
            this.selected = this.selectionCheck(this.rowNumber, this.rowData);
            this.selected ? console.log(this.rowNumber, 'selected') : null;
        }
    }

    public select(emit = false) {
        this.selected = true;

        if (emit) {
            this.selection.emit(this);
        }
    }

    public deSelect(emit = false) {
        this.selected = false;

        if (emit) {
            this.deSelection.emit(this);
        }
    }

    public onSelectionToggle() {
        if (this.selected) {
            this.deSelect(true);
        } else {
            this.select(true);
        }
    }

    public getBackgroundColor(index: number, rowData: any) {
        if (this.rowColor) {
            const color = this.rowColor(index, rowData);
            if (color && color.trim().length > 0) {
                return color.trim();
            } else {
                return this._indexBasedColor(index);
            }
        } else {
            return this._indexBasedColor(index);
        }
    }

    public onExpandToggle() {
        this._expanded = !this._expanded;
        if (this._expanded) {
            this.table.rowExpanded.emit(this.rowData);
        }
    }

    private _indexBasedColor(index: number) {
        if (index % 2 === 1) {
            return 'rgba(242, 245, 248, 0.6)';
        } else {
            return '#fff';
        }
    }
}
