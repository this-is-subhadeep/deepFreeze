package com.deepFreeze.be.mongoInventoryManagement.product;

public class CompleteProduct {
	private String id;
	private String name;
	private ProductType productType;
	private Integer packageSize;
	private Float costPrice;
	private Float sellingPrice;

	public CompleteProduct() {
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

	public ProductType getProductType() {
		return productType;
	}

	public void setProductType(ProductType productType) {
		this.productType = productType;
	}

	public Integer getPackageSize() {
		return packageSize;
	}

	public void setPackageSize(Integer packageSize) {
		this.packageSize = packageSize;
	}

	public Float getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Float costPrice) {
		this.costPrice = costPrice;
	}

	public Float getSellingPrice() {
		return sellingPrice;
	}

	public void setSellingPrice(Float sellingPrice) {
		this.sellingPrice = sellingPrice;
	}

	@Override
	public String toString() {
		return "CompleteProduct [id=" + id + ", name=" + name + ", productType=" + productType + ", packageSize="
				+ packageSize + ", costPrice=" + costPrice + ", sellingPrice=" + sellingPrice + "]";
	}

}
