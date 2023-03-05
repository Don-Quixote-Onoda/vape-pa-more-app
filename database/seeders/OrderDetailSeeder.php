<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OrderDetail;

class OrderDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
            OrderDetail::create([
                'total_amount' => 11000.2,
                'user_id' => 1,
                'is_deleted' => 0,
                'order_number'=> '3355'
            ]);

            OrderDetail::create([
                'total_amount' => 4000,
                'user_id' => 1,
                'is_deleted' => 0,
                'order_number'=> '0035'
            ]);
    }
}
