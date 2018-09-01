package com.deepFreeze.be.mongoInventoryManagement.product;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductTypeRepository extends MongoRepository<ProductType, String> {

}
