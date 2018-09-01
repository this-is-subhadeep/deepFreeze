package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.util.List;

import com.deepFreeze.be.mongoInventoryManagement.vendor.CompleteVendor;

public class CompleteInventory {
	private List<CompleteInventoryRow> rows;
	private List<CompleteVendor> vens;

	public CompleteInventory() {
	}

	public CompleteInventory(List<CompleteInventoryRow> rows, List<CompleteVendor> vens) {
		this.rows = rows;
		this.vens = vens;
	}

	public List<CompleteInventoryRow> getRows() {
		return rows;
	}

	public void setRows(List<CompleteInventoryRow> rows) {
		this.rows = rows;
	}

	public List<CompleteVendor> getVens() {
		return vens;
	}

	public void setVens(List<CompleteVendor> vens) {
		this.vens = vens;
	}

	@Override
	public String toString() {
		return "CompleteInventory [rows=" + rows + ", vens=" + vens + "]";
	}

}
