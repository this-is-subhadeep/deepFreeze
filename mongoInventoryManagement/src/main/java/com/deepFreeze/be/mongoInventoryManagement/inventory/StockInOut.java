package com.deepFreeze.be.mongoInventoryManagement.inventory;

import org.springframework.data.annotation.Id;

public class StockInOut {
	@Id
	private StockId id;
	private int packages;
	private int pieces;

	public StockInOut() {
		id = new StockId();
	}

	public StockId getId() {
		return id;
	}

	public void setId(StockId id) {
		this.id = id;
	}

	public int getPackages() {
		return packages;
	}

	public void setPackages(int packages) {
		this.packages = packages;
	}

	public int getPieces() {
		return pieces;
	}

	public void setPieces(int pieces) {
		this.pieces = pieces;
	}

	@Override
	public String toString() {
		return "StockIn [id=" + id + ", packages=" + packages + ", pieces=" + pieces + "]";
	}

}
