export class Vendor {
    _id:string;
    name:string;
    totalLoan:number;
    loanAdded:number;
    loanPayed:number;
    openingDp:number;
    deposit:number;
    remarks:string;
    dpFile:string;
    clone():Vendor {
        let newClone       = new Vendor();
        newClone._id        = this._id;
        newClone.name      = this.name;
        newClone.totalLoan = this.totalLoan;
        newClone.loanAdded = this.loanAdded;
        newClone.loanPayed = this.loanPayed;
        newClone.openingDp = this.openingDp;
        newClone.deposit   = this.deposit;
        newClone.remarks   = this.remarks;
        newClone.dpFile = this.dpFile;
        return newClone;
    }
    static cloneAnother (ven:Vendor):Vendor {
        let newClone       = new Vendor();
        newClone._id        = ven._id;
        newClone.name      = ven.name;
        newClone.totalLoan = ven.totalLoan;
        newClone.loanAdded = ven.loanAdded;
        newClone.loanPayed = ven.loanPayed;
        newClone.openingDp = ven.openingDp;
        newClone.deposit   = ven.deposit;
        newClone.remarks   = ven.remarks;
        newClone.dpFile = ven.dpFile;
        return newClone;
    }
}