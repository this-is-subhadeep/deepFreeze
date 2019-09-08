import { Product, ProductType } from "./product-definition"
import { Vendor } from "./vendor-definition";

export class InventoryRow {
    stockSenIn:number;
    stockOthersIn:number;
    vendorValue:{[index:string]: {
            packages : number,
            pieces : number
        }
    };
    constructor() {
        this.vendorValue={};
    }
    clone() {
        let newClone = new InventoryRow();
        newClone.stockSenIn = this.stockSenIn;
        newClone.stockOthersIn = this.stockOthersIn;
        newClone.vendorValue = this.vendorValue;
        return newClone;
    }
    static cloneAnother (invRow:InventoryRow):InventoryRow {
        let newClone = new InventoryRow();
        newClone.stockSenIn = invRow.stockSenIn;
        newClone.stockOthersIn = invRow.stockOthersIn;
        newClone.vendorValue = invRow.vendorValue;
        return newClone;
    }
}

export class Inventory {
    rows:{[id:string]:InventoryRow};
    vendorDeposits:{[id:string]:number};
    constructor() {
        this.rows = {};
        this.vendorDeposits = {};
    }
    clone () {
        let newClone = new Inventory();
        newClone.rows = this.rows;
        newClone.vendorDeposits = this.vendorDeposits;
        return newClone;
    }
    static cloneAnother (inv:Inventory):Inventory {
        let newClone = new Inventory();
        newClone.rows = inv.rows;
        newClone.vendorDeposits = inv.vendorDeposits;
        return newClone;
    }
}

export class UIInventoryRow {
    id:string;
    name:string;
    prodDets:Product;
    stockOpening:number;
    stockBalance:number;
    stockTotalIn:number;
    stockSenIn:number;
    stockOthersIn:number;
    stockTotalOut:number;
    vendorValue:{[index:string]:number};
    constructor() {
        this.vendorValue={};
    }
    clone() {
        let newClone = new UIInventoryRow();
        newClone.id = this.id;
        newClone.name = this.name;
        newClone.prodDets = this.prodDets;
        newClone.stockOpening = this.stockOpening;
        newClone.stockBalance = this.stockBalance;
        newClone.stockTotalIn = this.stockTotalIn;
        newClone.stockSenIn = this.stockSenIn;
        newClone.stockOthersIn = this.stockOthersIn;
        newClone.stockTotalOut = this.stockTotalOut;
        newClone.vendorValue = this.vendorValue;
        return newClone;
    }
    static cloneAnother (compInvRow:UIInventoryRow):UIInventoryRow {
        let newClone = new UIInventoryRow();
        newClone.id = compInvRow.id;
        newClone.name = compInvRow.name;
        newClone.prodDets = compInvRow.prodDets;
        newClone.stockOpening = compInvRow.stockOpening;
        newClone.stockBalance = compInvRow.stockBalance;
        newClone.stockTotalIn = compInvRow.stockTotalIn;
        newClone.stockSenIn = compInvRow.stockSenIn;
        newClone.stockOthersIn = compInvRow.stockOthersIn;
        newClone.stockTotalOut = compInvRow.stockTotalOut;
        newClone.vendorValue = compInvRow.vendorValue;
        return newClone;
    }
}

export interface InventoryGetResult {
    inventories : Inventory;
    products : Product[];
    productTypes : ProductType[];
    vendors : Vendor[];
}

export interface InventorySaveResult {
    inventoryId : string,
    vendorId : string
}