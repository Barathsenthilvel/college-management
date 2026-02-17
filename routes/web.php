<?php

use Illuminate\Support\Facades\Route;

// Root route - show welcome page (React will handle routing)
Route::get('/', function () {
    return view('welcome');
});

// Catch all other routes and return the welcome view for React Router to handle
// API routes are handled separately in routes/api.php
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
