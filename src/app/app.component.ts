import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogComponent } from "./components/dialog/dialog.component";
import { ApiService } from "./services/api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  productList!: [];

  constructor (private dialog: MatDialog,
               private api: ApiService) {}

  ngOnInit(): void {
    this.getAllProducts();
    console.log(this.productList);
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    });
  }

  getAllProducts() {
    this.api.getProducts()
      .subscribe({
        next: (res) => {
          this.productList = res;
        },
        error: () => {
          alert('There was an error trying to fetch the products!');
        }
      })
  }
}
