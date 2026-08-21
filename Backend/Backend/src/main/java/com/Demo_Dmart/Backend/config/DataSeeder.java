package com.Demo_Dmart.Backend.config;

import com.Demo_Dmart.Backend.model.Product;
import com.Demo_Dmart.Backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                new Product("Fresh Organic Apples", "Crisp and sweet organic apples", "Fruits", 2.99, 150, "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=500&q=60"),
                new Product("Bananas", "Fresh yellow bananas", "Fruits", 1.49, 200, "https://images.unsplash.com/photo-1571501478200-249f284d53c1?auto=format&fit=crop&w=500&q=60"),
                new Product("Whole Milk 1 Gallon", "Vitamin D fortified whole milk", "Dairy", 3.49, 50, "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=60"),
                new Product("Free Range Eggs (1 Dozen)", "Grade A Large brown eggs", "Dairy", 4.99, 100, "https://images.unsplash.com/photo-1582722872425-476239414d64?auto=format&fit=crop&w=500&q=60"),
                new Product("Whole Wheat Bread", "Freshly baked whole wheat sliced bread", "Bakery", 2.49, 80, "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=60"),
                new Product("Organic Carrots", "Crunchy organic carrots", "Vegetables", 1.99, 120, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60"),
                new Product("Broccoli Crown", "Fresh green broccoli", "Vegetables", 2.29, 90, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=60"),
                new Product("Chicken Breast", "Boneless skinless chicken breast", "Meat", 7.99, 40, "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=60"),
                new Product("Ground Beef (80/20)", "Fresh ground beef", "Meat", 6.49, 60, "https://images.unsplash.com/photo-1588169124479-7193b2a5146c?auto=format&fit=crop&w=500&q=60"),
                new Product("Salmon Fillet", "Wild caught Atlantic salmon", "Seafood", 12.99, 30, "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=500&q=60"),
                new Product("Orange Juice", "100% pure squeezed orange juice", "Beverages", 4.49, 70, "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60"),
                new Product("Bottled Water (24 Pack)", "Spring water", "Beverages", 5.99, 100, "https://images.unsplash.com/photo-1548839140-29a749e1bc4c?auto=format&fit=crop&w=500&q=60"),
                new Product("Cheddar Cheese Block", "Sharp cheddar cheese", "Dairy", 3.99, 85, "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=500&q=60"),
                new Product("Butter (1 lb)", "Unsalted sweet cream butter", "Dairy", 4.29, 60, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=60"),
                new Product("Pasta (Spaghetti)", "Enriched macaroni product", "Pantry", 1.29, 200, "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=500&q=60"),
                new Product("Tomato Sauce", "Classic marinara sauce", "Pantry", 2.49, 150, "https://images.unsplash.com/photo-1584988775618-9366d40ffdb4?auto=format&fit=crop&w=500&q=60"),
                new Product("White Rice (5 lbs)", "Long grain enriched white rice", "Pantry", 5.49, 100, "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=500&q=60"),
                new Product("Olive Oil (16 oz)", "Extra virgin olive oil", "Pantry", 8.99, 45, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=60"),
                new Product("Cereal (Honey Nut)", "Toasted oat cereal", "Pantry", 3.99, 80, "https://images.unsplash.com/photo-1521483756775-c3702a0a38af?auto=format&fit=crop&w=500&q=60"),
                new Product("Coffee Beans", "Dark roast whole bean coffee", "Beverages", 9.99, 50, "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=500&q=60"),
                new Product("Toilet Paper (12 Rolls)", "Ultra soft bath tissue", "Household", 11.99, 120, "https://images.unsplash.com/photo-1584556812952-905ffd0ccebd?auto=format&fit=crop&w=500&q=60"),
                new Product("Paper Towels (6 Rolls)", "Absorbent paper towels", "Household", 9.99, 90, "https://images.unsplash.com/photo-1584824388151-51216d6cc684?auto=format&fit=crop&w=500&q=60"),
                new Product("Dish Soap", "Liquid dishwashing soap", "Household", 2.99, 100, "https://images.unsplash.com/photo-1584305574627-77fb25be2409?auto=format&fit=crop&w=500&q=60"),
                new Product("Laundry Detergent", "Liquid laundry detergent 64 loads", "Household", 14.99, 40, "https://images.unsplash.com/photo-1584483750532-a53ec86996d9?auto=format&fit=crop&w=500&q=60"),
                new Product("Toothpaste", "Fluoride anticavity toothpaste", "Personal Care", 3.49, 150, "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=500&q=60"),
                new Product("Shampoo", "Daily moisture renewal shampoo", "Personal Care", 5.99, 80, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=60")
            );
            productRepository.saveAll(products);
            System.out.println("✅ Inserted 26 sample products into the database!");
        }
    }
}
