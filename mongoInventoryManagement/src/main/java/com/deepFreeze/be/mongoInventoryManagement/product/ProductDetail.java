package com.deepFreeze.be.mongoInventoryManagement.product;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;

public class ProductDetail implements Comparable<ProductDetail> {
	@Id
	private LocalDate id;
	private Integer packageSize;
	private Float costPrice;
	private Float sellingPrice;

	public ProductDetail() {
		id = LocalDate.now();
	}

	public ProductDetail(LocalDate id) {
		this.id = id;
	}

	public LocalDate getId() {
		return id;
	}

	public void setId(LocalDate id) {
		this.id = id;
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
	public int compareTo(ProductDetail o) {
		return 0 - this.id.compareTo(o.id);
	}

	public void copyFrom(ProductDetail prodDet) {
		this.id = LocalDate.of(prodDet.id.getYear(), prodDet.id.getMonth(), prodDet.id.getDayOfMonth());
		this.packageSize = prodDet.packageSize.intValue();
		this.costPrice = prodDet.costPrice.floatValue();
		this.sellingPrice = prodDet.sellingPrice.floatValue();
	}

	@Override
	public String toString() {
		return "ProductDetails [id=" + id + ", packageSize=" + packageSize + ", costPrice=" + costPrice
				+ ", sellingPrice=" + sellingPrice + "]";
	}
}
