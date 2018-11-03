import { CompleteProduct } from "../product/product-definition";

export class SellingData {
    constructor(public product: CompleteProduct = new CompleteProduct(),
        public soldUnits: number = null) { }

    getSoldPrice(): number {
        let price = 0;
        if (this.soldUnits != null && this.product.sellingPrice != undefined && this.product.sellingPrice != null) {
            price = this.product.sellingPrice.valueOf() * this.soldUnits;
        }
        return Math.round(price*100)/100;
    }
}