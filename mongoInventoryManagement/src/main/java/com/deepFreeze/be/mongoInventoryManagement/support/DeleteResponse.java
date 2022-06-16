package com.deepFreeze.be.mongoInventoryManagement.support;

public class DeleteResponse {
	private boolean possible;
	private String message;

	public DeleteResponse() {
	}

	public DeleteResponse(boolean possible, String message) {
		this.possible = possible;
		this.message = message;
	}

	public boolean getPossible() {
		return this.possible;
	}

	public void setPossible(boolean possible) {
		this.possible = possible;
	}

	public String getMessage() {
		return this.message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
