package com.deepFreeze.be.mongoInventoryManagement.inventory;

import com.deepFreeze.be.mongoInventoryManagement.vendor.CompleteVendor;

public class VendorOut {
	private CompleteVendor id;
	private Integer value;

	public VendorOut() {
	}

	public VendorOut(CompleteVendor id, Integer value) {
		this.id = id;
		this.value = value;
	}

	public CompleteVendor getId() {
		return id;
	}

	public void setId(CompleteVendor id) {
		this.id = id;
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "VendorOut [id=" + id + ", value=" + value + "]";
	}

}
