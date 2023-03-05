<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logs extends Model
{
    use HasFactory;

    public $table = 'logs';
    public $primary_key = 'id';
    public $timestamp = true;

    protected $fillable = [
        'user_id',
        'payment_id',
        'order_detail_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function payment() {
        return $this->belongsTo(Payment::class);
    }   

    public function order_detail() {
        return $this->belongsTo(OrderDetail::class);
    }
}
