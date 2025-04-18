import React from 'react';

const Navigation = ({ activeTab, setActiveTab, isAdmin }) => {
  return (
    <div className="nav-tabs">
      <div 
        className={`nav-tab ${activeTab === 'services' ? 'active' : ''}`}
        onClick={() => setActiveTab('services')}
      >
        Services
      </div>
      
      {isAdmin ? (
        // Admin navigation options
        <>
          <div 
            className={`nav-tab ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </div>
          <div 
            className={`nav-tab ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </div>
        </>
      ) : (
        // Customer navigation options
        <div 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          My Dashboard
        </div>
      )}
    </div>
  );
};

export default Navigation;