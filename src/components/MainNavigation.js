import React from 'react';
import { isLoggedIn, isAdmin, logoutUser } from '../services/authService';

const MainNavigation = ({ activeTab, setActiveTab, userName }) => {
  const userLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  
  const handleLogout = () => {
    logoutUser();
    setActiveTab('home');
    // Force page reload to clear state
    window.location.reload();
  };

  return (
    <div className="main-navigation">
      <div className="nav-logo" onClick={() => setActiveTab('home')}>
        <span className="logo-text">OM Security Services</span>
      </div>
      
      <div className="nav-links">
        <div 
          className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </div>
        
        <div 
          className={`nav-link ${activeTab === 'services' ? 'active' : ''}`} 
          onClick={() => setActiveTab('services')}
        >
          Services
        </div>
        
        {userLoggedIn && !userIsAdmin && (
          <div 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            My Dashboard
          </div>
        )}
        
        {userIsAdmin && (
          <>
            <div 
              className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`} 
              onClick={() => setActiveTab('customers')}
            >
              Customers
            </div>
            
            <div 
              className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`} 
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </div>
          </>
        )}
      </div>
      
      <div className="nav-auth">
        {!userLoggedIn ? (
          <>
          </>
        ) : (
          <div className="user-controls">
            <span className="welcome-text">
              Welcome, {userName || 'User'}
              {userIsAdmin && <span className="admin-badge">Admin</span>}
            </span>
            <button 
              className="nav-btn logout" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavigation;