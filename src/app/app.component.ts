import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogComponent } from "./components/dialog/dialog.component";
import { ApiService } from "./services/api.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor (private dialog: MatDialog,
               private api: ApiService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val==='save') {
        this.getAllProducts();
      }
    })
  }

  getAllProducts() {
    this.api.getProducts()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert('There was an error trying to fetch the products!' + err);
        }
      })
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val==='update') {
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id)
      .subscribe({
        next: (res) => {
          alert('Product removed successfully!');
          this.getAllProducts();
        },
        error: (err) => {
          alert('There was a problem trying to remove the product!');
        }
      });
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
