package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;

public class Inventory implements Comparable<Inventory> {
	@Id
	private LocalDate id;
	private List<StockInOut> stockIn;
	private List<StockInOut> stockOut;

	public Inventory() {
		stockIn = new ArrayList<>();
		stockOut = new ArrayList<>();
	}

	public Inventory(LocalDate id) {
		this.id = id;
		stockIn = new ArrayList<>();
		stockOut = new ArrayList<>();
	}

	public LocalDate getId() {
		return id;
	}

	public void setId(LocalDate id) {
		this.id = id;
	}

	public List<StockInOut> getStockIn() {
		return stockIn;
	}

	public void setStockIn(List<StockInOut> stockIn) {
		this.stockIn = stockIn;
	}

	public List<StockInOut> getStockOut() {
		return stockOut;
	}

	public void setStockOut(List<StockInOut> stockOut) {
		this.stockOut = stockOut;
	}

	@Override
	public String toString() {
		return "Inventory [id=" + id + ", stockIn=" + stockIn + ", stockOut=" + stockOut + "]";
	}

	@Override
	public int compareTo(Inventory other) {
		return id.compareTo(other.id);
	}

}
