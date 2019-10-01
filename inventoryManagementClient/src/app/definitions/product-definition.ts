export class ProductType {
    _id: string;
    name: string;
    showOrder: number;
    clone(): ProductType {
        let newClone = new ProductType();
        newClone._id = this._id;
        newClone.name = this.name;
        newClone.showOrder = this.showOrder;
        return newClone;
    }
    static cloneAnother(prodTyp: ProductType): ProductType {
        let newClone = new ProductType();
        newClone._id = prodTyp._id;
        newClone.name = prodTyp.name;
        newClone.showOrder = prodTyp.showOrder;
        return newClone;
    }
}
export class Product {
    _id: string;
    name: string;
    productType: ProductType;
    packageSize: number;
    costPrice: number;
    sellingPrice: number;
    productIcon: string;
    constructor() {
        this.productType = new ProductType();
    }
    clone() {
        let newClone = new Product();
        newClone._id = this._id;
        newClone.name = this.name;
        newClone.productType = this.productType.clone();
        newClone.packageSize = this.packageSize;
        newClone.costPrice = this.costPrice;
        newClone.sellingPrice = this.sellingPrice;
        newClone.productIcon = this.productIcon;
        return newClone;
    }
    static cloneAnother(prod: Product): Product {
        let newClone = new Product();
        newClone._id = prod._id;
        newClone.name = prod.name;
        newClone.productType = ProductType.cloneAnother(prod.productType);
        newClone.packageSize = prod.packageSize;
        newClone.costPrice = prod.costPrice;
        newClone.sellingPrice = prod.sellingPrice;
        newClone.productIcon = prod.productIcon;
        return newClone;

    }
}