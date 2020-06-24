import {
    Component,
    Input,
    ElementRef,
    Output,
    EventEmitter,
    QueryList,
} from '@angular/core';
import { SaColumnDirective } from '../../directives/column/column.directive';
import { actionNames } from '../../data/internal.data';

@Component({
    selector: 'sa-table-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class SaTableHeaderComponent {
    @Input()
    public title: string;

    @Input()
    public headerExtraRight: ElementRef;

    @Input()
    public headerExtraLeft: ElementRef;

    @Output()
    public action = new EventEmitter<string>();

    @Input()
    public columns: SaColumnDirective[];

    @Output()
    public columnChanged = new EventEmitter<SaColumnDirective>();

    @Input()
    public actionsEnabled = true;

    public selectingColumn = false;

    public actions = actionNames;

    constructor() {}

    public handleAction(action: string) {
        this.action.emit(action);
    }

    public triggerVisibility(c: SaColumnDirective) {
        c.visible = !c.visible;
        this.columnChanged.emit(c);
    }
}
