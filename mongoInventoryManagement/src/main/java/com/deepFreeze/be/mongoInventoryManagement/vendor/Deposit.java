package com.deepFreeze.be.mongoInventoryManagement.vendor;

import java.util.Date;

public class Deposit {
	private float amount;
	private Date date;

	public Deposit() {
	}

	public Deposit(float amount, Date date) {
		this.amount = amount;
		this.date = date;
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

	@Override
	public String toString() {
		return "Deposit [amount=" + amount + ", date=" + date + "]";
	}

}
