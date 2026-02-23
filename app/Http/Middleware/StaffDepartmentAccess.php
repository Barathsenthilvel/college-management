<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StaffDepartmentAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        // If the user is staff, block access. Admin bypassing these routes.
        if ($user && $user->hasRole('staff')) {
            return response()->json([
                'message' => 'Unauthorized. Staff do not have access to this resource.'
            ], 403);
        }

        return $next($request);
    }
}
