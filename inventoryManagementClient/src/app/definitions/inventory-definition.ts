import { Product, ProductType } from './product-definition';

export class InventoryRow {
    stockSenIn: number;
    stockOthersIn: number;
    vendorValue: {
        [index: string]: {
            packages: number,
            pieces: number
        }
    };

    constructor() {
        this.vendorValue = {};
    }

    static cloneAnother(invRow: InventoryRow): InventoryRow {
        const newClone = new InventoryRow();
        newClone.stockSenIn = invRow.stockSenIn;
        newClone.stockOthersIn = invRow.stockOthersIn;
        newClone.vendorValue = invRow.vendorValue;
        return newClone;
    }

    clone() {
        const newClone = new InventoryRow();
        newClone.stockSenIn = this.stockSenIn;
        newClone.stockOthersIn = this.stockOthersIn;
        newClone.vendorValue = this.vendorValue;
        return newClone;
    }
}

export class Inventory {
    date: string;
    rows: { [id: string]: InventoryRow };
    vendorDeposits: { [id: string]: number };

    constructor() {
        this.rows = {};
        this.vendorDeposits = {};
    }

    static cloneAnother(inv: Inventory): Inventory {
        const newClone = new Inventory();
        newClone.rows = inv.rows;
        newClone.vendorDeposits = inv.vendorDeposits;
        return newClone;
    }

    clone() {
        const newClone = new Inventory();
        newClone.rows = this.rows;
        newClone.vendorDeposits = this.vendorDeposits;
        return newClone;
    }
}

export class UIInventoryRow {
    id: string;
    name: string;
    prodDets: Product;
    stockOpening: number;
    stockBalance: number;
    stockTotalIn: number;
    stockSenIn: number;
    stockOthersIn: number;
    stockTotalOut: number;
    vendorValue: { [index: string]: number };

    constructor() {
        this.vendorValue = {};
    }

    static cloneAnother(compInvRow: UIInventoryRow): UIInventoryRow {
        const newClone = new UIInventoryRow();
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

    clone() {
        const newClone = new UIInventoryRow();
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
}

export class InventoryOpeningRow {
    packages: number;
    pieces: number;

    constructor() { }

    static cloneAnother(invRow: InventoryOpeningRow): InventoryOpeningRow {
        const newClone = new InventoryOpeningRow();
        newClone.packages = invRow.packages;
        newClone.pieces = invRow.pieces;
        return newClone;
    }

    clone() {
        const newClone = new InventoryOpeningRow();
        newClone.packages = this.packages;
        newClone.pieces = this.pieces;
        return newClone;
    }
}

export class InventoryOpening {
    rows: { [id: string]: InventoryOpeningRow };

    constructor() {
        this.rows = {};
    }

    static cloneAnother(inv: InventoryOpening): InventoryOpening {
        const newClone = new InventoryOpening();
        newClone.rows = inv.rows;
        return newClone;
    }

    clone() {
        const newClone = new InventoryOpening();
        newClone.rows = this.rows;
        return newClone;
    }
}

export class UIInventoryOpeningRow {
    id: string;
    name: string;
    prodDets: Product;
    stockOpening: number;

    constructor() { }

    static cloneAnother(compInvRow: UIInventoryOpeningRow): UIInventoryOpeningRow {
        const newClone = new UIInventoryOpeningRow();
        newClone.id = compInvRow.id;
        newClone.name = compInvRow.name;
        newClone.prodDets = compInvRow.prodDets;
        newClone.stockOpening = compInvRow.stockOpening;
        return newClone;
    }

    clone() {
        const newClone = new UIInventoryOpeningRow();
        newClone.id = this.id;
        newClone.name = this.name;
        newClone.prodDets = this.prodDets;
        newClone.stockOpening = this.stockOpening;
        return newClone;
    }
}

export interface ProductOpening {
    openingValues: { [id: string]: number };
}
