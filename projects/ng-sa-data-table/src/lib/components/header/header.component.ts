import {
    Component,
    Input,
    ElementRef,
    Output,
    EventEmitter,
} from '@angular/core';

@Component({
    selector: 'sa-table-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class SaTableHeaderComponent {
    @Input()
    public title: string;

    @Input()
    public headerExtra: ElementRef;

    @Output()
    public action = new EventEmitter<string>();

    constructor() {}

    public handleAction(action: string) {
        this.action.emit(action);
    }
}
