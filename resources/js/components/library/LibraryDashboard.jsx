import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LibraryDashboard() {
    const [activeTab, setActiveTab] = useState('books');
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);

    // Form states
    const [newBook, setNewBook] = useState({
        title: '', author: '', isbn: '', category_id: '', quantity: 1, description: ''
    });
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [issueData, setIssueData] = useState({
        book_id: '', user_id: '', due_date: ''
    });

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, [searchTerm, selectedCategory]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/library/books', {
                params: { search: searchTerm, category_id: selectedCategory }
            });
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/library/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/library/books', newBook);
            setShowAddBookModal(false);
            fetchBooks();
            setNewBook({ title: '', author: '', isbn: '', category_id: '', quantity: 1, description: '' });
            alert('Book added successfully');
        } catch (error) {
            alert('Error adding book');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/library/categories', newCategory);
            setShowAddCategoryModal(false);
            fetchCategories();
            setNewCategory({ name: '', description: '' });
            alert('Category added successfully');
        } catch (error) {
            alert('Error adding category');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Library Management</h2>
                <button
                    onClick={() => setShowAddBookModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Add New Book
                </button>
                <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Add Category
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex space-x-4">
                <input
                    type="text"
                    placeholder="Search books..."
                    className="border p-2 rounded w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border p-2 rounded w-1/4"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                        ) : books.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center">No books found</td></tr>
                        ) : (
                            books.map(book => (
                                <tr key={book.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                        <div className="text-sm text-gray-500">{book.isbn}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {book.available} / {book.quantity} Available
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Book Modal */}
            {showAddBookModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Add New Book</h3>
                        <form onSubmit={handleAddBook}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Title" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Author" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="ISBN" value={newBook.isbn} onChange={e => setNewBook({ ...newBook, isbn: e.target.value })} />
                            <select className="w-full mb-2 p-2 border rounded" value={newBook.category_id} onChange={e => setNewBook({ ...newBook, category_id: e.target.value })} required>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <input type="number" className="w-full mb-2 p-2 border rounded" placeholder="Quantity" value={newBook.quantity} onChange={e => setNewBook({ ...newBook, quantity: e.target.value })} required min="1" />
                            <textarea className="w-full mb-4 p-2 border rounded" placeholder="Description" value={newBook.description} onChange={e => setNewBook({ ...newBook, description: e.target.value })}></textarea>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowAddBookModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {showAddCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Add New Category</h3>
                        <form onSubmit={handleAddCategory}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Category Name" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} required />
                            <textarea className="w-full mb-4 p-2 border rounded" placeholder="Description" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}></textarea>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
