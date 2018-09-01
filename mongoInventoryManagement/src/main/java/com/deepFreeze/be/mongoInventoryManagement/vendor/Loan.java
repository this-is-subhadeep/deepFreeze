package com.deepFreeze.be.mongoInventoryManagement.vendor;

import java.util.Date;

public class Loan {
	private float amount;
	private Date date;
	private String remarks;

	public Loan() {
	}

	public Loan(float amount, Date date, String remarks) {
		this.amount = amount;
		this.date = date;
		this.remarks = remarks;
	}

	public float getAmount() {
		return amount;
	}

	public void setAmount(float amount) {
		this.amount = amount;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	@Override
	public String toString() {
		return "Loan [amount=" + amount + ", date=" + date + ", remarks=" + remarks + "]";
	}

}
