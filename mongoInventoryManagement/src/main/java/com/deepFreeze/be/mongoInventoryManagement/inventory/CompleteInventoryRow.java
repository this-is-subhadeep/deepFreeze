package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.util.HashMap;
import java.util.Map;

import com.deepFreeze.be.mongoInventoryManagement.product.CompleteProduct;

public class CompleteInventoryRow {
	private String id;
	private String name;
	private CompleteProduct prodDets;
	private Integer stockOpening;
	private Integer stockBalance;
	private Integer stockTotalIn;
	private Integer stockSenIn;
	private Integer stockOthersIn;
	private Integer stockTotalOut;
	private Map<String, Integer> vendorValue;

	public CompleteInventoryRow() {
		vendorValue = new HashMap<>();
	}

	public CompleteInventoryRow(String id, String name) {
		this.id = id;
		this.name = name;
		vendorValue = new HashMap<>();
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

	public CompleteProduct getProdDets() {
		return prodDets;
	}

	public void setProdDets(CompleteProduct prodDets) {
		this.prodDets = prodDets;
	}

	public Integer getStockOpening() {
		return stockOpening;
	}

	public void setStockOpening(Integer stockOpening) {
		this.stockOpening = stockOpening;
	}

	public Integer getStockBalance() {
		return stockBalance;
	}

	public void setStockBalance(Integer stockBalance) {
		this.stockBalance = stockBalance;
	}

	public Integer getStockTotalIn() {
		return stockTotalIn;
	}

	public void setStockTotalIn(Integer stockTotalIn) {
		this.stockTotalIn = stockTotalIn;
	}

	public Integer getStockSenIn() {
		return stockSenIn;
	}

	public void setStockSenIn(Integer stockSenIn) {
		this.stockSenIn = stockSenIn;
	}

	public Integer getStockOthersIn() {
		return stockOthersIn;
	}

	public void setStockOthersIn(Integer stockOthersIn) {
		this.stockOthersIn = stockOthersIn;
	}

	public Integer getStockTotalOut() {
		return stockTotalOut;
	}

	public void setStockTotalOut(Integer stockTotalOut) {
		this.stockTotalOut = stockTotalOut;
	}

	public Map<String, Integer> getVendorValue() {
		return vendorValue;
	}

	public void setVendorValue(Map<String, Integer> vendorValue) {
		this.vendorValue = vendorValue;
	}

	@Override
	public String toString() {
		return "CompleteInventoryRow [id=" + id + ", name=" + name + ", prodDets=" + prodDets + ", stockOpening="
				+ stockOpening + ", stockBalance=" + stockBalance + ", stockTotalIn=" + stockTotalIn + ", stockSenIn="
				+ stockSenIn + ", stockOthersIn=" + stockOthersIn + ", stockTotalOut=" + stockTotalOut
				+ ", vendorValue=" + vendorValue + "]";
	}

}
