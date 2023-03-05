<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    public $table = 'payments';
    public $primary_key = 'id';
    public $timestamp = true;

    protected $fillable = [
        'user_id',
        'order_detail_id',
        'purchase',
        'is_deleted'
    ];

    public function order_detail() {
        return $this->belongsTo(OrderDetail::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
