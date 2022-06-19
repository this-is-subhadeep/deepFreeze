package com.deepFreeze.be.mongoInventoryManagement.product;

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

import com.deepFreeze.be.mongoInventoryManagement.support.DeleteResponse;
import com.deepFreeze.be.mongoInventoryManagement.support.StringResponse;

@RestController
public class ProductController {
	@Autowired
	ProductService productService;

	@RequestMapping(method = RequestMethod.GET, value = "/product-types")
	public List<ProductType> getAllProductTypes() {
		return productService.getAllProductTypes();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/products")
	public List<Product> getAllProducts() {
		return productService.getAllProducts();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/products/{id}")
	public Product getProduct(@PathVariable String id) {
		return productService.getProduct(id);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/product-next-id", produces = "application/json")
	public StringResponse getNextProductId() {
		StringResponse response = new StringResponse();
		response.setResponse(productService.getNextProductId());
		return response;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/product-by-type/{typeId}")
	public List<Product> getProductsByType(@PathVariable String typeId) {
		return productService.getProductsByType(typeId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/products")
	public void insertProduct(@RequestBody Product prod) {
		System.out.println("Inserting Product");
		if (prod != null) {
			productService.addProduct(prod);
		}
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/products")
	public void updateProduct(@RequestBody Product prod) {
		if (prod != null) {
			productService.updateProduct(prod);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/complete-products/{refDate}")
	public List<CompleteProduct> getAllCompleteProducts(@PathVariable String refDate) {
		try {
			return productService.getAllCompleteProducts(LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/complete-products/{refDate}")
	public void addCompleteProduct(@PathVariable String refDate, @RequestBody CompleteProduct completeProduct) {
		try {
			productService.addCompleteProduct(completeProduct, LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping(method = RequestMethod.PUT, value = "/complete-products/{refDate}")
	public void updateCompleteProduct(@PathVariable String refDate, @RequestBody CompleteProduct completeProduct) {
		try {
			productService.updateCompleteProduct(completeProduct, LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping(method = RequestMethod.PUT, value = "/complete-products/close/{refDate}")
	public void closeCompleteProduct(@PathVariable String refDate, @RequestBody CompleteProduct completeProduct) {
		try {
			productService.closeCompleteProduct(completeProduct, LocalDate.parse(refDate));
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/can-delete-product//{id}/{refDate}")
	public DeleteResponse isDeleteProductPossible(@PathVariable String id, @PathVariable String refDate) {
		try {
			LocalDate date = LocalDate.parse(refDate);
			return productService.isDeletePossible(id, date);
		} catch (DateTimeParseException e) {
			e.printStackTrace(System.out);
		}
		return null;
	}
}
