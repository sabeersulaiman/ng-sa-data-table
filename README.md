# Data Table (ng-sa-data-table)

Easy, responsive, simple to use Angular v9+ data table (Tested upto v11) using HTML5 grids. Please look into the demo project if a demo is required.

## Installation

To install from NPM run:

```
yarn add ng-sa-data-table

OR

npm i ng-sa-data-table
```

## Usage

Import inside required modules

```typescript
import { NgSaDataTableModule } from 'ng-sa-data-table';

@NgModule({
  declarations: [
      ...
  ],
  imports: [
    ...,
    NgSaDataTableModule
  ]
})
export class YourModule { }
```

Then use the data table inside the components wherever required. To add a table to a page use the main component `sa-data-table`. The height of the container will need to have a fixed height. The property `data` takes the array of rows to be shown in the table. The event filter will be triggered when there is a page change or per page change. It will receive an object of type `SaTableFilters` which we can use to load pages. Setting the property `initialLoad` to `true` will trigger the filter event.

To add a column use the `sa-column` directive inside the `sa-data-table` component. The code below adds a table with just one column _ID_.

```html
<sa-data-table
    [data]="tData"
    [tableName]="'Company Users'"
    [total]="100"
    [perPage]="30"
    (filter)="onTableReload($event)"
    [initialLoad]="true"
>
    <sa-column [header]="'ID'" [property]="'id'" [visible]="false"></sa-column>
</sa-data-table>
```

#### Extending the header

You can add your own components into the header using `ng-templates`. To more items to right part of use `headerExtraRight` and to add to the left along side the tableName use the `headerExtraLeft` template. Refer to the example below.

```html
<sa-data-table
    [scrollbarVisible]="false"
    [data]="tData"
    [tableName]="'Company Users'"
    [selectable]="true"
    [total]="100"
    [perPage]="30"
    (selection)="onSelectionChange($event)"
    (filter)="onTableReload($event)"
    [initialLoad]="true"
>
    <ng-template #headerExtraRight>
        <button (click)="handleClick()" class="umaga">Some Button</button>
    </ng-template>
    <ng-template #headerExtraLeft>
        <button (click)="handleSomeOtherClick()" class="umaga">
            Some Other Button
        </button>
    </ng-template>
</sa-data-table>
```

```html
<sa-data-table
    [scrollbarVisible]="false"
    [data]="tData"
    [tableName]="'Company Users'"
    [selectable]="true"
    [total]="100"
    [perPage]="30"
    (selection)="onSelectionChange($event)"
    (filter)="onTableReload($event)"
    [initialLoad]="true"
>
    <sa-column [header]="'ID'" [property]="'id'" [visible]="false"></sa-column>
    <sa-column [header]="'Full Name'" [width]="200">
        <ng-template #colTemplate let-data>
            {{ data.firstName }} {{ data.lastName }}
        </ng-template>
    </sa-column>
    <sa-column [header]="'First Name'" [property]="'firstName'"></sa-column>
    <sa-column [header]="'Last Name'" [property]="'lastName'"></sa-column>
    <sa-column [header]="'Company'" [property]="'company'"></sa-column>
    <sa-column [header]="'Phone'" [property]="'phone'"></sa-column>
    <sa-column
        [header]="'Email'"
        [property]="'email'"
        [overflow]="tableOverflowModes.breakVisible"
        [width]="400"
    ></sa-column>
    <sa-column [header]="'DOB'" [property]="'dob'" [width]="300">
        <ng-template #colTemplate let-user>
            <div class="col">{{ user.dob | date: 'short' }}</div>
        </ng-template>
    </sa-column>
    <sa-column
        [header]="'Address'"
        [property]="'address'"
        [width]="200"
        [overflow]="tableOverflowModes.visible"
    ></sa-column>
    <sa-column
        [header]="'Interests'"
        [property]="'interests'"
        [overflow]="tableOverflowModes.visible"
        [width]="300"
    ></sa-column>
    <sa-column
        [header]="'Delete User'"
        [overflow]="tableOverflowModes.visible"
        [width]="300"
    >
        <ng-template #colTemplate let-data>
            <button (click)="deleteUser(data)">
                Delete {{ data.firstName }}
            </button>
        </ng-template>
    </sa-column>
    <ng-template #headerExtraRight>
        <button (click)="handleClick()" class="umaga">Some Button</button>
    </ng-template>
    <ng-template #headerExtraLeft>
        <button (click)="handleSomeOtherClick()" class="umaga">
            Some Other Button
        </button>
    </ng-template>
</sa-data-table>
```

## Expanding Table Rows

To enable table row expansion set the property `expandable` on `sa-data-table` to `true`. Also provide an ng-template to be shown when the row is expanded with name `expansionTemplate`. See the example below:

```html
<sa-data-table [expandable]="true" (rowExpanded)="handleRowExpand($event)">
    <ng-template #expansionTemplate let-data>
        <p class="expanded">
            Expanded view for user {{ data.firstName }} {{ data.lastName }} with
            ID: {{ data.id }}
        </p>
    </ng-template>
    <sa-column [header]="'ID'" [property]="'id'" [visible]="false"></sa-column>
    <sa-column [header]="'Full Name'" [width]="200">
        <ng-template #colTemplate let-data>
            {{ data.firstName }} {{ data.lastName }}
        </ng-template>
    </sa-column>
</sa-data-table>
```

If you want to perform any actions when the expansion for a row is done, you can listen on the `rowExpanded` event on `sa-data-table`. It will recieve the data for the clicked row as `$event`.

## Overflow Modes

There are mainly 3 methods to handle overflows. You can use the const `overflowModes` to configure the mode for handling overflow for each column:

-   `hidden` : will hide the overflows and show ellipsis
-   `visible` : will show the entire content and if it exeeds the width will be made to scroll
-   `breakVisible` : will constrain into the given width even by breaking the words
