export class ProductType {
    id:string = "";
    name:string | undefined;
    discount: Number | undefined;
    showOrder:number | undefined;
    clone():ProductType {
        let newClone = new ProductType();
        newClone.id = this.id;
        newClone.name = this.name;
        newClone.discount = this.discount;
        newClone.showOrder = this.showOrder;
        return newClone;
    }
    static cloneAnother (prodTyp:ProductType):ProductType {
        let newClone = new ProductType();
        newClone.id = prodTyp.id;
        newClone.name = prodTyp.name;
        newClone.discount = prodTyp.discount;
        newClone.showOrder = prodTyp.showOrder;
        return newClone;
    }
}
export class CompleteProduct {
    id:string = "";
    name:string | undefined;
    productType:ProductType;
    packageSize:Number | undefined;
    costPrice:Number | undefined;
    sellingPrice:Number | undefined;
    constructor() {
        this.productType = new ProductType();
    }
    clone() {
        let newClone = new CompleteProduct();
        newClone.id = this.id;
        newClone.name = this.name;
        newClone.productType = this.productType.clone();
        newClone.packageSize = this.packageSize;
        newClone.costPrice = this.costPrice;
        newClone.sellingPrice = this.sellingPrice;
        return newClone;
    }
    static cloneAnother (compProd:CompleteProduct):CompleteProduct {
        let newClone = new CompleteProduct();
        newClone.id = compProd.id;
        newClone.name = compProd.name;
        newClone.productType = ProductType.cloneAnother(compProd.productType);
        newClone.packageSize = compProd.packageSize;
        newClone.costPrice = compProd.costPrice;
        newClone.sellingPrice = compProd.sellingPrice;
        return newClone;

    }
}