import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, CartService } from 'src/app/services';
import { Product } from 'src/app/models';

/**
 * Breakpoint aliases (e.g. 'sm') to number of grid-list columns.
 */
interface BreakpointMap {
  [name: string]: number
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  // TODO (van) a better approach is min/max width based on the product's image size
  private columnBreakpoints: BreakpointMap = {
    'default': 3,
    'xs': 1,
    'sm': 2,
    'md': 3,
    'lg': 4,
    'xl': 5,
  };

  numColumns = this.columnBreakpoints['default'];
  products: Product[] = [];

  constructor(
    private cartService: CartService,
    private mediaObserver: MediaObserver,
    private productService: ProductService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.observeBreakpoints();
    this.buildProductList();
  }

  /**
   * Adds a product to the user's shopping cart.
   * A snackbar will appear showing the product's title that was added.
   * @param product the Product to be added
   */
  addToCart(product: Product) {
    const { id } = product;
    this.cartService.addItem(id);
    this.snackbar.open(`Added ${product.title} to your cart`, '', { duration: 2000 });
  }

  /**
   * Observes for breakpoint changes and updates the number of columns.
   * See `columnBreakpoints` for breakpoint-to-columns mapping.
   */
  private observeBreakpoints(): void {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      const n = this.columnBreakpoints[change.mqAlias];
      this.numColumns = n > 0 ? n : this.columnBreakpoints['default'];
    });
  }

  /**
   * Builds a list of products from the catalog.
   */
  buildProductList(): void {
    this.productService.getProducts().subscribe(products => this.products = products);
  }
}
