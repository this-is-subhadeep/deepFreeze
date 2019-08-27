export class CompleteInventoryRow {
    stockSenIn:number;
    stockOthersIn:number;
    vendorValue:{[index:string]:number};
    constructor() {
        this.vendorValue={};
    }
    clone() {
        let newClone = new CompleteInventoryRow();
        newClone.stockSenIn = this.stockSenIn;
        newClone.stockOthersIn = this.stockOthersIn;
        newClone.vendorValue = this.vendorValue;
        return newClone;
    }
    static cloneAnother (compInvRow:CompleteInventoryRow):CompleteInventoryRow {
        let newClone = new CompleteInventoryRow();
        newClone.stockSenIn = compInvRow.stockSenIn;
        newClone.stockOthersIn = compInvRow.stockOthersIn;
        newClone.vendorValue = compInvRow.vendorValue;
        return newClone;
    }
}

export class CompleteInventory {
    rows:{[id:string]:CompleteInventoryRow};
    clone () {
        let newClone = new CompleteInventory();
        newClone.rows = this.rows;
        return newClone;
    }
    static cloneAnother (compInv:CompleteInventory):CompleteInventory {
        let newClone = new CompleteInventory();
        newClone.rows = compInv.rows;
        return newClone;
    }
}