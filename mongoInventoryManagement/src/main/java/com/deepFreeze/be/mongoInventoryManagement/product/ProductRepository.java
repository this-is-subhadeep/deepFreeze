package com.deepFreeze.be.mongoInventoryManagement.product;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.deepFreeze.be.mongoInventoryManagement.support.GenericRepository;

@Repository
public class ProductRepository extends GenericRepository<Product, String> {
	public ProductRepository() {
		super(Product.class);
	}
	public List<Product> findProductsByType(ProductType prodType) {
		return findAll("productType._id", prodType.getId());
	}
	public List<Product> findProductsByType(String prodTypeId) {
		return findAll("productType._id", prodTypeId);
	}
}
