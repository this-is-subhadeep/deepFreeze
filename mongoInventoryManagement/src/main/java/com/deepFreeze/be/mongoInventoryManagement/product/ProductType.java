package com.deepFreeze.be.mongoInventoryManagement.product;

import org.springframework.data.annotation.Id;

public class ProductType implements Comparable<ProductType> {
	@Id
	private String id;
	private String name;
	private Integer showOrder;

	public ProductType() {
	}

	public ProductType(String id, String name, Integer showOrder) {
		this.id = id;
		this.name = name;
		this.showOrder = showOrder;
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

	public Integer getShowOrder() {
		return showOrder;
	}

	public void setShowOrder(Integer showOrder) {
		this.showOrder = showOrder;
	}

	public int compareTo(ProductType ref) {
		int compare = this.showOrder.compareTo(ref.showOrder);
		if (compare == 0) {
			compare = this.name.compareTo(ref.name);
			if (compare == 0) {
				compare = this.id.compareTo(ref.id);
			}
		}
		return compare;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((showOrder == null) ? 0 : showOrder.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ProductType other = (ProductType) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (showOrder == null) {
			if (other.showOrder != null)
				return false;
		} else if (!showOrder.equals(other.showOrder))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "ProductType [id=" + id + ", name=" + name + ", showOrder=" + showOrder + "]";
	}
}
