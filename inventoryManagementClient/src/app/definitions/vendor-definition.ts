export class CompleteVendor {
    id: string;
    name: string;
    totalLoan: number;
    loanAdded: number;
    loanPayed: number;
    openingDp: number;
    deposit: number;
    remarks: string;
    clone(): CompleteVendor {
        let newClone = new CompleteVendor();
        newClone.id = this.id;
        newClone.name = this.name;
        newClone.totalLoan = this.totalLoan;
        newClone.loanAdded = this.loanAdded;
        newClone.loanPayed = this.loanPayed;
        newClone.openingDp = this.openingDp;
        newClone.deposit = this.deposit;
        newClone.remarks = this.remarks;
        return newClone;
    }
    static cloneAnother(ven: CompleteVendor): CompleteVendor {
        let newClone = new CompleteVendor();
        newClone.id = ven.id;
        newClone.name = ven.name;
        newClone.totalLoan = ven.totalLoan;
        newClone.loanAdded = ven.loanAdded;
        newClone.loanPayed = ven.loanPayed;
        newClone.openingDp = ven.openingDp;
        newClone.deposit = ven.deposit;
        newClone.remarks = ven.remarks;
        return newClone;
    }
}