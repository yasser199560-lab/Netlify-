import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import StatusBadge from '../../components/statusBadge';
import {
  AdminUser,
  PartnerProfile,
  AdminOrder,
  DashboardStats,
  DashboardOverview,
  ActiveTab,
} from '../../types/admin.types';
import '../../styles/AdminDahboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, o] = await Promise.all([adminApi.getStats(), adminApi.getOverview()]);
      setStats(s);
      setOverview(o);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCustomers(await adminApi.getCustomers());
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPartners(await adminApi.getPartners());
    } catch {
      setError('Failed to load partners');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await adminApi.getOrders());
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboard();
    if (activeTab === 'customers') loadCustomers();
    if (activeTab === 'partners') loadPartners();
    if (activeTab === 'orders') loadOrders();
  }, [activeTab, loadDashboard, loadCustomers, loadPartners, loadOrders]);

  const refreshCurrent = () => {
    if (activeTab === 'dashboard') return loadDashboard();
    if (activeTab === 'customers') return loadCustomers();
    if (activeTab === 'partners') return loadPartners();
    if (activeTab === 'orders') return loadOrders();
  };

  const handleFreezeCustomer = async (id: string | number) => {
    await adminApi.freezeCustomer(id);
    refreshCurrent();
  };
  const handleUnfreezeCustomer = async (id: string | number) => {
    await adminApi.unfreezeCustomer(id);
    refreshCurrent();
  };
  const handleDeleteCustomer = async (id: string | number) => {
    if (!window.confirm('Delete this customer?')) return;
    await adminApi.deleteCustomer(id);
    refreshCurrent();
  };

  const handleFreezePartner = async (id: string | number) => {
    await adminApi.freezePartner(id);
    refreshCurrent();
  };
  const handleUnfreezePartner = async (id: string | number) => {
    await adminApi.unfreezePartner(id);
    refreshCurrent();
  };
  const handleApprovePartner = async (userId: string | number) => {
    await adminApi.approvePartner(userId);
    refreshCurrent();
  };
  const handleDeletePartner = async (id: string | number) => {
    if (!window.confirm('Delete this partner?')) return;
    await adminApi.deletePartner(id);
    refreshCurrent();
  };

  const handleLogout = () => {
    localStorage.removeItem('talabaty_user');
    navigate('/login');
  };

  const navItems: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-shield-check' },
    { key: 'customers', label: 'Customers', icon: 'bi-people' },
    { key: 'partners', label: 'Partners', icon: 'bi-shop' },
    { key: 'orders', label: 'Orders', icon: 'bi-box-seam' },
  ];

  const renderCustomerRow = (c: AdminUser) => (
    <tr key={String(c._id)}>
      <td>{c.name}</td>
      <td>{c.email}</td>
      <td><StatusBadge status={c.status} /></td>
      <td>
        <div className="d-flex gap-2">
          {c.status === 'frozen' ? (
            <button className="btn btn-sm btn-outline-success" onClick={() => handleUnfreezeCustomer(c._id)}>
              Unfreeze
            </button>
          ) : (
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleFreezeCustomer(c._id)}>
              Freeze
            </button>
          )}
          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCustomer(c._id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  const renderPartnerRow = (p: PartnerProfile) => (
    <tr key={String(p._id)}>
      <td>{p.storeName}</td>
      <td>{p.type || 'General'}</td>
      <td><StatusBadge status={p.status} /></td>
      <td>
        <div className="d-flex gap-2 flex-wrap">
          {p.status === 'pending' && (
            <button className="btn btn-sm btn-success" onClick={() => handleApprovePartner(p._id)}>
              Approve
            </button>
          )}
          {p.status === 'frozen' ? (
            <button className="btn btn-sm btn-outline-success" onClick={() => handleUnfreezePartner(p._id)}>
              Unfreeze
            </button>
          ) : (
            p.status !== 'pending' && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleFreezePartner(p._id)}>
                Freeze
              </button>
            )
          )}
          <button className="btn btn-sm btn-danger" onClick={() => handleDeletePartner(p._id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="d-flex admin-dashboard-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar d-flex flex-column p-3">
        <div className="d-flex align-items-center gap-2 px-2 pb-4">
          <i className="bi bi-globe2 fs-4 text-primary"></i>
          <div>
            <div className="fw-bold text-white fs-5">Talabaty</div>
            <div className="text-secondary small">ADMIN PANEL</div>
          </div>
        </div>

        <nav className="nav flex-column gap-1 flex-grow-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`btn text-start d-flex align-items-center gap-2 rounded-3 py-2 px-3 nav-item-btn ${
                activeTab === item.key ? 'active-nav-item' : 'text-light'
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="btn btn-outline-light d-flex align-items-center gap-2 rounded-3 py-2 px-3 mt-3"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4 admin-main-content position-relative">
        <div className="mb-4">
          <h1 className="h3 fw-bold text-dark mb-1">
            {navItems.find((n) => n.key === activeTab)?.label}
          </h1>
          <p className="text-muted mb-0">Welcome back, Admin</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="text-muted small mb-2">Total Customers</div>
                    <div className="fs-3 fw-bold text-dark">{stats?.totalCustomers ?? '—'}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="text-muted small mb-2">Active Partners</div>
                    <div className="fs-3 fw-bold text-dark">{stats?.activePartners ?? '—'}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="text-muted small mb-2">Total Orders</div>
                    <div className="fs-3 fw-bold text-dark">{stats?.totalOrders ?? '—'}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="text-muted small mb-2">Frozen Accounts</div>
                    <div className="fs-3 fw-bold text-danger">{stats?.frozenAccounts ?? '—'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-lg-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="h5 fw-bold mb-0">Customers</h2>
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr className="text-uppercase text-muted small">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview?.customers.map((c) => renderCustomerRow(c))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="h5 fw-bold mb-0">Partners</h2>
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr className="text-uppercase text-muted small">
                            <th>Store</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview?.partners.map((p) => renderPartnerRow(p))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">All Customers</h2>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-uppercase text-muted small">
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => renderCustomerRow(c))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">All Partners</h2>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-uppercase text-muted small">
                      <th>Store</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((p) => renderPartnerRow(p))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">All Orders</h2>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-uppercase text-muted small">
                      <th>Customer</th>
                      <th>Partner</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Order Status</th>
                      <th>Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={String(o._id)}>
                        <td>{o.customerName}</td>
                        <td>{o.partnerName}</td>
                        <td>${o.totalAmount}</td>
                        <td>{o.paymentMethod}</td>
                        <td><StatusBadge status={o.orderStatus} /></td>
                        <td><StatusBadge status={o.paymentStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="position-absolute top-0 end-0 m-4 bg-white shadow-sm rounded px-3 py-2 small text-muted">
            Loading...
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;