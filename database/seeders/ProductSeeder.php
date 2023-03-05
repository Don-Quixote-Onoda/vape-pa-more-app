<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
            Product::create([
                'product_name' => 'Absurb Lethal UBE',
                'product_image' => '/image/product.jpg',
                'price' => 200.50,
                'status' => 1,
                'product_type_id' => 1,
                'quantity' => 20,
                'is_deleted' => 0
            ]);

            Product::create([
                'product_name' => 'Absurb Lethal UBE',
                'product_image' => '/image/product.jpg',
                'price' => 200.50,
                'status' => 1,
                'product_type_id' => 2,
                'quantity' => 5,
                'is_deleted' => 0
            ]);

            Product::create([
                'product_name' => 'Geek Vape',
                'product_image' => '/image/product.jpg',
                'price' => 3000,
                'status' => 1,
                'product_type_id' => 4,
                'quantity' => 1,
                'is_deleted' => 0
            ]);

            Product::create([
                'product_name' => 'Sample Tank',
                'product_image' => '/image/product.jpg',
                'price' => 500,
                'status' => 1,
                'product_type_id' => 5,
                'quantity' => 2,
                'is_deleted' => 0
            ]);


    }
}
