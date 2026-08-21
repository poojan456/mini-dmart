package com.Demo_Dmart.Backend.config;

import com.Demo_Dmart.Backend.model.Product;
import com.Demo_Dmart.Backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Reliable direct image links (mostly Wikimedia Commons)
        List<Product> products = Arrays.asList(
            new Product("Fresh Organic Apples", "Crisp and sweet organic apples", "Fruits", 150.0, 150, "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg"),
            new Product("Bananas", "Fresh yellow bananas", "Fruits", 60.0, 200, "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg"),
            new Product("Whole Milk 1L", "Vitamin D fortified whole milk", "Dairy", 65.0, 50, "https://upload.wikimedia.org/wikipedia/commons/c/c8/Oat_milk_glass_and_bottle.jpg"),
            new Product("Free Range Eggs (1 Dozen)", "Grade A Large brown eggs", "Dairy", 85.0, 100, "https://upload.wikimedia.org/wikipedia/commons/1/1b/Brown_chicken_egg.jpg"),
            new Product("Whole Wheat Bread", "Freshly baked whole wheat sliced bread", "Bakery", 45.0, 80, "https://upload.wikimedia.org/wikipedia/commons/7/71/Sliced_bread.jpg"),
            new Product("Organic Carrots", "Crunchy organic carrots", "Vegetables", 40.0, 120, "https://upload.wikimedia.org/wikipedia/commons/4/44/Carrots_-_whole_and_sliced.jpg"),
            new Product("Broccoli Crown", "Fresh green broccoli", "Vegetables", 50.0, 90, "https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg"),
            new Product("Chicken Breast", "Boneless skinless chicken breast", "Meat", 250.0, 40, "https://upload.wikimedia.org/wikipedia/commons/c/cd/Raw_chicken_breasts.jpg"),
            new Product("Ground Beef (80/20)", "Fresh ground beef", "Meat", 350.0, 60, "https://upload.wikimedia.org/wikipedia/commons/5/52/Beef_mince.jpg"),
            new Product("Salmon Fillet", "Wild caught Atlantic salmon", "Seafood", 850.0, 30, "https://upload.wikimedia.org/wikipedia/commons/f/f6/Salmon_fillet.jpg"),
            new Product("Orange Juice 1L", "100% pure squeezed orange juice", "Beverages", 120.0, 70, "https://upload.wikimedia.org/wikipedia/commons/5/58/Orange_juice_1.jpg"),
            new Product("Bottled Water (24 Pack)", "Spring water", "Beverages", 150.0, 100, "https://upload.wikimedia.org/wikipedia/commons/2/22/Bottle_of_water.jpg"),
            new Product("Cheddar Cheese Block", "Sharp cheddar cheese", "Dairy", 200.0, 85, "https://upload.wikimedia.org/wikipedia/commons/6/62/Cheddar_cheese.jpg"),
            new Product("Butter (500g)", "Unsalted sweet cream butter", "Dairy", 260.0, 60, "https://upload.wikimedia.org/wikipedia/commons/9/90/Butter_on_a_white_background.jpg"),
            new Product("Pasta (Spaghetti)", "Enriched macaroni product", "Pantry", 65.0, 200, "https://upload.wikimedia.org/wikipedia/commons/7/71/Spaghetti.jpg"),
            new Product("Tomato Sauce", "Classic marinara sauce", "Pantry", 99.0, 150, "https://upload.wikimedia.org/wikipedia/commons/d/d4/Tomato_sauce.jpg"),
            new Product("White Rice (5 kg)", "Long grain enriched white rice", "Pantry", 350.0, 100, "https://upload.wikimedia.org/wikipedia/commons/c/cf/White_rice.jpg"),
            new Product("Olive Oil (500ml)", "Extra virgin olive oil", "Pantry", 650.0, 45, "https://upload.wikimedia.org/wikipedia/commons/4/43/Olive_oil_bottle.jpg"),
            new Product("Cereal (Honey Nut)", "Toasted oat cereal", "Pantry", 220.0, 80, "https://upload.wikimedia.org/wikipedia/commons/1/1a/Corn_flakes_in_bowl.jpg"),
            new Product("Coffee Beans 250g", "Dark roast whole bean coffee", "Beverages", 350.0, 50, "https://upload.wikimedia.org/wikipedia/commons/c/c5/Roasted_coffee_beans.jpg"),
            new Product("Toilet Paper (12 Rolls)", "Ultra soft bath tissue", "Household", 450.0, 120, "https://upload.wikimedia.org/wikipedia/commons/6/69/Toilet_paper_roll.jpg"),
            new Product("Paper Towels (6 Rolls)", "Absorbent paper towels", "Household", 350.0, 90, "https://upload.wikimedia.org/wikipedia/commons/5/5c/Paper_towel.jpg"),
            new Product("Dish Soap", "Liquid dishwashing soap", "Household", 120.0, 100, "https://upload.wikimedia.org/wikipedia/commons/a/ae/Fairy_dishwashing_liquid.jpg"),
            new Product("Laundry Detergent", "Liquid laundry detergent 64 loads", "Household", 550.0, 40, "https://upload.wikimedia.org/wikipedia/commons/1/1b/Tide_detergent.jpg"),
            new Product("Toothpaste", "Fluoride anticavity toothpaste", "Personal Care", 110.0, 150, "https://upload.wikimedia.org/wikipedia/commons/3/30/Toothpaste_on_brush.jpg"),
            new Product("Shampoo", "Daily moisture renewal shampoo", "Personal Care", 250.0, 80, "https://upload.wikimedia.org/wikipedia/commons/8/87/Shampoo_bottle.jpg")
        );

        List<Product> existingProducts = productRepository.findAll();
        Map<String, Product> existingMap = existingProducts.stream()
                .collect(Collectors.toMap(Product::getName, p -> p, (p1, p2) -> p1));

        for (Product p : products) {
            if (existingMap.containsKey(p.getName())) {
                // Update existing product to fix Unsplash hotlink issues and USD to INR prices
                Product existing = existingMap.get(p.getName());
                existing.setImageUrl(p.getImageUrl());
                existing.setPrice(p.getPrice());
                productRepository.save(existing);
            } else {
                // Also handle the case where the old USD names were slightly different 
                // e.g. "Whole Milk 1 Gallon" vs "Whole Milk 1L"
                if (p.getName().equals("Whole Milk 1L") && existingMap.containsKey("Whole Milk 1 Gallon")) {
                     Product existing = existingMap.get("Whole Milk 1 Gallon");
                     existing.setName("Whole Milk 1L");
                     existing.setImageUrl(p.getImageUrl());
                     existing.setPrice(p.getPrice());
                     productRepository.save(existing);
                     continue;
                }
                if (p.getName().equals("Orange Juice 1L") && existingMap.containsKey("Orange Juice")) {
                     Product existing = existingMap.get("Orange Juice");
                     existing.setName("Orange Juice 1L");
                     existing.setImageUrl(p.getImageUrl());
                     existing.setPrice(p.getPrice());
                     productRepository.save(existing);
                     continue;
                }
                // Save as new if not found
                productRepository.save(p);
            }
        }
        
        System.out.println("✅ DataSeeder: Products checked and updated with real Wikimedia images and INR pricing!");
    }
}
