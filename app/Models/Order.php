<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public $table = 'orders';
    public $primary_key = 'id';
    public $timestamp = true;

    protected $fillable = [
        'product_id',
        'user_id',
        'order_number',
        'quantity',
        'is_deleted',
        'total_price'
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }


}
