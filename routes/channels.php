<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders', function ($user) {
    // Public channel for now; return true to allow anyone to listen
    return true;
});

