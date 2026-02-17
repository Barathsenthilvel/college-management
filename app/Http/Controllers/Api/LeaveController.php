<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        $query = Leave::with('user');

        if (! $request->user()->hasRole('admin')) {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $leaves = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($leaves);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type' => 'required|in:sick,casual,emergency,other',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'reason' => 'required|string',
            'attachment' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'pending';

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('leaves', 'public');
            $validated['attachment'] = $path;
        }

        $leave = Leave::create($validated);

        return response()->json($leave->load('user'), 201);
    }

    public function show(Leave $leave)
    {
        return response()->json($leave->load('user'));
    }

    public function update(Request $request, Leave $leave)
    {
        if (! $request->user()->hasRole('admin') && $leave->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'from_date' => 'sometimes|required|date',
            'to_date' => 'sometimes|required|date|after_or_equal:from_date',
            'reason' => 'sometimes|required|string',
        ]);

        $leave->update($validated);

        return response()->json($leave->load('user'));
    }

    public function approve(Request $request, Leave $leave)
    {
        $request->validate([
            'admin_remarks' => 'nullable|string',
        ]);

        $leave->update([
            'status' => 'approved',
            'admin_remarks' => $request->admin_remarks,
        ]);

        $this->sendLeaveEmail($leave, 'approved');

        return response()->json($leave->load('user'));
    }

    public function reject(Request $request, Leave $leave)
    {
        $request->validate([
            'admin_remarks' => 'required|string',
        ]);

        $leave->update([
            'status' => 'rejected',
            'admin_remarks' => $request->admin_remarks,
        ]);

        $this->sendLeaveEmail($leave, 'rejected');

        return response()->json($leave->load('user'));
    }

    private function sendLeaveEmail(Leave $leave, string $status)
    {
        $user = $leave->user;
        if ($user && $user->email) {
            $subject = "Leave Request {$status}";
            $message = "Your leave request from {$leave->from_date} to {$leave->to_date} has been {$status}.";
            if ($leave->admin_remarks) {
                $message .= "\n\nRemarks: {$leave->admin_remarks}";
            }

            Mail::raw($message, function ($mail) use ($user, $subject) {
                $mail->to($user->email)->subject($subject);
            });
        }
    }
}

