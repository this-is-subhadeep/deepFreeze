package com.deepFreeze.be.mongoInventoryManagement.product;

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
import com.deepFreeze.be.mongoInventoryManagement.support.DeleteResponse;
import com.deepFreeze.be.mongoInventoryManagement.vendor.Vendor;

@Service
public class ProductService {
	@Autowired
	private ProductTypeRepository productTypeRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	InventoryService inventoryService;

	public List<ProductType> getAllProductTypes() {
		List<ProductType> prodTypeList = productTypeRepository.findAll();
		Collections.sort(prodTypeList);
		return prodTypeList;
	}

	public List<Product> getAllProducts() {
		List<Product> prodList = productRepository.findAll();
		Collections.sort(prodList);
		return prodList;
	}

	public ProductType getProductType(String prodTypId) {
		if (prodTypId != null) {
			Optional<ProductType> prodTypContainer = productTypeRepository.findById(prodTypId);
			return prodTypContainer.isPresent() ? prodTypContainer.get() : null;
		}
		return null;
	}

	public Product getProduct(String prodId) {
		if (prodId != null) {
			Optional<Product> prodContainer = productRepository.findById(prodId);
			return prodContainer.isPresent() ? prodContainer.get() : null;
		}
		return null;
	}

	public List<Product> getProductsByType(String prodTypeId) {
		if (prodTypeId != null) {
			return productRepository.findProductsByType(prodTypeId);
		}
		return null;
	}

	public List<Product> getProductsByType(ProductType prodType) {
		if (prodType != null) {
			return productRepository.findProductsByType(prodType);
		}
		return null;
	}

	public void addProductType(ProductType prodTyp) {
		String prodId = prodTyp.getId();
		if (!productTypeRepository.findById(prodId).isPresent()) {
			productTypeRepository.save(prodTyp);
		}
	}

	public void addProduct(Product prod) {
		if (!productRepository.findById(prod.getId()).isPresent()) {
			productRepository.save(prod);
			addProductType(prod.getProductType());
		}
	}

	public void updateProductType(ProductType prodTyp) {
		if (productTypeRepository.findById(prodTyp.getId()).isPresent()) {
			productTypeRepository.save(prodTyp);
		}
	}

	public void updateProduct(Product prod) {
		if (productRepository.findById(prod.getId()).isPresent()) {
			productRepository.save(prod);
			updateProductType(prod.getProductType());
		}
	}

	public String getNextProductId() {
		String maxProdId = "itm000000";
		for (Product product : getAllProducts()) {
			if (product.getId().compareTo(maxProdId) > 0) {
				maxProdId = product.getId();
			}
		}
		int pidNumber = 0;
		try {
			pidNumber = Integer.parseInt(maxProdId.substring(3));
		} catch (NumberFormatException e) {
			System.out.println(e);
		}
		return maxProdId.substring(0, 3) + String.format("%06d", pidNumber + 1);
	}

	public List<CompleteProduct> getAllCompleteProducts(LocalDate refDate) {
		List<CompleteProduct> compProdList = new ArrayList<>();
		if (refDate != null) {
			getAllProducts().forEach(prod -> {
				if (refDate.compareTo(prod.getStartDate()) >= 0 && refDate.compareTo(prod.getEndDate()) < 0) {
					CompleteProduct compProd = new CompleteProduct();
					compProd.setId(prod.getId());
					compProd.setName(prod.getName());
					compProd.setProductType(prod.getProductType());
					for (ProductDetail detail : prod.getDetails()) {
						if (refDate.compareTo(detail.getId()) >= 0) {
							compProd.setPackageSize(detail.getPackageSize());
							compProd.setCostPrice(detail.getCostPrice());
							compProd.setSellingPrice(detail.getSellingPrice());
							break;
						}
					}
					compProdList.add(compProd);
				}
			});
		}
		return compProdList;
	}

	public List<CompleteProduct> getAllCompleteProducts(List<Product> prods, LocalDate refDate) {
		List<CompleteProduct> compProdList = new ArrayList<>();
		if (refDate != null) {
			prods.forEach(prod -> {
				if (refDate.compareTo(prod.getStartDate()) >= 0 && refDate.compareTo(prod.getEndDate()) < 0) {
					CompleteProduct compProd = new CompleteProduct();
					compProd.setId(prod.getId());
					compProd.setName(prod.getName());
					compProd.setProductType(prod.getProductType());
					for (ProductDetail detail : prod.getDetails()) {
						if (refDate.compareTo(detail.getId()) >= 0) {
							compProd.setPackageSize(detail.getPackageSize());
							compProd.setCostPrice(detail.getCostPrice());
							compProd.setSellingPrice(detail.getSellingPrice());
							break;
						}
					}
					compProdList.add(compProd);
				}
			});
		}
		return compProdList;
	}

	public void addCompleteProduct(CompleteProduct completeProduct, LocalDate refDate) {
		Product prod = new Product();
		prod.setId(completeProduct.getId());
		prod.setName(completeProduct.getName());
		prod.setProductType(completeProduct.getProductType());
		prod.setStartDate(refDate);
		prod.setEndDate(LocalDate.of(9999, 12, 31));
		ProductDetail detail = new ProductDetail(refDate);
		detail.setPackageSize(completeProduct.getPackageSize());
		detail.setCostPrice(completeProduct.getCostPrice());
		detail.setSellingPrice(completeProduct.getSellingPrice());
		SortedSet<ProductDetail> detSet = new TreeSet<>();
		detSet.add(detail);
		prod.setDetails(detSet);
		addProduct(prod);
	}

	public void updateCompleteProduct(CompleteProduct completeProduct, LocalDate refDate) {
		Product prod = getProduct(completeProduct.getId());
		prod.setName(completeProduct.getName());
		prod.setProductType(completeProduct.getProductType());
		if (refDate != null) {
			ProductDetail detail = prod.getDetailOnDate(refDate);
			if (detail != null) {
				prod.getDetails().remove(detail);
			}
			detail = new ProductDetail(refDate);
			detail.setPackageSize(completeProduct.getPackageSize());
			detail.setCostPrice(completeProduct.getCostPrice());
			detail.setSellingPrice(completeProduct.getSellingPrice());
			prod.getDetails().add(detail);
		}
		updateProduct(prod);
	}
	
	public void closeCompleteProduct(CompleteProduct completeProduct, LocalDate endDate) {
		Product prod = getProduct(completeProduct.getId());
		if (prod!=null) {
			prod.setEndDate(endDate);
			productRepository.save(prod);
		}
	}

	public DeleteResponse isDeletePossible(String prodId, LocalDate refDate) {
		DeleteResponse delResp;
		Product prod = getProduct(prodId);
		if (prod != null && refDate != null) {
			if (prod.getStartDate().compareTo(refDate) > 0) {
				delResp = new DeleteResponse(false, "Cannot Delete Product before it was Created");
				return delResp;
			}
		} else {
			delResp = new DeleteResponse(false, "Input Date Incomplete");
			return delResp;
		}
		List<Inventory> inventoryList = inventoryService.getInventoryGte(refDate);
		if (inventoryList != null) {
			for (Inventory inventory : inventoryList) {
				for (StockInOut stockIn : inventory.getStockIn()) {
					if (stockIn.getId().getProductId().equals(prodId)) {
						delResp = new DeleteResponse(false,
								"Delete Not Possible as there is Inventory record(s) for the Product");
						return delResp;
					}
				}
				for (StockInOut stockOut : inventory.getStockOut()) {
					if (stockOut.getId().getProductId().equals(prodId)) {
						delResp = new DeleteResponse(false,
								"Delete Not Possible as there is Inventory record(s) for the Product");
						return delResp;
					}
				}
			}
		}
		delResp = new DeleteResponse(true, "OK");
		return delResp;
	}

}
