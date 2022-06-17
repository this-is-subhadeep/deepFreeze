package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.deepFreeze.be.mongoInventoryManagement.support.GenericRepository;

@Repository
public class InventoryRepository extends GenericRepository<Inventory, LocalDate> {
	public InventoryRepository() {
		super(Inventory.class);
	}
	public Optional<List<Inventory>> findGteId(LocalDate refDate) {
		List<Inventory> inventoryList = this.findGteId("_id", refDate);
		return inventoryList == null ? Optional.empty() : Optional.of(inventoryList);
	}
}

