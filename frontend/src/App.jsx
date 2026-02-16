import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Listings } from './pages/Listings';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { Overview } from './pages/seller/Overview';
import { MyListings } from './pages/seller/MyListings';
import { CreateListing } from './pages/seller/CreateListing';
import { EditListing } from './pages/seller/EditListing';
import { SellerInquiries } from './pages/seller/SellerInquiries';
import { Profile } from './pages/seller/Profile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOverview } from './pages/admin/AdminOverview';
import { PendingListings } from './pages/admin/PendingListings';
import { AllListings } from './pages/admin/AllListings';
import { AuditLog } from './pages/admin/AuditLog';
import DebugAuth from './pages/DebugAuth';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes with navbar */}
            <Route path="/" element={<><Navbar /><div className="pt-16"><Home /></div></>} />
            <Route path="/login" element={<><Navbar /><div className="pt-16"><Login /></div></>} />
            <Route path="/register" element={<><Navbar /><div className="pt-16"><Register /></div></>} />
            <Route path="/listings" element={<><Navbar /><div className="pt-16"><Listings /></div></>} />
            <Route path="/debug-auth" element={<><Navbar /><div className="pt-16"><DebugAuth /></div></>} />

            {/* Admin dashboard routes (no navbar, has own layout) */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="pending" element={<PendingListings />} />
              <Route path="listings" element={<AllListings />} />
              <Route path="audit" element={<AuditLog />} />
            </Route>

            {/* Seller dashboard routes (no navbar, has own layout) */}
            <Route path="/seller" element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="listings/new" element={<CreateListing />} />
              <Route path="listings/:id/edit" element={<EditListing />} />
              <Route path="inquiries" element={<SellerInquiries />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
