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

	@RequestMapping(method = RequestMethod.GET, value = "/complete-Vendors/{refDate}")
	public List<CompleteVendor> getAllCompleteVendors(@PathVariable String refDate) {
		try {
			return service.getAllCompleteVendors(LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/complete-Vendors/{refDate}")
	public void addCompleteVendor(@PathVariable String refDate, @RequestBody CompleteVendor completeVendor) {
		try {
			service.addCompleteVendor(completeVendor, LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping(method = RequestMethod.PUT, value = "/complete-Vendors/{refDate}")
	public void updateCompleteVendor(@PathVariable String refDate, @RequestBody CompleteVendor completeVendor) {
		try {
			service.updateCompleteVendor(completeVendor, LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
	}
}
