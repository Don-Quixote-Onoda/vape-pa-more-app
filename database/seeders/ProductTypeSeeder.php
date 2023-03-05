<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductType;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
            ProductType::create([
                'name' => 'Juice',
                'is_deleted' => 0,
                'type' => '3mg'
            ]);

            ProductType::create([
                'name' => 'Juice',
                'is_deleted' => 0,
                'type' => '6mg'
            ]);

            ProductType::create([
                'name' => 'Juice',
                'is_deleted' => 0,
                'type' => '0mg'
            ]);

            ProductType::create([
                'name' => 'Vape',
                'is_deleted' => 0,
                'type' => 'N/A'
            ]);

            ProductType::create([
                'name' => 'Tank',
                'is_deleted' => 0,
                'type' => 'N/A'
            ]);
    }
}
