<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\Category;

class UpdateProductCategoryIds extends Command
{
    protected $signature = 'products:update-category-ids';
    protected $description = 'Update existing products with category IDs based on category names';

    public function handle()
    {
        $products = Product::all();
        $updatedCount = 0;

        foreach ($products as $product) {
            $updated = false;

            if (!empty($product->category_2)) {
                $category2 = Category::where('name', $product->category_2)->first();
                if ($category2) {
                    $product->category_2_id = $category2->id;
                    $updated = true;
                    $this->info("Updated {$product->name}: category_2 '{$product->category_2}' -> ID: {$category2->id}");
                } else {
                    $this->warn("Category not found for {$product->name}: category_2 '{$product->category_2}'");
                }
            }
            if (!empty($product->category_3)) {
                $category3 = Category::where('name', $product->category_3)->first();
                if ($category3) {
                    $product->category_3_id = $category3->id;
                    $updated = true;
                    $this->info("Updated {$product->name}: category_3 '{$product->category_3}' -> ID: {$category3->id}");
                } else {
                    $this->warn("Category not found for {$product->name}: category_3 '{$product->category_3}'");
                }
            }

            if ($updated) {
                $product->save();
                $updatedCount++;
            }
        }

        $this->info("\n✅ Updated category IDs for {$updatedCount} products.");

        $this->info("\n📊 Summary:");
        $withCategory2 = Product::whereNotNull('category_2_id')->count();
        $withCategory3 = Product::whereNotNull('category_3_id')->count();
        $this->info("Products with category_2_id: {$withCategory2}");
        $this->info("Products with category_3_id: {$withCategory3}");
    }
}
