<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['provider', 'public_id', 'url', 'format', 'width', 'height', 'bytes'];
}
