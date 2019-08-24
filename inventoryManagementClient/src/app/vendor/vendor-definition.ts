export class CompleteVendor {
    _id:string;
    name:string;
    totalLoan:number;
    loanAdded:number;
    loanPayed:number;
    openingDp:number;
    deposit:number;
    remarks:string;
    clone():CompleteVendor {
        let newClone       = new CompleteVendor();
        newClone._id        = this._id;
        newClone.name      = this.name;
        newClone.totalLoan = this.totalLoan;
        newClone.loanAdded = this.loanAdded;
        newClone.loanPayed = this.loanPayed;
        newClone.openingDp = this.openingDp;
        newClone.deposit   = this.deposit;
        newClone.remarks   = this.remarks;
        return newClone;
    }
    static cloneAnother (prod:CompleteVendor):CompleteVendor {
        let newClone       = new CompleteVendor();
        newClone._id        = prod._id;
        newClone.name      = prod.name;
        newClone.totalLoan = prod.totalLoan;
        newClone.loanAdded = prod.loanAdded;
        newClone.loanPayed = prod.loanPayed;
        newClone.openingDp = prod.openingDp;
        newClone.deposit   = prod.deposit;
        newClone.remarks   = prod.remarks;
        return newClone;
    }
}