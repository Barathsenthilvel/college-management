<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    public function index()
    {
        $logs = \App\Models\ActivityLog::with('user')->latest()->paginate(20);
        return response()->json($logs);
    }
}
