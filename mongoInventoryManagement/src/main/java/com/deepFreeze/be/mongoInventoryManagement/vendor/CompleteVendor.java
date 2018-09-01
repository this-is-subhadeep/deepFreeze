package com.deepFreeze.be.mongoInventoryManagement.vendor;

public class CompleteVendor {
	private String id;
	private String name;
	private float totalLoan;
	private float loanAdded;
	private float loanPayed;
	private float openingDp;
	private float deposit;
	private String remarks;

	public CompleteVendor() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public float getTotalLoan() {
		return totalLoan;
	}

	public void setTotalLoan(float totalLOan) {
		this.totalLoan = totalLOan;
	}

	public float getLoanAdded() {
		return loanAdded;
	}

	public void setLoanAdded(float loansAdded) {
		this.loanAdded = loansAdded;
	}

	public float getLoanPayed() {
		return loanPayed;
	}

	public void setLoanPayed(float loansPayed) {
		this.loanPayed = loansPayed;
	}

	public float getOpeningDp() {
		return openingDp;
	}

	public void setOpeningDp(float openingDps) {
		this.openingDp = openingDps;
	}

	public float getDeposit() {
		return deposit;
	}

	public void setDeposit(float deposits) {
		this.deposit = deposits;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	@Override
	public String toString() {
		return "CompleteVendor [id=" + id + ", name=" + name + ", totalLoan=" + totalLoan + ", loanAdded=" + loanAdded
				+ ", loanPayed=" + loanPayed + ", openingDp=" + openingDp + ", deposit=" + deposit + ", remarks="
				+ remarks + "]";
	}

}
