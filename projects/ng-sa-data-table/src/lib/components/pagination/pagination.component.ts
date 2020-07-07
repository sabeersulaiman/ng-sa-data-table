import {
    Component,
    Input,
    EventEmitter,
    OnInit,
    Output,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { SaTableFilters } from '../../models/public.models';

@Component({
    selector: 'sa-table-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaTablePaginationComponent implements OnInit, AfterViewInit {
    private _perPage: number;

    @Input()
    public get perPage() {
        return this._perPage;
    }
    public set perPage(val) {
        this._perPage = val;
        this._setPerPage(val);
        this._loadPaginationItems();
    }

    private _total: number;
    @Input()
    public get total() {
        return this._total;
    }
    public set total(v) {
        this._total = v;
        this._loadPaginationItems();
    }

    public page = 1;

    private _perPageOptions: number[];
    @Input()
    public get perPageOptions() {
        return this._perPageOptions;
    }
    public set perPageOptions(v: number[]) {
        this._perPageOptions = v;
        this._setPerPage(this.perPage);
    }

    @Output()
    public pageChange = new EventEmitter<SaTableFilters>();

    @ViewChild('perPage')
    public perPagePicker: ElementRef<HTMLSelectElement>;

    public pages: Page[];

    public lastPage: number;

    public initComplete = false;

    constructor(private _cdr: ChangeDetectorRef) {}

    public ngOnInit() {
        this.initComplete = true;
        this._loadPaginationItems();
    }

    public ngAfterViewInit() {
        this._setPerPage(this._perPage);
    }

    private _setPerPage(p: number) {
        if (
            this.perPageOptions &&
            this.perPagePicker &&
            this.perPagePicker.nativeElement
        ) {
            if (!this.perPageOptions.find((x) => x === this.perPage)) {
                // this item is not in the perpage list add it
                this.perPageOptions.push(this.perPage);
            }

            this._cdr.detectChanges();

            this.perPagePicker.nativeElement.value = p.toString();
        }
    }

    private _loadPaginationItems() {
        if (!this.initComplete) {
            return;
        }

        if (
            !this.perPage ||
            !this.total ||
            !this.perPageOptions ||
            this.perPageOptions.length === 0
        ) {
            console.error(
                `Pagination if enabled require the user to provide the total pages,
                 valid per page options and the data to be shown per page. Inputs: (total, perPageItems, perPage)`
            );
            return;
        }

        // find max possible page
        const lastPage = Math.ceil(this.total / this.perPage);

        // find the possible pages
        const pages: Page[] = [];

        // add the first 3 pages
        this._addPages([1, 2], lastPage, pages);

        // add the 3 pages before the current page
        this._addPages(
            [
                this.page - 2,
                this.page - 1,
                this.page,
                this.page + 1,
                this.page + 2,
            ],
            lastPage,
            pages
        );

        // add the last three pages
        this._addPages([lastPage - 1, lastPage], lastPage, pages);

        this.pages = pages;
        this.lastPage = lastPage;
        this._cdr.detectChanges();
    }

    private _addPages(pageArray: number[], lastPage: number, pages: Page[]) {
        pageArray.forEach((p) =>
            this._addToArrayIfValidPage(lastPage, pages, p)
        );
    }

    private _addToArrayIfValidPage(
        lastPage: number,
        pages: Page[],
        toBeAdded: number
    ) {
        if (toBeAdded >= 1 && toBeAdded <= lastPage) {
            if (!pages.find((x) => x.page === toBeAdded)) {
                // if there is discontinuity - handle it
                const clp = pages[pages.length - 1];

                if (
                    clp &&
                    toBeAdded &&
                    clp.page !== toBeAdded - 1 &&
                    !clp.nonPage
                ) {
                    pages.push({
                        active: false,
                        name: '...',
                        nonPage: true,
                        page: undefined,
                    });
                }

                pages.push({
                    page: toBeAdded,
                    nonPage: false,
                    active: !(this.page === toBeAdded),
                    name: toBeAdded.toString(),
                });
            }
        }
    }

    public switchPage(p: number, force = false) {
        if ((p !== this.page && p >= 1 && p <= this.lastPage) || force) {
            this.page = p;
            this.pageChange.emit({ page: p, perPage: this.perPage });
            this._loadPaginationItems();
        }
    }

    public setPage(page: number, forceLoad: boolean) {
        this.page = page;
        this._loadPaginationItems();
        if (forceLoad) {
            this.pageChange.emit({ page: this.page, perPage: this.perPage });
        }
    }

    public onPerPageChanged() {
        if (this.perPagePicker && this.perPagePicker.nativeElement) {
            this.perPage = parseInt(this.perPagePicker.nativeElement.value, 10);
            this.page = 1; // reset the page
            this.pageChange.emit({ page: this.page, perPage: this.perPage });
            this._loadPaginationItems();
        }
    }
}

interface Page {
    page: number;
    active: boolean;
    nonPage: boolean;
    name: string;
}
