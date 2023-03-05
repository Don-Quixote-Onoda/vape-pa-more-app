<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $table = 'products';
    public $primary_key = 'id';
    public $timestamp = true;

    protected $fillable = [
        'product_name',
        'product_image',
        'price',
        'status',
        'product_type_id',
        'quantity',
        'is_deleted'
    ];

    public function order() {
        return $this->hasMany(Order::class);
    }

    public function product_type() {
        return $this->belongsTo(ProductType::class);
    }
}
