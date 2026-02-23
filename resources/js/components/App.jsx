import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GlobalLoader from './GlobalLoader';
import Layout from './Layout';
import Login from './auth/Login';
import LoginLanding from './auth/LoginLanding';
import StudentLogin from './auth/StudentLogin';
import AdminLogin from './auth/AdminLogin';
import StaffLogin from './auth/StaffLogin';
import Register from './auth/Register';
import Dashboard from './Dashboard';
import DepartmentList from './departments/DepartmentList';
import AddDepartment from './departments/AddDepartment';
import EditDepartment from './departments/EditDepartment';
import StudentList from './students/StudentList';
import AddStudent from './students/AddStudent';
import EditStudent from './students/EditStudent';
import StudentProfile from './students/StudentProfile';
import StaffList from './staff/StaffList';
import AddStaff from './staff/AddStaff';
import AssignRoles from './staff/AssignRoles';
import AttendanceDashboard from './attendance/AttendanceDashboard';
import ViewAttendance from './attendance/ViewAttendance';
import AttendanceReport from './attendance/AttendanceReport';
import FeesDashboard from './fees/FeesDashboard';
import FeeCollection from './fees/FeeCollection';
import PendingFees from './fees/PendingFees';
import FeeReports from './fees/FeeReports';
import ExamsDashboard from './exams/ExamsDashboard';
import SubjectManagement from './exams/SubjectManagement';
import EnterMarks from './exams/EnterMarks';
import ResultReports from './exams/ResultReports';
import NotificationsDashboard from './notifications/NotificationsDashboard';
import SendToAll from './notifications/SendToAll';
import DepartmentNotification from './notifications/DepartmentNotification';
import IndividualNotification from './notifications/IndividualNotification';
import ChangePassword from './settings/ChangePassword';
import LibraryDashboard from './library/LibraryDashboard';
import Timetable from './timetable/Timetable';
import EventCalendar from './events/EventCalendar';
import HostelDashboard from './hostel/HostelDashboard';
import TransportDashboard from './transport/TransportDashboard';
import AuditLogViewer from './audit/AuditLogViewer';
import IdCardGenerator from './idcard/IdCardGenerator';
import ApplyLeave from './leaves/ApplyLeave';
import LeaveStatus from './leaves/LeaveStatus';
import AcademicYearSettings from './settings/AcademicYearSettings';
import BackupManager from './settings/BackupManager';
// import LeaveManagement from './leaves/LeaveManagement'; // Replaced by submenus
// Notifications import removed as we are replacing it
// import Notifications from './notifications/Notifications';
// Exams & Marks page temporarily disabled due to build issues
// import ExamsMarks from './exams/ExamsMarks';
// Reports page temporarily disabled due to encoding issues
// import Reports from './reports/Reports';
// Roles & Permissions page temporarily disabled due to build issues
// import RolesPermissions from './roles/RolesPermissions';
// Settings page temporarily disabled due to build issues
// import Settings from './settings/Settings';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const userRole = user?.role;

    // Listen for auth changes (e.g. logout from Layout)
    useEffect(() => {
        const handleAuthChange = () => {
            setToken(localStorage.getItem('token'));
            setUser(JSON.parse(localStorage.getItem('user') || '{}'));
        };

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    // Check if user is admin or staff
    const canRegister = userRole === 'admin' || userRole === 'staff';

    return (
        <>
            <GlobalLoader />
            <Routes>
                {/* Landing page - shows login options */}
                <Route path="/" element={!token ? <LoginLanding /> : <Navigate to="/dashboard" replace />} />
                {/* Role-specific login routes */}
                <Route path="/student/login" element={!token ? <StudentLogin /> : <Navigate to="/dashboard" replace />} />
                <Route path="/admin/login" element={!token ? <AdminLogin /> : <Navigate to="/dashboard" replace />} />
                <Route path="/staff/login" element={!token ? <StaffLogin /> : <Navigate to="/dashboard" replace />} />
                {/* General login route (redirects to landing page) */}
                <Route path="/login" element={!token ? <Navigate to="/" replace /> : <Navigate to="/dashboard" replace />} />
                <Route path="/register" element={token && canRegister ? <Register /> : token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
                <Route element={token ? <Layout /> : <Navigate to="/login" replace />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/departments" element={<DepartmentList />} />
                    <Route path="/departments/add" element={<AddDepartment />} />
                    <Route path="/departments/edit/:id" element={<EditDepartment />} />
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/students/add" element={<AddStudent />} />
                    <Route path="/students/edit/:id" element={<EditStudent />} />
                    <Route path="/students/:id" element={<StudentProfile />} />
                    <Route path="/staff" element={<StaffList />} />
                    <Route path="/staff/add" element={<AddStaff />} />
                    <Route path="/staff/assign-roles" element={<AssignRoles />} />
                    <Route path="/attendance" element={<AttendanceDashboard />} />
                    <Route path="/attendance/view" element={<ViewAttendance />} />
                    <Route path="/attendance/report" element={<AttendanceReport />} />
                    <Route path="/fees" element={<FeesDashboard />} />
                    <Route path="/fees/collect" element={<FeeCollection />} />
                    <Route path="/fees/pending" element={<PendingFees />} />
                    <Route path="/fees/reports" element={<FeeReports />} />
                    <Route path="/exams" element={<ExamsDashboard />} />
                    <Route path="/exams/subjects" element={<SubjectManagement />} />
                    <Route path="/subjects" element={<SubjectManagement />} />
                    <Route path="/exams/marks/entry" element={<EnterMarks />} />
                    <Route path="/exams/results" element={<ResultReports />} />

                    <Route path="/library" element={<LibraryDashboard />} />

                    <Route path="/notifications" element={<NotificationsDashboard />} />
                    <Route path="/notifications/broadcast" element={<SendToAll />} />
                    <Route path="/notifications/department" element={<DepartmentNotification />} />
                    <Route path="/notifications/individual" element={<IndividualNotification />} />

                    <Route path="/leaves/apply" element={<ApplyLeave />} />
                    <Route path="/leaves/status" element={<LeaveStatus />} />

                    <Route path="/settings/change-password" element={<ChangePassword />} />
                    <Route path="/settings/academic-years" element={<AcademicYearSettings />} />
                    <Route path="/settings/backups" element={<BackupManager />} />

                    {/* <Route path="/leaves" element={<LeaveManagement />} /> */}
                    {/* Roles & Permissions route temporarily disabled */}
                    {/* <Route path="/roles-permissions" element={<RolesPermissions />} /> */}
                    {/* Settings route temporarily disabled */}
                    {/* <Route path="/settings" element={<Settings />} /> */}
                    <Route path="/timetable" element={<Timetable />} />
                    <Route path="/events" element={<EventCalendar />} />
                    <Route path="/hostel" element={<HostelDashboard />} />
                    <Route path="/transport" element={<TransportDashboard />} />
                    <Route path="/audit-logs" element={<AuditLogViewer />} />
                    <Route path="/id-cards" element={<IdCardGenerator />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
