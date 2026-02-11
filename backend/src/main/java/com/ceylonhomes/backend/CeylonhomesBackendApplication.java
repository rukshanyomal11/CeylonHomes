package com.ceylonhomes.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CeylonhomesBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CeylonhomesBackendApplication.class, args);
		System.out.println("\n🏠 CeylonHomes Backend API is running!");
		System.out.println("📍 API URL: http://localhost:8080");
		System.out.println("🔐 Admin Login: admin@ceylonhomes.lk / Admin@123\n");
	}

}
