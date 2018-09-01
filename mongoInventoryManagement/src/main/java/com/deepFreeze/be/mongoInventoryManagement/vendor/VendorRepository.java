package com.deepFreeze.be.mongoInventoryManagement.vendor;

import org.springframework.stereotype.Repository;

import com.deepFreeze.be.mongoInventoryManagement.support.GenericRepository;

@Repository
public class VendorRepository extends GenericRepository<Vendor, String> {
	public VendorRepository() {
		super(Vendor.class);
	}
}
