import { Directive, Input, ContentChild, TemplateRef } from '@angular/core';
import { overflowModes } from '../../data/public.data';

@Directive({
    selector: 'sa-column',
})
export class SaColumnDirective {
    @Input()
    public header: string;

    @Input()
    public property: string;

    @Input()
    public width: number | string;

    @Input()
    public visible = true;

    @Input()
    public minSize = 150;

    @Input()
    public colPaddings = {
        paddingTop: '22px',
        paddingLeft: '35px',
        paddingBottom: '22px',
        paddingRight: '35px',
    };

    @Input()
    public headerPaddings = {
        paddingTop: '24px',
        paddingLeft: '35px',
        paddingBottom: '24px',
        paddingRight: '35px',
    };

    @Input()
    public textAlign = 'left';

    @Input()
    public overflow = overflowModes.hidden;

    @ContentChild('colTemplate')
    public columnTemplate: TemplateRef<any>;

    constructor() {}
}
