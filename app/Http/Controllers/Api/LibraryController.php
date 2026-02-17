<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    // List books
    public function books(Request $request)
    {
        $query = \App\Models\Book::with('category');
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('author', 'like', '%' . $request->search . '%')
                  ->orWhere('isbn', 'like', '%' . $request->search . '%');
        }
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        return response()->json($query->paginate(10));
    }

    // Add book
    public function storeBook(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'nullable|string|unique:books,isbn',
            'category_id' => 'required|exists:book_categories,id',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = \App\Models\Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'isbn' => $request->isbn,
            'category_id' => $request->category_id,
            'quantity' => $request->quantity,
            'available' => $request->quantity, // Initially all available
            'description' => $request->description
        ]);

        return response()->json($book, 201);
    }

    // Update book
    public function updateBook(Request $request, \App\Models\Book $book)
    {
         $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'nullable|string|unique:books,isbn,' . $book->id,
            'category_id' => 'required|exists:book_categories,id',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Adjust available quantity if total quantity changes
        $diff = $request->quantity - $book->quantity;
        $book->update([
            'title' => $request->title,
            'author' => $request->author,
            'isbn' => $request->isbn,
            'category_id' => $request->category_id,
            'quantity' => $request->quantity,
            'available' => $book->available + $diff,
            'description' => $request->description
        ]);

        return response()->json($book);
    }
    
    // Delete book
    public function destroyBook(\App\Models\Book $book)
    {
        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }

    // Categories
    public function categories()
    {
        return response()->json(\App\Models\BookCategory::all());
    }
    
    public function storeCategory(Request $request)
    {
         $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'name' => 'required|string|unique:book_categories,name',
            'description' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $category = \App\Models\BookCategory::create($request->all());
        return response()->json($category, 201);
    }

    // Issue Book
    public function issueBook(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:users,id',
            'due_date' => 'required|date|after:today'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = \App\Models\Book::find($request->book_id);
        if ($book->available < 1) {
             return response()->json(['message' => 'Book not available'], 400);
        }

        $issue = \App\Models\BookIssue::create([
            'book_id' => $request->book_id,
            'user_id' => $request->user_id,
            'issue_date' => now(),
            'due_date' => $request->due_date,
            'status' => 'issued'
        ]);

        $book->decrement('available');

        return response()->json($issue, 201);
    }

    // Return Book
    public function returnBook(Request $request, \App\Models\BookIssue $issue)
    {
        if ($issue->status == 'returned') {
            return response()->json(['message' => 'Book already returned'], 400);
        }

        $issue->update([
            'return_date' => now(),
            'status' => 'returned',
            'remarks' => $request->remarks
        ]);

        $issue->book->increment('available');

        return response()->json($issue);
    }
    
    // My Books (Student)
    public function myBooks(Request $request)
    {
        $user = $request->user();
        $issues = \App\Models\BookIssue::with('book')
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json($issues);
    }
}
