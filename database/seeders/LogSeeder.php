<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Logs;

class LogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
            Logs::create([
                'user_id' => 1,
                'payment_id' => 1,
                'order_detail_id' => 1
            ]);

            Logs::create([
                'user_id' => 1,
                'payment_id' => 2,
                'order_detail_id' => 2
            ]);
    }
}
