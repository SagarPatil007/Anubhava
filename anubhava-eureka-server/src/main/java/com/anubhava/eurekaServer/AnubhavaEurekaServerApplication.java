package com.anubhava.eurekaServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class AnubhavaEurekaServerApplication {

	@SuppressWarnings("null")
	public static void main(String[] args) {
		SpringApplication.run(AnubhavaEurekaServerApplication.class, args);
	}

}
