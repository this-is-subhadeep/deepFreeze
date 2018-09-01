package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.time.LocalDate;

import org.springframework.stereotype.Repository;

import com.deepFreeze.be.mongoInventoryManagement.support.GenericRepository;

@Repository
public class InventoryRepository extends GenericRepository<Inventory, LocalDate> {
	public InventoryRepository() {
		super(Inventory.class);
	}
}

