import React, { useState, useEffect } from 'react';
import MainNavigation from './components/MainNavigation';
import HomePage from './components/HomePage';
// import FeaturedServices from './components/FeaturedServices'; // ❌ Removed FeaturedServices
import ServiceDetailPage from './components/ServiceDetailPage';
import ServiceList from './components/services/ServiceList';
import ServiceForm from './components/services/ServiceForm';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import SaleList from './components/Sales/SaleList';
import SaleForm from './components/Sales/SaleForm';
import AuthPage from './components/Auth/AuthPage';
import AdminPanel from './components/Auth/AdminPanel';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import { getCurrentUser, logoutUser } from './services/authService';

import './App.css';
import './homepage.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewingServiceId, setViewingServiceId] = useState(null);
  const [refreshData, setRefreshData] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshList = () => setRefreshData(prev => prev + 1);

  const handleAddNew = () => {
    if (activeTab === 'services') setSelectedService(null);
    if (activeTab === 'customers') setSelectedCustomer(null);
  };

  const handleEdit = (item) => {
    if (activeTab === 'services') setSelectedService(item);
    if (activeTab === 'customers') setSelectedCustomer(item);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab(userData.role === 'admin' ? 'adminServices' : 'dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActiveTab('home');
  };

  const toggleAdminPanel = () => setShowAdminPanel(prev => !prev);

  const handleViewService = (serviceId) => {
    setViewingServiceId(serviceId);
    setActiveTab('serviceDetail');
  };

  const handleHomeNavigation = (targetTab) => {
    if (targetTab === 'login' || targetTab === 'register') {
      setActiveTab('auth');
    } else if (targetTab === 'admin') {
      setActiveTab('adminServices');
    } else {
      setActiveTab(targetTab);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const adminOptions = user && user.role === 'admin';

  return (
    <div className="app-container">
      <MainNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={user ? user.name || user.username : null}
        onLogout={handleLogout}
      />

      <main>
        {activeTab === 'home' && (
          <>
            <HomePage onNavigate={handleHomeNavigation} />
            {/* <FeaturedServices onViewService={handleViewService} /> */} {/* ❌ Removed display */}
          </>
        )}

        {activeTab === 'serviceDetail' && viewingServiceId && (
          <ServiceDetailPage 
            serviceId={viewingServiceId} 
            onBack={() => setActiveTab('home')} 
            onLogin={() => setActiveTab('auth')}
          />
        )}

        {activeTab === 'auth' && !user && (
          <div>
            <AuthPage onLogin={handleLogin} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={toggleAdminPanel} 
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
              >
                {showAdminPanel ? 'Hide Admin Panel' : 'Admin Access'}
              </button>
              {showAdminPanel && <AdminPanel />}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="section">
            <div className="full-panel">
              <ServiceList 
                onViewService={handleViewService}
                refreshTrigger={refreshData} 
                isAdmin={false}
              />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && user && !adminOptions && (
          <CustomerDashboard user={user} />
        )}

        {activeTab === 'adminServices' && adminOptions && (
          <div className="section">
            <div className="left-panel">
              <ServiceList 
                onEdit={handleEdit} 
                refreshTrigger={refreshData} 
                onAddNew={handleAddNew}
                isAdmin={true}
              />
            </div>
            <div className="right-panel">
              <ServiceForm 
                service={selectedService} 
                onSave={refreshList} 
              />
            </div>
          </div>
        )}

        {adminOptions && (
          <>
            {activeTab === 'customers' && (
              <div className="section">
                <div className="left-panel">
                  <CustomerList 
                    onEdit={handleEdit} 
                    refreshTrigger={refreshData} 
                    onAddNew={handleAddNew}
                  />
                </div>
                <div className="right-panel">
                  <CustomerForm 
                    customer={selectedCustomer} 
                    onSave={refreshList} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="section">
                <div className="left-panel">
                  <SaleList refreshTrigger={refreshData} />
                </div>
                <div className="right-panel">
                  <SaleForm onSave={refreshList} />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
