package com.deepFreeze.be.mongoInventoryManagement.vendor;

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

import com.deepFreeze.be.mongoInventoryManagement.product.CompleteProduct;
import com.deepFreeze.be.mongoInventoryManagement.support.DeleteResponse;
import com.deepFreeze.be.mongoInventoryManagement.support.StringResponse;

@RestController
public class VendorController {
	
	@Autowired
	VendorService service;

	@RequestMapping(method = RequestMethod.GET, value = "/vendors")
	public List<Vendor> getAllVendors() {
		return service.getAllVendors();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/vendors/{id}")
	public Vendor getVendor(@PathVariable String id) {
		return service.getVendor(id);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/vendor-next-id", produces = "application/json")
	public StringResponse getNextVendorId() {
		StringResponse response = new StringResponse();
		response.setResponse(service.getNextVendorId());
		return response;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/vendors")
	public void insertVendor(@RequestBody Vendor ven) {
		System.out.println("Inserting Vendor");
		if (ven != null) {
			service.addVendor(ven);
		}
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/vendors")
	public void updateVendor(@RequestBody Vendor ven) {
		if (ven != null) {
			service.updateVendor(ven);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/complete-vendors/{refDate}")
	public List<CompleteVendor> getAllCompleteVendors(@PathVariable String refDate) {
		try {
			return service.getAllCompleteVendors(LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/complete-vendor/{id}/{refDate}")
	public CompleteVendor getCompleteVendors(@PathVariable String id, @PathVariable String refDate) {
		try {
			return service.getCompleteVendor(id, LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/complete-vendors/{refDate}")
	public CompleteVendor addCompleteVendor(@PathVariable String refDate, @RequestBody CompleteVendor completeVendor) {
		try {
			LocalDate date = LocalDate.parse(refDate);
			service.addCompleteVendor(completeVendor, date);
			return service.getCompleteVendor(completeVendor.getId(), date);
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping(method = RequestMethod.PUT, value = "/complete-vendors/{refDate}")
	public CompleteVendor updateCompleteVendor(@PathVariable String refDate, @RequestBody CompleteVendor completeVendor) {
		try {
			LocalDate date = LocalDate.parse(refDate);
			service.updateCompleteVendor(completeVendor, date);
			return service.getCompleteVendor(completeVendor.getId(), date);
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping(method = RequestMethod.PUT, value = "/complete-vendors/close/{refDate}")
	public void closeCompleteVendor(@PathVariable String refDate, @RequestBody CompleteVendor completeVendor) {
		try {
			service.closeCompleteVendor(completeVendor, LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/can-delete-vendor/{id}/{refDate}")
	public DeleteResponse isDeleteVendorPossible(@PathVariable String id, @PathVariable String refDate) {
		try {
			LocalDate date = LocalDate.parse(refDate);
			return service.isDeletePossible(id, date);
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/can-bill-vendor/{id}/{refDate}")
	public DeleteResponse isBillVendorPossible(@PathVariable String id, @PathVariable String refDate) {
		try {
			LocalDate date = LocalDate.parse(refDate);
			return service.isBillPossible(id, date);
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}
}
