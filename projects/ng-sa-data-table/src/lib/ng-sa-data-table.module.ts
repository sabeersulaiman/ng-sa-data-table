import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SaDataTableComponent } from './components/data-table/data-table.component';
import { SaColumnDirective } from './directives/column/column.directive';
import { SaTableHeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { SaTableRowComponent } from './components/row/row.component';

@NgModule({
    declarations: [
        SaDataTableComponent,
        SaColumnDirective,
        SaTableHeaderComponent,
        SaTableRowComponent,
    ],
    imports: [CommonModule],
    exports: [SaDataTableComponent, SaColumnDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgSaDataTableModule {}
