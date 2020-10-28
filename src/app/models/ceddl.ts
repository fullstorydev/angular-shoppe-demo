/**
 * Mocks a CEDDL compliant data layer.
 * See https://www.w3.org/2013/12/ceddl-201312.pdf
 *
 * Note that this is a subset for the purposes of demonstration.
 */

export const ceddlVersion = '1.0';

/**
 * The root JavaScript Object (JSO) MUST be window.digitalData.
 * All data properties within this specification MUST fall within the hierarchy of the digitalData
 * object.
 */
export interface CEDDL {
  pageInstanceID: string;
  product: Product[];
  cart: Cart;
  version: string;
}

/**
 * The Product object carries details about a particular product with frequently used properties
 * listed below. This is intended for data about products displayed on pages or other content. For
 * products added to a shopping cart or ordered in a transaction, see the Cart and Transaction
 * objects below.
 */
export interface Product {
  productInfo: ProductInfo;
  category: ProductCategory;
  linkedProduct: LinkedProduct[];
  attributes?: { [key: string]: any };
}

export interface ProductInfo {
  productID: string;
  productName: string;
  description: string;
  productURL: string;
  productImage: string;
  productThumbnail: string;
  manufacturer: string;
  sku: string;
  color: string;
  size: string;
}

export interface ProductCategory {
  primaryCategory: string;
  subCategory1?: string;
  productType?: string;
}

export interface LinkedProduct {
  productInfo: ProductInfo
}

/**
 * The Cart object carries details about a shopping cart or basket and the products that have been
 * added to it. The Cart object is intended for a purchase that has not yet been completed. See the
 * Transaction object below for completed orders.
 */
export interface Cart {
  cartID: string;
  price: TotalCartPrice;
  attributes: { [key: string]: any };
  item: ProductItem[];
}

export interface Price {
  basePrice: number;
  voucherCode: string;
  voucherDiscount: number;
  currency: string; // ISO 4217 is RECOMMENDED
  taxRate: number;
  shipping: number;
  shippingMethod: string;
  priceWithTax: number;
}

export interface TotalCartPrice extends Price {
  cartTotal: number;
}

export interface ProductItem {
  productInfo: ProductInfo;
  category: ProductCategory;
  quantity: number;
  price: Price;
  linkedProduct: LinkedProduct[];
  attributes: { [key: string]: any };
}
