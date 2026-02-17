<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CollegeNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = CollegeNotification::with('user', 'department');

        if ($request->user()->hasRole('admin')) {
            // Admin can see all notifications
        } elseif ($request->user()->hasRole('staff')) {
            // Staff can see department and all notifications
            $query->where(function ($q) use ($request) {
                $q->where('type', 'all')
                  ->orWhere('type', 'department')
                  ->orWhere('user_id', $request->user()->id);
            });
        } else {
            // Students can see their own and all notifications
            $query->where(function ($q) use ($request) {
                $q->where('type', 'all')
                  ->orWhere('user_id', $request->user()->id);
            });
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'department_id' => 'nullable|exists:departments,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:individual,department,all',
            'category' => 'required|in:announcement,alert,reminder',
            'channels' => 'required|array',
            'channels.*' => 'in:app,sms,email',
        ]);

        if ($validated['type'] === 'all') {
            $validated['user_id'] = null;
            $validated['department_id'] = null;
        } elseif ($validated['type'] === 'department') {
            $validated['user_id'] = null;
        } else {
            $validated['department_id'] = null;
        }

        $notification = CollegeNotification::create($validated);

        // Process Channels
        $this->processNotificationChannels($notification, $validated['channels']);

        return response()->json($notification, 201);
    }

    public function markAsRead(CollegeNotification $notification)
    {
        $notification->update(['is_read' => true]);

        return response()->json($notification);
    }

    private function processNotificationChannels(CollegeNotification $notification, array $channels)
    {
        $users = collect();

        if ($notification->type === 'all') {
            $users = User::all();
        } elseif ($notification->type === 'department') {
            $users = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['staff', 'student']);
            })->when($notification->department_id, function($q) use ($notification) {
                 // Assuming users have department relation or logic to filter by department
                 // For now, if User model has department_id, use it.
                 // Checking if department_id column exists or relation
                 return $q->where('department_id', $notification->department_id);
            })->get();
        } else {
            $users = collect([User::find($notification->user_id)]);
        }

        foreach ($users as $user) {
            if (!$user) continue;

            if (in_array('email', $channels) && $user->email) {
                // Simulate Email
                // Mail::raw($notification->message, function ($message) use ($user, $notification) {
                //     $message->to($user->email)->subject($notification->title);
                // });
            }

            if (in_array('sms', $channels) && $user->phone_number) {
                 // Simulate SMS
            }
        }
    }
}

