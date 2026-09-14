import React, { useState, useEffect, useRef } from 'react';
import {
  fetchDesigns,
  fetchInquiries,
  createDesign,
  deleteDesign,
  updateInquiryStatus,
  testSupabaseConnection,
  SUPABASE_URL
} from '../../lib/supabase';
import {
  LayoutDashboard, ImagePlus, Trash2, RefreshCw, CheckCircle, XCircle,
  Database, Upload, Eye, ClipboardList, ChevronDown, Loader2, Flower, AlertCircle
} from 'lucide-react';

const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed: 'bg-green-100 text-green-700 border-green-200',
  Completed: 'bg-stone-100 text-stone-600 border-stone-200',
};

const CATEGORIES = ['bridal', 'arabic', 'rajasthani', 'feet', 'engagement', 'minimalist'];

function ConnectionBanner({ status }) {
  if (!status) return null;
  const { connected, hasTables, message } = status;

  const icon = connected && hasTables
    ? <CheckCircle className="w-4 h-4 text-green-600" />
    : connected
    ? <AlertCircle className="w-4 h-4 text-amber-600" />
    : <XCircle className="w-4 h-4 text-red-500" />;

  const bg = connected && hasTables
    ? 'bg-green-50 border-green-200'
    : connected
    ? 'bg-amber-50 border-amber-200'
    : 'bg-red-50 border-red-200';

  const textColor = connected && hasTables ? 'text-green-800' : connected ? 'text-amber-800' : 'text-red-800';

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${bg} mb-6`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className={`text-sm font-semibold font-sans-clean ${textColor}`}>
          {connected && hasTables
            ? '✅ Live Supabase Database Connected'
            : connected
            ? '⚠️ Connected to Supabase — Tables Not Yet Created'
            : '❌ Supabase Offline — Using Local Storage'}
        </p>
        <p className={`text-xs mt-0.5 font-sans-clean ${textColor} opacity-80`}>{message}</p>
        {connected && !hasTables && (
          <p className="text-xs mt-1 font-sans-clean text-amber-700">
            👉 Run the <strong>supabase-schema.sql</strong> file in your Supabase SQL Editor to activate cloud storage.
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('designs');
  const [designs, setDesigns] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Add Design form
  const [newDesign, setNewDesign] = useState({
    title: '', category: 'bridal', imageUrl: '', description: '', priceRange: '', tag: 'New Art', featured: false
  });

  const setND = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewDesign(prev => ({ ...prev, [field]: val }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [des, inq, status] = await Promise.all([
        fetchDesigns(),
        fetchInquiries(),
        testSupabaseConnection()
      ]);
      setDesigns(des);
      setInquiries(inq);
      setDbStatus(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddDesign = async (e) => {
    e.preventDefault();
    if (!newDesign.title || !newDesign.imageUrl) {
      setUploadMsg('⚠️ Please fill in at least a Title and Image URL.');
      return;
    }
    setUploading(true);
    setUploadMsg('');
    try {
      const { design, savedToCloud } = await createDesign({
        ...newDesign,
        imageUrl: newDesign.imageUrl
      });
      setDesigns(prev => [design, ...prev]);
      setNewDesign({ title: '', category: 'bridal', imageUrl: '', description: '', priceRange: '', tag: 'New Art', featured: false });
      setUploadMsg(savedToCloud
        ? '✅ Design saved to Supabase database!'
        : '✅ Design saved locally! (Connect Supabase to sync to cloud)');
    } catch (e) {
      setUploadMsg('❌ Failed to add design: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDesign = async (id) => {
    if (!window.confirm('Delete this design?')) return;
    await deleteDesign(id);
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateInquiryStatus(id, newStatus);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const TABS = [
    { key: 'designs', label: 'Design Gallery', icon: <ImagePlus className="w-4 h-4" /> },
    { key: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'db', label: 'Database Status', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <section id="admin" className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-rose-950">Admin Dashboard</h2>
              <p className="text-stone-500 text-xs font-sans-clean">Manage your designs, bookings & Supabase</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-sm font-medium transition-colors font-sans-clean"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Connection Banner */}
        <ConnectionBanner status={dbStatus} />

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-stone-200">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px font-sans-clean ${
                tab === t.key
                  ? 'border-rose-700 text-rose-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: DESIGNS */}
        {tab === 'designs' && (
          <div>
            {/* Add New Design Form */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-8">
              <h3 className="font-bold text-rose-950 mb-4 font-sans-clean flex items-center gap-2">
                <Upload className="w-4 h-4 text-rose-600" />
                Add New Design to Portfolio
              </h3>
              <form onSubmit={handleAddDesign} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1 font-sans-clean">Design Title *</label>
                  <input
                    type="text"
                    required
                    value={newDesign.title}
                    onChange={setND('title')}
                    placeholder="e.g. Royal Bridal Mandala Art"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-sans-clean focus:border-rose-300 outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1 font-sans-clean">Category</label>
                  <select
                    value={newDesign.category}
                    onChange={setND('category')}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-sans-clean focus:border-rose-300 outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1 font-sans-clean">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={newDesign.imageUrl}
                    onChange={setND('imageUrl')}
                    placeholder="https://images.unsplash.com/... or your Supabase Storage URL"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-sans-clean focus:border-rose-300 outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1 font-sans-clean">Price Range</label>
                  <input
                    type="text"
                    value={newDesign.priceRange}
                    onChange={setND('priceRange')}
                    placeholder="₹3,000 - ₹6,000"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-sans-clean focus:border-rose-300 outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1 font-sans-clean">Tag Label</label>
                  <input
                    type="text"
                    value={newDesign.tag}
                    onChange={setND('tag')}
                    placeholder="Bestseller / New Art"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-sans-clean focus:border-rose-300 outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1 font-sans-clean">Description</label>
                  <textarea
                    rows={2}
                    value={newDesign.description}
                    onChange={setND('description')}
                    placeholder="Brief description of this mehandi design..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-sans-clean focus:border-rose-300 outline-none focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <input
                    id="featured-check"
                    type="checkbox"
                    checked={newDesign.featured}
                    onChange={setND('featured')}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <label htmlFor="featured-check" className="text-sm font-medium text-stone-700 font-sans-clean cursor-pointer">
                    Mark as Featured Design (shown prominently in portfolio)
                  </label>
                </div>

                {uploadMsg && (
                  <p className={`sm:col-span-2 text-xs px-3 py-2 rounded-lg font-sans-clean ${
                    uploadMsg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {uploadMsg}
                  </p>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-sm transition-all disabled:opacity-60 font-sans-clean"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                    {uploading ? 'Adding Design...' : 'Add to Portfolio'}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Designs Grid */}
            <h3 className="font-bold text-stone-700 mb-4 font-sans-clean">
              Current Portfolio ({designs.length} designs)
            </h3>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-stone-200 animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {designs.map(d => (
                  <div key={d.id} className="relative rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm group">
                    <div className="aspect-[3/4]">
                      <img
                        src={d.imageUrl}
                        alt={d.title}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
                      />
                    </div>
                    <div className="p-3 border-t border-stone-100">
                      <p className="font-semibold text-rose-950 text-xs leading-snug line-clamp-2 font-sans-clean">{d.title}</p>
                      <p className="text-xs text-stone-400 capitalize mt-0.5 font-sans-clean">{d.category}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteDesign(d.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600"
                      title="Delete design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {d.featured && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px]">
                        👑
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: INQUIRIES */}
        {tab === 'inquiries' && (
          <div>
            <h3 className="font-bold text-stone-700 mb-4 font-sans-clean">
              All Booking Inquiries ({inquiries.length})
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-stone-200 animate-pulse rounded-xl" />)}
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-16 text-stone-400 font-sans-clean">
                No inquiries yet. Bookings submitted via the form will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map(inq => (
                  <div key={inq.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-rose-950 text-sm font-sans-clean">{inq.name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[inq.status] || STATUS_COLORS.New}`}>
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-sans-clean">
                          📞 {inq.phone} {inq.email ? `· 📧 ${inq.email}` : ''} · 🎉 {inq.event_type}
                        </p>
                        <p className="text-xs text-stone-500 font-sans-clean mt-0.5">
                          📅 {inq.event_date} · 👥 {inq.guests_count} guests{inq.city_venue ? ` · 📍 ${inq.city_venue}` : ''}
                        </p>
                        {inq.message && (
                          <p className="text-xs text-stone-400 italic mt-1 font-sans-clean line-clamp-1">"{inq.message}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.name}! Thank you for your Bhuvi Mehandi inquiry. We're happy to confirm your ${inq.event_type} on ${inq.event_date}. Please let us know a convenient time to discuss!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors font-sans-clean"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Reply
                        </a>
                        <select
                          value={inq.status}
                          onChange={e => handleStatusChange(inq.id, e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-medium font-sans-clean focus:outline-none focus:ring-1 focus:ring-rose-300"
                        >
                          {['New', 'Contacted', 'Confirmed', 'Completed'].map(s => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: DATABASE STATUS */}
        {tab === 'db' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-bold text-rose-950 mb-4 font-sans-clean flex items-center gap-2">
                <Database className="w-5 h-5 text-rose-600" />
                Database Setup Guide
              </h3>

              <div className="space-y-4 text-sm text-stone-600 font-sans-clean">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-blue-600 font-bold text-lg leading-none">1</span>
                  <div>
                    <p className="font-semibold text-blue-800 mb-1">Open Supabase SQL Editor</p>
                    <p>Go to your Supabase project dashboard at <strong>{SUPABASE_URL.replace('https://', '').split('.')[0]}.supabase.co</strong> → SQL Editor.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-amber-600 font-bold text-lg leading-none">2</span>
                  <div>
                    <p className="font-semibold text-amber-800 mb-1">Run the Schema SQL</p>
                    <p>Copy the contents of <code className="bg-amber-100 px-1 rounded font-mono">supabase-schema.sql</code> (in your project root) and paste + run it in the SQL Editor. This creates all tables with sample data.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-green-600 font-bold text-lg leading-none">3</span>
                  <div>
                    <p className="font-semibold text-green-800 mb-1">Enable Storage Bucket (for image uploads)</p>
                    <p>Go to Storage → Create new bucket named <code className="bg-green-100 px-1 rounded font-mono">mehandi-images</code> and set it to Public. Then upload your design photos there for permanent hosting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-rose-600 font-bold text-lg leading-none">4</span>
                  <div>
                    <p className="font-semibold text-rose-800 mb-1">Refresh Dashboard</p>
                    <p>After running the SQL, click the <strong>Refresh</strong> button above. The connection banner will turn green confirming live sync.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-xs text-stone-500 font-sans-clean leading-relaxed">
                  <strong>Current DB URL:</strong> {SUPABASE_URL}<br/>
                  <strong>Tables needed:</strong> mehandi_designs · mehandi_services · mehandi_inquiries · mehandi_reviews<br/>
                  <strong>Local Fallback:</strong> All data is simultaneously persisted in browser localStorage for offline access.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
