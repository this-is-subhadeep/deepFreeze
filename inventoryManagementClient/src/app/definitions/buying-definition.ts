import { Product } from './product-definition';

export class BuyingData {
    enableDelete: boolean;
    constructor(public product: Product = new Product(),
        public packageUnits: number = null,
        public pieceUnits: number = null) {
        this.enableDelete = false;
    }

    getBoughtPrice(): number {
        let price = 0;
        if (this.packageUnits && this.product.costPrice && this.product.packageSize) {
            price += this.product.costPrice.valueOf() * this.packageUnits * this.product.packageSize;
        }
        if (this.pieceUnits && this.product.costPrice) {
            price += this.product.costPrice.valueOf() * this.pieceUnits;
        }
        return Math.round(price * 100) / 100;
    }
}
