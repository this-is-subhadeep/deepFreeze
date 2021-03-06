package com.deepFreeze.be.mongoInventoryManagement.inventory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deepFreeze.be.mongoInventoryManagement.product.CompleteProduct;
import com.deepFreeze.be.mongoInventoryManagement.product.ProductService;
import com.deepFreeze.be.mongoInventoryManagement.vendor.CompleteVendor;
import com.deepFreeze.be.mongoInventoryManagement.vendor.VendorService;

@Service
public class InventoryService {

	@Autowired
	InventoryRepository inventoryRepository;
	
	@Autowired
	ProductService productService;

	@Autowired
	VendorService vendorService;

	public List<Inventory> getAllInventory() {
		List<Inventory> invList = inventoryRepository.findAll();
		Collections.sort(invList);
		return invList;
	}

	public Inventory getInventory(LocalDate refDate) {
		Optional<Inventory> inventoryContainer = inventoryRepository.findById(refDate);
		if (inventoryContainer.isPresent()) {
			return inventoryContainer.get();
		}
		return null;
	}

	public void saveInventory(Inventory inventory) {
		inventoryRepository.save(inventory);
	}

	public CompleteInventory getCompleteInventory(LocalDate refDate) {
		List<CompleteVendor> compVens = vendorService.getAllCompleteVendors(refDate);
		CompleteInventory compInv = new CompleteInventory(getDefaultInventoryRows(refDate), compVens);
		List<CompleteProduct> compProds = productService.getAllCompleteProducts(refDate);
		Inventory inv = getInventory(refDate);
		fillStockIn(inv, compInv, compProds);
		fillStockOut(inv, compInv, compProds);
		compInv.getRows().forEach(invRow -> {
			int totalIn = invRow.getStockTotalIn()!=null? invRow.getStockTotalIn() : 0;
			int totalOut = invRow.getStockTotalOut()!=null? invRow.getStockTotalOut() : 0;
			int balance = totalIn - totalOut;
			if(balance!=0) {
				invRow.setStockBalance(totalIn - totalOut);
			}
		});
		return compInv;
	}
	
	private void fillStockIn(Inventory inv, CompleteInventory compInv, List<CompleteProduct> compProds) {
		if (inv!=null) {
			List<StockInOut> stockIns = inv.getStockIn();
			if (stockIns != null) {
				stockIns.forEach(stockIn -> {
					if (stockIn.getId() != null && stockIn.getId().getProductId() != null) {
						compInv.getRows().forEach(row -> {
							if (row.getId().equals(stockIn.getId().getProductId())) {
								if (stockIn.getPackages() != 0) {
									row.setStockSenIn(stockIn.getPackages());
									int packageSize = 0;
									for (CompleteProduct compProd : compProds) {
										if (compProd.getId().equals(stockIn.getId().getProductId())) {
											packageSize = compProd.getPackageSize();
										}
									}
									Integer totalStockIn = row.getStockTotalIn();
									if(totalStockIn==null) {
										totalStockIn = new Integer(0);
									}
									totalStockIn = totalStockIn.intValue() + stockIn.getPackages()*packageSize;
									row.setStockTotalIn(totalStockIn);									
								} else {
									row.setStockSenIn(null);
								}
								if (stockIn.getPieces() != 0) {
									row.setStockOthersIn(stockIn.getPieces());
									Integer totalStockIn = row.getStockTotalIn();
									if(totalStockIn==null) {
										totalStockIn = new Integer(0);
									}
									totalStockIn = totalStockIn.intValue() + stockIn.getPieces();
									row.setStockTotalIn(totalStockIn);									
								} else {
									row.setStockOthersIn(null);
								}
							}
						});
					}
				});
			}
		}
	}
	
	private void fillStockOut(Inventory inv, CompleteInventory compInv, List<CompleteProduct> compProds) {
		if (inv!=null) {
			List<StockInOut> stockOuts = inv.getStockOut();
			if (stockOuts != null) {
				stockOuts.forEach(stockOut -> {
					if (stockOut.getId() != null && stockOut.getId().getProductId() != null) {
						compInv.getRows().forEach(row -> {
							if (row.getId().equals(stockOut.getId().getProductId())) {
								Integer soldUnits = null;
								if (stockOut.getPackages() != 0 || stockOut.getPieces() != 0) {
									int packageSize = 0;
									for (CompleteProduct compProd : compProds) {
										if (compProd.getId().equals(stockOut.getId().getProductId())) {
											packageSize = compProd.getPackageSize();
										}
									}
									soldUnits = stockOut.getPackages() * packageSize + stockOut.getPieces();
								}
								row.getVendorValue().put(stockOut.getId().getActorId(), soldUnits);
								if(soldUnits!=null) {
									Integer totalStockOut = row.getStockTotalOut();
									if(totalStockOut==null) {
										totalStockOut = new Integer(0);
									}
									totalStockOut = totalStockOut.intValue() + soldUnits.intValue();
									row.setStockTotalOut(totalStockOut);
								}
							}
						});
					}
				});
			} 
		}
	}
	
	private List<CompleteInventoryRow> getDefaultInventoryRows(LocalDate refDate) {
		List<CompleteInventoryRow> rows = new ArrayList<>();
		productService.getAllProductTypes().forEach(type -> {
			rows.add(new CompleteInventoryRow(type.getId(), type.getName()));
			productService.getAllCompleteProducts(productService.getProductsByType(type), refDate).forEach(product -> {
				CompleteInventoryRow invRow = new CompleteInventoryRow(product.getId(), product.getName());
				invRow.setProdDets(product);
				rows.add(invRow);
			});
//			productService.getProductsByType(type).forEach(product -> {
//				rows.add(new CompleteInventoryRow(product.getId(), product.getName()));
//			});
		});
		return rows;
	}

	public void saveCompleteInventory(CompleteInventory compInv, LocalDate refDate) {
		List<CompleteProduct> compProds = productService.getAllCompleteProducts(refDate);
		Inventory inv = new Inventory(refDate);
		saveStockIn(compInv, inv, compProds);
		saveStockOut(compInv, inv, compProds);
		inventoryRepository.save(inv);
		compInv.getVens().forEach(vendor -> {
			vendorService.updateCompleteVendor(vendor, refDate);
		}); 
	}
	
	private void saveStockIn(CompleteInventory compInv, Inventory inv, List<CompleteProduct> compProds) {
		compInv.getRows().forEach(row -> {
			if(row.getId().startsWith("itm") && (row.getStockSenIn()!=null || row.getStockOthersIn()!=null)) {
				StockInOut stockIn = new StockInOut();
				stockIn.getId().setProductId(row.getId());
				stockIn.getId().setActorId("whs000001");
				if(row.getStockSenIn()!=null) {
					stockIn.setPackages(row.getStockSenIn().intValue());
				} else {
					stockIn.setPackages(0);
				}
				if(row.getStockOthersIn()!=null) {
					stockIn.setPieces(row.getStockOthersIn().intValue());
				} else {
					stockIn.setPieces(0);
				}
				inv.getStockIn().add(stockIn);
			}
		});
	}
	
	private void saveStockOut(CompleteInventory compInv, Inventory inv, List<CompleteProduct> compProds) {
		compInv.getRows().forEach(row -> {
			if(row.getId().startsWith("itm") && row.getVendorValue()!=null && !row.getVendorValue().isEmpty()) {
				int packageSize = 0;
				for (CompleteProduct compProd : compProds) {
					if (compProd.getId().equals(row.getId())) {
						packageSize = compProd.getPackageSize();
					}
				}
				final int finalPackageSize = packageSize;
				row.getVendorValue().forEach((venId, venVal) -> {
					if(venVal!=null && venVal.intValue()!=0) {
						StockInOut stockOut = new StockInOut();
						stockOut.getId().setProductId(row.getId());
						stockOut.getId().setActorId(venId);
						stockOut.setPackages((int)(venVal/finalPackageSize));
						stockOut.setPieces(venVal%finalPackageSize);
						inv.getStockOut().add(stockOut);
					}
				});
			}
		});
	}
	
}
