import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import * as firebase from 'firebase';

import { Cart, Price, ProductInfo, ProductItem, TotalCartPrice } from '../models/ceddl';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DatalayerService {

  constructor(private analytics: AngularFireAnalytics) { }

  /**
   * Updates data layers with product information added to the cart.
   * @param product added
   * @param items in the cart after addition
   */
  addToCart(product: Product, items: Product[]) {
    // Google
    this.analytics.logEvent(firebase.default.analytics.EventName.ADD_TO_CART, product);

    // Tealium
    Object.assign(((window as any).utag.data), this.tealiumCart(product, items, 'cart_add'));

    // CEDDL
    const digitalData = window['digitalData'] as any;
    (digitalData.cart as Cart).item = items.map(item => this.ceddlProductItem(item));
    (digitalData.cart as Cart).price = this.ceddlTotalCartPrice((digitalData.cart as Cart).item);
  }

  /**
   * Updates data layers with product information removed from the cart.
   * @param product removed
   * @param items in the cart after removal
   */
  removeFromCart(product: Product, items: Product[]) {
    // Google
    this.analytics.logEvent(firebase.default.analytics.EventName.REMOVE_FROM_CART, product);

    // Tealium
    Object.assign(((window as any).utag.data), this.tealiumCart(product, items, 'cart_remove'));

    // CEDDL
    const digitalData = window['digitalData'] as any;
    (digitalData.cart as Cart).item = items.map(item => this.ceddlProductItem(item));
    (digitalData.cart as Cart).price = this.ceddlTotalCartPrice((digitalData.cart as Cart).item);
  }

  /**
   * Updates data layers with checkout information.
   * @param items used during checkout
   */
  checkout(items: Product[]) {
    // Google
    this.analytics.logEvent(firebase.default.analytics.EventName.PURCHASE, { items });

    // Tealium
    Object.assign(((window as any).utag.data), this.tealiumCheckout(items));
  }

  /**
   * Builds a Tealium cart object for the data layer.
   * @param product added or removed from the cart
   * @param items currently in the cart (after addition or removal)
   * @param tealiumEvent name from the retail definition (i.e. cart_add or cart_remove)
   */
  private tealiumCart(product: Product, items: Product[], tealiumEvent: 'cart_add' | 'cart_remove'): any {
    // NOTE toString() for numeric values is recommended in Tealium documentation
    return {
      cart_product_id: items.map((item: Product) => item.id.toString()),
      cart_product_price: items.map((item: Product) => item.price.toString()),
      cart_product_quantity: items.map((item: Product) => item.quantity.toString()),
      product_id: [product.id],
      product_image_url: [product.image],
      product_name: [product.title],
      product_original_price: [product.price],
      product_price: [product.price],
      product_quantity: [product.quantity.toString()],
      tealium_event: tealiumEvent
    };
  }

  /**
   * Builds a Tealium checkout object for the data layer.
   * @param items currently in the cart
   */
  private tealiumCheckout(items: Product[]): any {
    return {
      cart_total_items: items.length.toString(),
      cart_total_value: items.reduce((tax: number, item: Product) => tax += (item.price * item.quantity) * 1.09, 0),
      order_currency_code: 'USD',
      order_discount_amount: '0.00',
      order_id: Date.now().toString(),
      order_payment_type: 'visa',
      order_promo_code: '',
      order_shipping_amount: `${items.length}.00`,
      order_shipping_type: 'UPS',
      order_subtotal: items.reduce((tax: number, item: Product) => tax += item.price * item.quantity, 0),
      order_tax_amount: items.reduce((tax: number, item: Product) => tax += (item.price * item.quantity) * 1.09, 0),
      order_total: items.reduce((tax: number, item: Product) => tax += (item.price * item.quantity) * 1.09, 0),
      page_name: 'Order Confirmation - Thank You',
      page_type: 'order',
      product_id: items.map(item => item.id.toString()),
      product_image_url: items.map(item => item.image),
      product_name: items.map(item => item.title),
      product_original_price: items.map(item => item.price.toString()),
      product_price: items.map(item => item.price.toString()),
      product_quantity: items.map(item => item.quantity.toString()),
      tealium_event: 'purchase'
    };
  }

  /**
   * CEDDL Price converter.
   * @param item to convert
   */
  ceddlPrice(item: Product): Price {
    return {
      basePrice: item.price,
      currency: 'USD',
      taxRate: 0.09,
      shipping: 1.00,
      shippingMethod: 'UPS-Ground',
      priceWithTax: item.price * 1.09,
      voucherCode: '',
      voucherDiscount: 0.00,
    };
  }

  /**
   * CEDDL ProductInfo converter.
   * @param product to convert
   */
  ceddlProductInfo(product: Product): ProductInfo {
    return {
      productID: product.id.toString(),
      productName: product.title,
      description: product.description,
      productImage: product.image,
      productURL: location.host,
      productThumbnail: product.image,
      manufacturer: 'FruitShoppe',
      sku: product.id.toString(),
      color: 'N/A',
      size: 'N/A',
    };
  }

  /**
   * CEDDL ProductItem converter.
   * @param item to convert
   */
  ceddlProductItem(item: Product): ProductItem {
    return {
      productInfo: this.ceddlProductInfo(item),
      category: {
        primaryCategory: 'fruit',
      },
      quantity: item.quantity,
      price: this.ceddlPrice(item),
      linkedProduct: [],
      attributes: {},
    };
  }

  /**
   * CEDDL TotalCartPrice converter.
   * @param items to build TotalCartPrice
   */
  ceddlTotalCartPrice(items: ProductItem[]): TotalCartPrice {
    return {
      basePrice: items.reduce((price: number, item: ProductItem) => price += item.price.basePrice * item.quantity, 0),
      voucherCode: '',
      voucherDiscount: 0.00,
      currency: 'USD',
      taxRate: 0.09,
      shipping: items.reduce((price: number, item: ProductItem) => price += item.price.shipping, 0),
      shippingMethod: 'UPS-Ground',
      priceWithTax: items.reduce((price: number, item: ProductItem) => price += item.price.priceWithTax * item.quantity, 0),
      cartTotal: items.reduce((price: number, item: ProductItem) => price += (item.price.priceWithTax * item.quantity) + item.price.shipping, 0)
    };
  }
}
