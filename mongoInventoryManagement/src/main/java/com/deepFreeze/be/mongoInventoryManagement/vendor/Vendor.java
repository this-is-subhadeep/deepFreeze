package com.deepFreeze.be.mongoInventoryManagement.vendor;

import java.time.LocalDate;
import java.util.SortedSet;

import org.springframework.data.annotation.Id;

public class Vendor implements Comparable<Vendor> {
	@Id
	private String id;
	private String name;
	private LocalDate startDate;
	private LocalDate endDate;
	private SortedSet<VendorDetail> details;

	public Vendor() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public SortedSet<VendorDetail> getDetails() {
		return details;
	}

	public void setDetails(SortedSet<VendorDetail> details) {
		this.details = details;
	}

	public VendorDetail getDetailOnDate(LocalDate refDate) {
		if (refDate!=null) {
			for (VendorDetail detail : details) {
				if (refDate.equals(detail.getId())) {
					return detail;
				}
			}
		}
		return null;
	}

	public int compareTo(Vendor ref) {
		return this.name.compareTo(ref.name);
	}

	@Override
	public String toString() {
		return "Vendor [id=" + id + ", name=" + name + ", startDate=" + startDate + ", endDate=" + endDate
				+ ", details=" + details + "]";
	}

}
