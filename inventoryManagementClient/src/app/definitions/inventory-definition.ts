import { CompleteVendor } from "./vendor-definition";
import { CompleteProduct } from "./product-definition";

export class CompleteInventoryRow {
    id:string;
    name:string;
    prodDets:CompleteProduct;
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
        let newClone = new CompleteInventoryRow();
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
    static cloneAnother (compInvRow:CompleteInventoryRow):CompleteInventoryRow {
        let newClone = new CompleteInventoryRow();
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

export class CompleteInventory {
    rows:CompleteInventoryRow[];
    vens:CompleteVendor[];
    clone () {
        let newClone = new CompleteInventory();
        newClone.rows = this.rows;
        newClone.vens = this.vens;
        return newClone;
    }
    static cloneAnother (compInv:CompleteInventory):CompleteInventory {
        let newClone = new CompleteInventory();
        newClone.rows = compInv.rows;
        newClone.vens = compInv.vens;
        return newClone;
    }
}

export class InventoryOpening {
    id: string;
    stockOpeing: {
        id: {
            productId : string,
            actorId: string
        },
        packages: number,
        pieces: number
    }[];
}

// export class StockInOut {
//     id: {
//         productId : string,
//         actorId: string
//     };
//     packages: number;
//     pieces: number;
// }