export class ProductType {
    _id:string;
    name:string;
    showOrder:number;
    clone():ProductType {
        let newClone = new ProductType();
        newClone._id = this._id;
        newClone.name = this.name;
        newClone.showOrder = this.showOrder;
        return newClone;
    }
    static cloneAnother (prodTyp:ProductType):ProductType {
        let newClone = new ProductType();
        newClone._id = prodTyp._id;
        newClone.name = prodTyp.name;
        newClone.showOrder = prodTyp.showOrder;
        return newClone;
    }
}
export class CompleteProduct {
    _id:string;
    name:string;
    productType:ProductType;
    packageSize:Number;
    costPrice:Number;
    sellingPrice:Number;
    constructor() {
        this.productType = new ProductType();
    }
    clone() {
        let newClone = new CompleteProduct();
        newClone._id = this._id;
        newClone.name = this.name;
        newClone.productType = this.productType.clone();
        newClone.packageSize = this.packageSize;
        newClone.costPrice = this.costPrice;
        newClone.sellingPrice = this.sellingPrice;
        return newClone;
    }
    static cloneAnother (compProd:CompleteProduct):CompleteProduct {
        let newClone = new CompleteProduct();
        newClone._id = compProd._id;
        newClone.name = compProd.name;
        newClone.productType = ProductType.cloneAnother(compProd.productType);
        newClone.packageSize = compProd.packageSize;
        newClone.costPrice = compProd.costPrice;
        newClone.sellingPrice = compProd.sellingPrice;
        return newClone;

    }
}