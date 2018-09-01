package com.deepFreeze.be.mongoInventoryManagement.inventory;

public class StockId {
	private String productId;
	private String actorId;

	public StockId() {
	}

	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getActorId() {
		return actorId;
	}

	public void setActorId(String actorId) {
		this.actorId = actorId;
	}

	@Override
	public String toString() {
		return "StockId [productId=" + productId + ", actorId=" + actorId + "]";
	}

}
