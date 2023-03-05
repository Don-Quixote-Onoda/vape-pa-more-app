<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    use HasFactory;

    public $table = 'product_types';
    public $primary_key = 'id';
    public $timestamp = true;

    protected $fillable = [
        'name',
        'type',
        'is_deleted'
    ];

    public function product() {
        return $this->hasMany(Product::class);
    }
}
