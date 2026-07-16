import React, { useEffect, useState, useCallback, useRef, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import api from '../../api/axiosInstance';
import StatusBadge from '../../components/statusBadge';
import OrderFiltersBar from '../../components/OrderFiltersBar';
import OrderDetailModal, { OrderDetailModalOrder } from '../../components/OrderDetailModal';
import {
  AdminUser,
  PartnerProfile,
  AdminOrder,
  DashboardStats,
  DashboardOverview,
  ActiveTab,
  AdminMe,
  OrderFilterState,
} from '../../types/admin.types';
import '../../styles/AdminDahboard.css';

const EMPTY_FILTERS: OrderFilterState = { status: 'all', dateFilter: 'all', startDate: '', endDate: '' };

// Accepted image types + a 2MB cap for the profile picture upload. Kept as
// a data URL (base64) in the User document rather than a file-storage
// service, since this project has no upload/CDN infra set up — see
// PATCH /api/auth/me on the backend.
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

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
  const [orderFilters, setOrderFilters] = useState<OrderFilterState>(EMPTY_FILTERS);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // ---- Admin's own account (sidebar avatar/name + the Profile tab) ----
  const [me, setMe] = useState<AdminMe | null>(null);
  const [profileName, setProfileName] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined);
  const [avatarError, setAvatarError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const loadMe = useCallback(async () => {
    try {
      const { data } = await api.get<AdminMe>('/auth/me');
      setMe(data);
      setProfileName(data.name);
    } catch {
      // Non-fatal — the header just falls back to "Admin".
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

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
      setOrders(await adminApi.getOrders(orderFilters));
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [orderFilters]);

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

  const handleAvatarPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file later
    if (!file) return;

    setAvatarError('');

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError('Please choose a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('Image must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(reader.result as string);
    reader.onerror = () => setAvatarError("Couldn't read that image, please try another.");
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSaved(false);
    setProfileError('');
    try {
      const { data } = await api.patch<AdminMe>('/auth/me', {
        name: profileName,
        ...(avatarDataUrl !== undefined ? { avatarUrl: avatarDataUrl } : {}),
      });
      setMe(data);
      setAvatarDataUrl(undefined);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Couldn't save changes");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (newPassword !== confirmPassword) {
      setPwError("New password and confirmation don't match");
      return;
    }

    setPwSaving(true);
    try {
      await api.patch('/auth/change-password', { currentPassword, newPassword });
      setPwSuccess('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.response?.data?.message || "Couldn't update password");
    } finally {
      setPwSaving(false);
    }
  };

  const navItems: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-shield-check' },
    { key: 'customers', label: 'Customers', icon: 'bi-people' },
    { key: 'partners', label: 'Partners', icon: 'bi-shop' },
    { key: 'orders', label: 'Orders', icon: 'bi-box-seam' },
    { key: 'profile', label: 'Profile', icon: 'bi-person-circle' },
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

  const modalOrder: OrderDetailModalOrder | null = selectedOrder
    ? {
        _id: selectedOrder._id,
        customerEmail: selectedOrder.customerEmail,
        storeName: selectedOrder.partnerName,
        items: selectedOrder.items,
        totalAmount: selectedOrder.totalAmount,
        paymentMethod: selectedOrder.paymentMethod,
        orderStatus: selectedOrder.orderStatus,
        createdAt: selectedOrder.createdAt,
        deliveryAddress: selectedOrder.deliveryAddress,
      }
    : null;

  const avatarPreview = avatarDataUrl ?? me?.avatarUrl;
  const currentTabLabel = navItems.find((n) => n.key === activeTab)?.label;

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

        <div className="d-flex align-items-center gap-2 px-2 py-2 border-top border-secondary-subtle mt-3">
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="admin-avatar-sm" />
          ) : (
            <span className="admin-avatar-sm admin-avatar-fallback">{me?.name?.[0]?.toUpperCase() ?? 'A'}</span>
          )}
          <div className="text-truncate">
            <div className="text-white small fw-semibold text-truncate">{me?.name ?? 'Admin'}</div>
            <div className="text-secondary text-truncate" style={{ fontSize: '.7rem' }}>{me?.email}</div>
          </div>
        </div>

        <button
          className="btn btn-outline-light d-flex align-items-center gap-2 rounded-3 py-2 px-3 mt-2"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4 admin-main-content position-relative">
        <div className="mb-4">
          <h1 className="h3 fw-bold text-dark mb-1">{currentTabLabel}</h1>
          <p className="text-muted mb-0">Welcome back{me?.name ? `, ${me.name}` : ', Admin'}</p>
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

              <OrderFiltersBar value={orderFilters} onChange={setOrderFilters} />

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-uppercase text-muted small">
                      <th>Customer Email</th>
                      <th>Store</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Order Status</th>
                      <th>Order Date</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && orders.length === 0 && (
                      <tr><td colSpan={7} className="text-muted text-center py-3">No orders match these filters.</td></tr>
                    )}
                    {orders.map((o) => (
                      <tr key={String(o._id)}>
                        <td>{o.customerEmail}</td>
                        <td>{o.partnerName}</td>
                        <td>${o.totalAmount.toFixed(2)}</td>
                        <td>{o.paymentMethod}</td>
                        <td><StatusBadge status={o.orderStatus} /></td>
                        <td>{o.createdAt ? new Date(o.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedOrder(o)}>
                            <i className="bi bi-eye me-1"></i>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <form onSubmit={handleProfileSave} className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h2 className="h5 fw-bold mb-3">Profile</h2>

                  {profileError && <div className="alert alert-danger py-2 small">{profileError}</div>}
                  {profileSaved && <div className="alert alert-success py-2 small">Changes saved.</div>}

                  <div className="d-flex align-items-center gap-3 mb-4">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="admin-avatar-lg" />
                    ) : (
                      <span className="admin-avatar-lg admin-avatar-fallback">{me?.name?.[0]?.toUpperCase() ?? 'A'}</span>
                    )}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="d-none"
                        onChange={handleAvatarPick}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <i className="bi bi-upload me-1"></i>
                        Change photo
                      </button>
                      <div className="text-muted mt-1" style={{ fontSize: '.75rem' }}>PNG, JPEG or WebP, up to 2MB.</div>
                      {avatarError && <div className="text-danger mt-1" style={{ fontSize: '.75rem' }}>{avatarError}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">Full name</label>
                    <input
                      className="form-control"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">Email</label>
                    <input className="form-control" value={me?.email ?? ''} disabled readOnly />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small text-muted">Role</label>
                    <input className="form-control text-capitalize" value={me?.role ?? 'admin'} disabled readOnly />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                    {profileSaving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-7">
              <form onSubmit={handleChangePassword} className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h2 className="h5 fw-bold mb-3">Change password</h2>

                  {pwError && <div className="alert alert-danger py-2 small">{pwError}</div>}
                  {pwSuccess && <div className="alert alert-success py-2 small">{pwSuccess}</div>}

                  <div className="mb-3">
                    <label className="form-label small text-muted">Current password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label small text-muted">New password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small text-muted">Confirm new password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={pwSaving}>
                    {pwSaving ? 'Updating…' : 'Update password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && (
          <div className="position-absolute top-0 end-0 m-4 bg-white shadow-sm rounded px-3 py-2 small text-muted">
            Loading...
          </div>
        )}
      </main>

      <OrderDetailModal order={modalOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default AdminDashboard;
