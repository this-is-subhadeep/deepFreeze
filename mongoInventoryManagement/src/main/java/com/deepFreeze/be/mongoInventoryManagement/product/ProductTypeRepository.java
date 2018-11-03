package com.deepFreeze.be.mongoInventoryManagement.product;

import org.springframework.stereotype.Repository;

import com.deepFreeze.be.mongoInventoryManagement.support.GenericRepository;

@Repository
public class ProductTypeRepository extends GenericRepository<ProductType, String> {
	public ProductTypeRepository() {
		super(ProductType.class);
	}
}
