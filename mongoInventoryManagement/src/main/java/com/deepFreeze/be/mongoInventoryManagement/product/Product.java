package com.deepFreeze.be.mongoInventoryManagement.product;

import java.time.LocalDate;
import java.util.SortedSet;

import org.springframework.data.annotation.Id;

public class Product implements Comparable<Product> {
	@Id
	private String id;
	private String name;
	private ProductType productType;
	private LocalDate startDate;
	private LocalDate endDate;
	private SortedSet<ProductDetail> details;

	public Product() {
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

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public SortedSet<ProductDetail> getDetails() {
		return details;
	}

	public void setDetails(SortedSet<ProductDetail> details) {
		this.details = details;
	}

	public ProductDetail getDetailOnDate(LocalDate refDate) {
		if (refDate!=null) {
			for (ProductDetail detail : details) {
				if (refDate.equals(detail.getId())) {
					return detail;
				}
			}
		}
		return null;
	}
	public int compareTo(Product ref) {
		int compareType = this.productType.compareTo(ref.productType);
		if (compareType == 0) {
			int compareName = this.name.compareTo(ref.name);
			if (compareName == 0) {
				return this.id.compareTo(ref.id);
			} else {
				return compareName;
			}
		} else {
			return compareType;
		}
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((details == null) ? 0 : details.hashCode());
		result = prime * result + ((endDate == null) ? 0 : endDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((productType == null) ? 0 : productType.hashCode());
		result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
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
		Product other = (Product) obj;
		if (details == null) {
			if (other.details != null)
				return false;
		} else if (!details.equals(other.details))
			return false;
		if (endDate == null) {
			if (other.endDate != null)
				return false;
		} else if (!endDate.equals(other.endDate))
			return false;
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
		if (productType == null) {
			if (other.productType != null)
				return false;
		} else if (!productType.equals(other.productType))
			return false;
		if (startDate == null) {
			if (other.startDate != null)
				return false;
		} else if (!startDate.equals(other.startDate))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", productType=" + productType + ", startDate=" + startDate
				+ ", endDate=" + endDate + ", details=" + details + "]";
	}

}
