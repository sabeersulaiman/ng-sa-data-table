import { Component } from '@angular/core';
import { tableData } from './data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    data = tableData;

    public handleShonan() {
        alert('Shonan Jump');
    }
}
