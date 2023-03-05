<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
            Payment::create([
                'user_id' => 1,
                'order_detail_id' => 1,
                'is_deleted' => 0,
                'purchase' => 11000.2
            ]);

            Payment::create([
                'user_id' => 1,
                'order_detail_id' => 2,
                'is_deleted' => 0,
                'purchase' => 4000
            ]);
    }
}
