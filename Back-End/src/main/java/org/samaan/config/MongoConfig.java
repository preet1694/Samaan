package org.samaan.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "Samaan_Data"; // Replace with your database name
    }

    @Bean
    @Override
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb+srv://vrajranipa7:Vraj%401242@cluster0.lreyi.mongodb.net/"); // Replace with your connection URI
    }

    @Override
    protected boolean autoIndexCreation() {
        return true;
    }
}
