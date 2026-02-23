<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fee;
use App\Models\FeeTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Fee::with('student.department');

        if (auth()->user()->hasRole('student')) {
            $student = auth()->user()->student;
            if ($student) {
                $query->where('student_id', $student->id);
            } else {
                return response()->json(['data' => []]);
            }
        }

        if ($request->has('student_id') && !auth()->user()->hasRole('student')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('paid_date', [$request->from_date, $request->to_date]);
        }

        $fees = $query->paginate(15);

        return response()->json($fees);
    }

    public function store(Request $request)
    {
        if (auth()->user()->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized. Students cannot add fee records.'], 403);
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'total_amount' => 'required|numeric|min:0',
            'type' => 'required|string',
            'due_date' => 'required|date',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|required_with:paid_amount|in:cash,upi,card,bank_transfer',
            'transaction_ref' => 'nullable|string',
            'payment_date' => 'nullable|date',
            'remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $paidAmount = $validated['paid_amount'] ?? 0;
            $status = 'pending';
            
            if ($paidAmount >= $validated['total_amount']) {
                $status = 'paid';
            } elseif ($paidAmount > 0) {
                $status = 'partial';
            }

            $fee = Fee::create([
                'student_id' => $validated['student_id'],
                'total_amount' => $validated['total_amount'],
                'type' => $validated['type'],
                'due_date' => $validated['due_date'],
                'status' => $status,
            ]);

            if ($paidAmount > 0) {
                FeeTransaction::create([
                    'fee_id' => $fee->id,
                    'amount' => $paidAmount,
                    'payment_mode' => $validated['payment_mode'],
                    'transaction_ref' => $validated['transaction_ref'] ?? null,
                    'payment_date' => $validated['payment_date'] ?? now(),
                    'remarks' => $validated['remarks'] ?? null,
                ]);
            }

            DB::commit();
            return response()->json($fee->load('student', 'transactions'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create fee record: ' . $e->getMessage()], 500);
        }
    }

    public function show(Fee $fee)
    {
        return response()->json($fee->load('student.department'));
    }

    public function addPayment(Request $request, Fee $fee)
    {
        if (auth()->user()->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized. Students cannot add payments here.'], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_mode' => 'required|in:cash,upi,card,bank_transfer',
            'transaction_ref' => 'nullable|string',
            'payment_date' => 'required|date',
            'remarks' => 'nullable|string',
        ]);

        $currentPaid = $fee->transactions()->sum('amount');
        $remaining = $fee->total_amount - $currentPaid;

        if ($validated['amount'] > $remaining) {
            return response()->json(['error' => 'Payment amount exceeds remaining balance.'], 422);
        }

        DB::beginTransaction();
        try {
            FeeTransaction::create([
                'fee_id' => $fee->id,
                'amount' => $validated['amount'],
                'payment_mode' => $validated['payment_mode'],
                'transaction_ref' => $validated['transaction_ref'] ?? null,
                'payment_date' => $validated['payment_date'],
                'remarks' => $validated['remarks'] ?? null,
            ]);

            $newPaid = $currentPaid + $validated['amount'];
            if ($newPaid >= $fee->total_amount) {
                $fee->status = 'paid';
            } else {
                $fee->status = 'partial';
            }
            $fee->save();

            DB::commit();
            return response()->json($fee->load('student', 'transactions'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to process payment.'], 500);
        }
    }

    public function update(Request $request, Fee $fee)
    {
        if (auth()->user()->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Only allow updating basic details not affecting payments directly for now
        $validated = $request->validate([
            'total_amount' => 'sometimes|numeric|min:0',
            'due_date' => 'sometimes|date',
            'type' => 'sometimes|string',
        ]);

        $fee->update($validated);

        return response()->json($fee->load('student'));
    }

    public function destroy(Fee $fee)
    {
        if (auth()->user()->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $fee->delete();

        return response()->json(['message' => 'Fee record deleted successfully']);
    }

    public function getStatistics()
    {
        if (auth()->user()->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $totalDemand = Fee::sum('total_amount');
        $totalCollected = FeeTransaction::sum('amount');
        $pendingAmount = $totalDemand - $totalCollected;
        
        $paidFeesCount = Fee::where('status', 'paid')->count();
        $partialFeesCount = Fee::where('status', 'partial')->count();
        $pendingFeesCount = Fee::where('status', 'pending')->count();
        $overdueFeesCount = Fee::where('status', 'overdue')->count();

        return response()->json([
            'total_demand' => $totalDemand,
            'total_collected' => $totalCollected,
            'pending_amount' => $pendingAmount,
            'paid_count' => $paidFeesCount,
            'partial_count' => $partialFeesCount,
            'pending_count' => $pendingFeesCount,
            'overdue_count' => $overdueFeesCount,
            'collection_rate' => $totalDemand > 0 ? round(($totalCollected / $totalDemand) * 100, 2) : 0,
        ]);
    }
}

