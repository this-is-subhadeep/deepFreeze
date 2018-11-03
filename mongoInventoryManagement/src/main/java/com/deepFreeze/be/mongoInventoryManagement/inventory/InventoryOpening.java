package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;

public class InventoryOpening implements Comparable<InventoryOpening> {
	@Id
	private LocalDate id;
	private List<StockInOut> stockOpeing;

	public InventoryOpening() {
		stockOpeing = new ArrayList<>();
	}

	public InventoryOpening(LocalDate id) {
		this.id = id;
		stockOpeing = new ArrayList<>();
	}

	public LocalDate getId() {
		return id;
	}

	public void setId(LocalDate id) {
		this.id = id;
	}

	public List<StockInOut> getStockOpeing() {
		return stockOpeing;
	}

	public void setStockOpeing(List<StockInOut> stockOpeing) {
		this.stockOpeing = stockOpeing;
	}

	@Override
	public String toString() {
		return "InventoryOpening [id=" + id + ", stockOpeing=" + stockOpeing + "]";
	}

	@Override
	public int compareTo(InventoryOpening other) {
		return id.compareTo(other.id);
	}

}
