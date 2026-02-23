import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [expandedFields, setExpandedFields] = useState({});

    const toggleMenu = (key) => {
        setExpandedFields(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Icon Components
    const DashboardIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    const DepartmentIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );

    const StudentIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const StaffIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const AttendanceIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const FeesIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const LeavesIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const NotificationsIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );

    const SubjectsIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );

    const ExamsIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h4m-7 4h10a2 2 0 002-2V6.5A1.5 1.5 0 0017.5 5H16V4a2 2 0 00-2-2H10a2 2 0 00-2 2v1H6.5A1.5 1.5 0 005 6.5V18a2 2 0 002 2zM10 4h4v2h-4V4z" />
        </svg>
    );

    const ReportsIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6m4 6V7m4 10V9M5 21h14a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0015.586 2H5a2 2 0 00-2 2v15a2 2 0 002 2z" />
        </svg>
    );

    const SettingsIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const LibraryIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );

    const TimetableIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const EventIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const HostelIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    const TransportIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
    );

    const AuditIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    );

    const IdCardIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
    );

    // Role-based menu configuration
    const baseMenuItems = [
        { key: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
        { key: 'departments', path: '/departments', label: 'Departments', icon: DepartmentIcon },
        { key: 'students', path: '/students', label: 'Students', icon: StudentIcon },
        { key: 'staff', path: '/staff', label: 'Staff', icon: StaffIcon },
        { key: 'subjects', path: '/subjects', label: 'Subjects', icon: SubjectsIcon },
        { key: 'attendance', path: '/attendance', label: 'Attendance', icon: AttendanceIcon },
        { key: 'fees', path: '/fees', label: 'Fees', icon: FeesIcon },
        {
            key: 'leaves', label: 'Leaves', icon: LeavesIcon, subItems: [
                { path: '/leaves/apply', label: 'Apply Leave' },
                { path: '/leaves/status', label: 'Leave Status' },
            ]
        },
        { key: 'notifications', path: '/notifications', label: 'Notifications', icon: NotificationsIcon },
        { key: 'library', path: '/library', label: 'Library', icon: LibraryIcon },
        { key: 'timetable', path: '/timetable', label: 'Timetable', icon: TimetableIcon },
        { key: 'events', path: '/events', label: 'Events', icon: EventIcon },
        { key: 'hostel', path: '/hostel', label: 'Hostel', icon: HostelIcon },
        { key: 'transport', path: '/transport', label: 'Transport', icon: TransportIcon },
        { key: 'audit', path: '/audit-logs', label: 'Audit Logs', icon: AuditIcon },
        { key: 'id-cards', path: '/id-cards', label: 'ID Cards', icon: IdCardIcon },
        { key: 'exams', path: '/exams', label: 'Exams & Marks', icon: ExamsIcon },
        // 'reports' menu temporarily hidden until page is stable
        // { key: 'reports', path: '/reports', label: 'Reports', icon: ReportsIcon },
        {
            key: 'settings', label: 'Settings', icon: SettingsIcon, subItems: [
                { path: '/settings/academic-years', label: 'Academic Years' },
                { path: '/settings/backups', label: 'Backups' },
                { path: '/settings/change-password', label: 'Change Password' },
                { path: '#logout', label: 'Logout', action: true },
            ]
        },
    ];

    const getMenuForRole = (role) => {
        switch (role) {
            case 'admin':
                // Admin sees all menus
                return baseMenuItems;
            case 'staff':
                // Staff: exclude admin-only menus
                return baseMenuItems.filter((item) =>
                    !['departments', 'roles', 'audit', 'fees', 'reports', 'settings'].includes(item.key)
                ).concat([
                    {
                        key: 'settings', label: 'Settings', icon: SettingsIcon, subItems: [
                            { path: '/settings/change-password', label: 'Change Password' },
                            { path: '#logout', label: 'Logout', action: true },
                        ]
                    }
                ]);
            case 'student':
                // Students: Dashboard, Profile, Attendance, Results/Marks, Fees, ID Card, Leave, Notifications, Settings
                return baseMenuItems.filter((item) =>
                    ['dashboard', 'attendance', 'exams', 'fees', 'id-cards', 'leaves', 'notifications'].includes(item.key)
                ).concat([
                    {
                        key: 'settings', label: 'Settings', icon: SettingsIcon, subItems: [
                            { path: '/settings/change-password', label: 'Change Password' },
                            { path: '#logout', label: 'Logout', action: true },
                        ]
                    }
                ]);
            default:
                return baseMenuItems;
        }
    };

    const menuItems = getMenuForRole(user.role);

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user.name) {
            return user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }
        return 'U';
    };

    // Get role badge color
    const getRoleColor = () => {
        switch (user.role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'staff':
                return 'bg-green-100 text-green-800';
            case 'student':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSubItemClick = (e, subItem) => {
        if (subItem.action && subItem.path === '#logout') {
            e.preventDefault();
            if (window.confirm('Are you sure you want to logout?')) {
                handleLogout();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Left Sidebar */}
            <aside className="w-64 bg-white shadow-lg flex flex-col">
                {/* Logo/Title */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">College Management</h1>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path) || (item.subItems && item.subItems.some(sub => isActive(sub.path)));

                        // Handle Parent Menu with Subitems
                        if (item.subItems) {
                            const isExpanded = expandedFields[item.key] || active;

                            return (
                                <div key={item.key}>
                                    <button
                                        onClick={() => toggleMenu(item.key)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${active
                                            ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <Icon className={`w-5 h-5 mr-3 ${active ? 'text-indigo-600' : 'text-gray-500'}`} />
                                            <span className="text-sm">{item.label}</span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isExpanded && (
                                        <div className="ml-8 mt-1 space-y-1">
                                            {item.subItems.map(subItem => (
                                                <Link
                                                    key={subItem.label}
                                                    to={subItem.path}
                                                    onClick={(e) => handleSubItemClick(e, subItem)}
                                                    className={`block px-4 py-2 text-sm rounded-md transition-colors ${!subItem.action && isActive(subItem.path)
                                                        ? 'text-indigo-600 bg-indigo-50 font-medium'
                                                        : subItem.action ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${active
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${active ? 'text-indigo-600' : 'text-gray-500'}`} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button at Bottom */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                            </h2>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                            >
                                {/* User Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                                    {getUserInitials()}
                                </div>
                                <div className="text-left hidden md:block">
                                    <div className="text-sm font-medium text-gray-900">{user.name || 'User'}</div>
                                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 ${getRoleColor()}`}>
                                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                    </div>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform ${showProfileDropdown ? 'transform rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowProfileDropdown(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-200">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                                                    {getUserInitials()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900">{user.name || 'User'}</div>
                                                    <div className="text-xs text-gray-500">{user.email || ''}</div>
                                                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getRoleColor()}`}>
                                                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false);
                                                // Navigate to profile page if you have one
                                                // navigate('/profile');
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            View Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
