package com.deepFreeze.be.mongoInventoryManagement.vendor;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;

public class VendorDetail implements Comparable<VendorDetail> {
	@Id
	private LocalDate id;
	private float loanAdded;
	private float loanPayed;
	private float openingDp;
	private float deposit;
	private String remarks;

	public VendorDetail() {
	}

	public VendorDetail(LocalDate id) {
		this.id = id;
	}

	public LocalDate getId() {
		return id;
	}

	public void setId(LocalDate id) {
		this.id = id;
	}

	public float getLoanAdded() {
		return loanAdded;
	}

	public void setLoanAdded(float loanAdded) {
		this.loanAdded = loanAdded;
	}

	public float getLoanPayed() {
		return loanPayed;
	}

	public void setLoanPayed(float loanPayed) {
		this.loanPayed = loanPayed;
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

	public void setDeposit(float deposit) {
		this.deposit = deposit;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	@Override
	public int compareTo(VendorDetail arg0) {
		return 0 - this.id.compareTo(arg0.id);
	}

	@Override
	public String toString() {
		return "VendorDetail [id=" + id + ", loanAdded=" + loanAdded + ", loanPayed=" + loanPayed + ", openingDp="
				+ openingDp + ", deposit=" + deposit + ", remarks=" + remarks + "]";
	}

}
