package com.deepFreeze.be.mongoInventoryManagement.vendor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.SortedSet;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deepFreeze.be.mongoInventoryManagement.inventory.Inventory;
import com.deepFreeze.be.mongoInventoryManagement.inventory.InventoryService;
import com.deepFreeze.be.mongoInventoryManagement.inventory.StockInOut;
import com.deepFreeze.be.mongoInventoryManagement.product.CompleteProduct;
import com.deepFreeze.be.mongoInventoryManagement.product.Product;
import com.deepFreeze.be.mongoInventoryManagement.support.DeleteResponse;

@Service
public class VendorService {

	@Autowired
	VendorRepository vendorRepository;

	@Autowired
	InventoryService inventoryService;

	public List<Vendor> getAllVendors() {
		List<Vendor> venList = vendorRepository.findAll();
		Collections.sort(venList);
		return venList;
	}

	public Vendor getVendor(String venId) {
		if (venId != null) {
			Optional<Vendor> venContainer = vendorRepository.findById(venId);
			return venContainer.isPresent() ? venContainer.get() : null;
		}
		return null;
	}

	public void addVendor(Vendor ven) {
		String venId = ven.getId();
		if (!vendorRepository.findById(venId).isPresent()) {
			vendorRepository.save(ven);
		}
	}

	public void updateVendor(Vendor ven) {
		if (vendorRepository.findById(ven.getId()).isPresent()) {
			vendorRepository.save(ven);
		}
	}

	public String getNextVendorId() {
		String maxVenId = "ven000000";
		for (Vendor vendor : getAllVendors()) {
			if (vendor.getId().compareTo(maxVenId) > 0) {
				maxVenId = vendor.getId();
			}
		}
		int vidNumber = 0;
		try {
			vidNumber = Integer.parseInt(maxVenId.substring(3));
		} catch (NumberFormatException e) {
			System.out.println(e);
		}
		return maxVenId.substring(0, 3) + String.format("%06d", vidNumber + 1);
	}

	private CompleteVendor getCompleteVendorfromVendor(Vendor ven, LocalDate refDate) {
		CompleteVendor compVen = new CompleteVendor();
		compVen.setId(ven.getId());
		compVen.setName(ven.getName());
		compVen.setTotalLoan(getTotalLoan(ven, refDate));
		ven.getDetails().forEach(detail -> {
			if (refDate.compareTo(detail.getId()) == 0) {
				compVen.setLoanAdded((detail.getLoanAdded()));
				compVen.setLoanPayed((detail.getLoanPayed()));
				compVen.setDeposit((detail.getDeposit()));
				compVen.setRemarks((detail.getRemarks()));
			}
		});
		for (VendorDetail detail : ven.getDetails()) {
			if (refDate.compareTo(detail.getId()) >= 0) {
				compVen.setOpeningDp((detail.getOpeningDp()));
				break;
			}
		}
		return compVen;
	}

	public CompleteVendor getCompleteVendor(String id, LocalDate refDate) {
		CompleteVendor compVen = new CompleteVendor();
		if (id != null && refDate != null) {
			compVen = getCompleteVendorfromVendor(getVendor(id), refDate);
		}
		return compVen;
	}

	public List<CompleteVendor> getAllCompleteVendors(LocalDate refDate) {
		List<CompleteVendor> compVenList = new ArrayList<>();
		if (refDate != null) {
			getAllVendors().forEach(ven -> {
				if (refDate.compareTo(ven.getStartDate()) >= 0 && refDate.compareTo(ven.getEndDate()) < 0) {
					compVenList.add(getCompleteVendorfromVendor(ven, refDate));
				}
			});
		}
		return compVenList;
	}

	public void addCompleteVendor(CompleteVendor completeVendor, LocalDate refDate) {
		Vendor ven = new Vendor();
		ven.setId(completeVendor.getId());
		ven.setName(completeVendor.getName());
		ven.setStartDate(refDate);
		ven.setEndDate(LocalDate.of(9999, 12, 31));
		VendorDetail detail = new VendorDetail(refDate);
		detail.setLoanAdded((completeVendor.getLoanAdded()));
		detail.setLoanPayed((completeVendor.getLoanPayed()));
		detail.setOpeningDp((completeVendor.getOpeningDp()));
		detail.setDeposit((completeVendor.getDeposit()));
		detail.setRemarks((completeVendor.getRemarks()));
		SortedSet<VendorDetail> detSet = new TreeSet<>();
		detSet.add(detail);
		ven.setDetails(detSet);
		addVendor(ven);
	}

	public void updateCompleteVendor(CompleteVendor completeVendor, LocalDate refDate) {
		Vendor ven = getVendor(completeVendor.getId());
		ven.setName(completeVendor.getName());
		if (refDate != null) {
			VendorDetail detail = ven.getDetailOnDate(refDate);
			if (detail != null) {
				ven.getDetails().remove(detail);
			}
			detail = new VendorDetail(refDate);
			detail.setLoanAdded((completeVendor.getLoanAdded()));
			detail.setLoanPayed((completeVendor.getLoanPayed()));
			detail.setOpeningDp((completeVendor.getOpeningDp()));
			detail.setDeposit((completeVendor.getDeposit()));
			detail.setRemarks((completeVendor.getRemarks()));
			ven.getDetails().add(detail);
		}
		updateVendor(ven);
	}

	public float getTotalLoan(Vendor ven, LocalDate refDate) {
		float totalLoan = 0;
		if (refDate != null) {
			for (VendorDetail detail : ven.getDetails()) {
				if (refDate.compareTo(detail.getId()) >= 0) {
					totalLoan += detail.getLoanAdded() - detail.getLoanPayed();
				}
			}
		}
		return totalLoan;
	}

	public void closeCompleteVendor(CompleteVendor completeVendor, LocalDate endDate) {
		Vendor ven = getVendor(completeVendor.getId());
		if (ven!=null) {
			ven.setEndDate(endDate);
			vendorRepository.save(ven);
		}
	}

	public DeleteResponse isDeletePossible(String venId, LocalDate refDate) {
		DeleteResponse delResp;
		Vendor ven = getVendor(venId);
		if (ven != null && refDate != null) {
			if (ven.getStartDate().compareTo(refDate) > 0) {
				delResp = new DeleteResponse(false, "Cannot Delete Vendor before it was Created");
				return delResp;
			}
		} else {
			delResp = new DeleteResponse(false, "Input Date Incomplete");
			return delResp;
		}
		List<Inventory> inventoryList = inventoryService.getInventoryGte(refDate);
		if (inventoryList != null) {
			for (Inventory inventory : inventoryList) {
				for (StockInOut stockOut : inventory.getStockOut()) {
					if (stockOut.getId().getActorId().equals(venId)) {
						delResp = new DeleteResponse(false,
								"Delete Not Possible as there is Inventory record(s) for the Vendor");
						return delResp;
					}
				}
			}
		}
		if (getTotalLoan(ven, refDate) == 0) {
			delResp = new DeleteResponse(true, "OK");
		} else {
			delResp = new DeleteResponse(true, "Delete Possible but Vendor has non zero Loan till this Date");
		}
		return delResp;
	}
}
