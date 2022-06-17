package com.deepFreeze.be.mongoInventoryManagement.support;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

public class GenericRepository<K, V> {
	@Autowired
	private MongoTemplate mongoTemplate;
	private Class<K> typeClass;

	protected GenericRepository(Class<K> cls) {
		typeClass = cls;
	}

	public List<K> findAll() {
		return mongoTemplate.findAll(typeClass);
	}

	public Optional<K> findById(V id) {
		K doc = mongoTemplate.findById(id, typeClass);
		return doc == null ? Optional.empty() : Optional.of(doc);
	}

	protected List<K> findAll(String criteriaName, String criteriaValue) {
		Query q = new Query();
		q.addCriteria(Criteria.where(criteriaName).is(criteriaValue));
		return mongoTemplate.find(q,typeClass);
	}

	protected List<K> findGteId(String criteriaName, V criteriaValue) {
		Query q = new Query();
		q.addCriteria(Criteria.where(criteriaName).gte(criteriaValue));
		return mongoTemplate.find(q,typeClass);
	}

	public void save(K doc) {
		mongoTemplate.save(doc, typeClass.getSimpleName().toLowerCase());
	}
	
//	public MongoTemplate getTemplate() {
//		return mongoTemplate;
//	}
}
