import {
    Component,
    Input,
    Inject,
    forwardRef,
    Output,
    EventEmitter,
} from '@angular/core';
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

    @Output()
    public selection = new EventEmitter<SaTableRowComponent>();

    @Output()
    public deSelection = new EventEmitter<SaTableRowComponent>();

    public selected = false;

    constructor(
        @Inject(forwardRef(() => SaDataTableComponent))
        public table: SaDataTableComponent
    ) {}

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
}
