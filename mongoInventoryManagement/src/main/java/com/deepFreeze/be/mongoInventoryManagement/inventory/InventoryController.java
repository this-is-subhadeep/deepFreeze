package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InventoryController {
	@Autowired
	InventoryService inventoryService;
	
	@RequestMapping(method = RequestMethod.GET, value = "/inventory")
	public List<Inventory> getAllInventory() {
		return inventoryService.getAllInventory();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/inventory/{refDate}")
	public Inventory getInventory(@PathVariable String refDate) {
		LocalDate refLocalDate = null;
		try {
			refLocalDate = LocalDate.parse(refDate);
			return inventoryService.getInventory(refLocalDate);
		} catch (DateTimeParseException e) {
			System.out.println(e);
		}
		return null;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/complete-inventory/{refDate}")
	public CompleteInventory getCompleteInventory(@PathVariable String refDate) {
		LocalDate refLocalDate = null;
		try {
			refLocalDate = LocalDate.parse(refDate);
			return inventoryService.getCompleteInventory(refLocalDate);
		} catch (DateTimeParseException e) {
			System.out.println(e);
		}
		return null;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/inventory")
	public void saveInventory(@RequestBody Inventory inv) {
		if (inv !=null) {
			inventoryService.saveInventory(inv);
		}
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping(method = RequestMethod.POST, value = "/complete-inventory/{refDate}")
	public void saveCompleteInventory(@PathVariable String refDate, @RequestBody CompleteInventory compInv) {
		if (compInv !=null) {
			inventoryService.saveCompleteInventory(compInv, LocalDate.parse(refDate));
		}
	}

}
