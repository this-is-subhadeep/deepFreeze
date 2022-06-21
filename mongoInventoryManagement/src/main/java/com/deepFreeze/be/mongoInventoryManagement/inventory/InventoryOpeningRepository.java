package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.deepFreeze.be.mongoInventoryManagement.support.GenericRepository;

@Repository
public class InventoryOpeningRepository extends GenericRepository<InventoryOpening, LocalDate> {
	public InventoryOpeningRepository() {
		super(InventoryOpening.class);
	}
	public Optional<List<InventoryOpening>> findGteId(LocalDate refDate) {
		List<InventoryOpening> inventoryOPeningList = this.findGteId("_id", refDate);
		return inventoryOPeningList == null ? Optional.empty() : Optional.of(inventoryOPeningList);
	}
}
