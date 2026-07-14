import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [view, setView] = useState(token ? 'dashboard' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchHabits();
  }, [token]);

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${API_URL}/habits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHabits(res.data);
    } catch (err) {
      if (err.response && err.response.status === 403) logout();
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const t = res.data.token;
      setToken(t);
      localStorage.setItem('token', t);
      setView('dashboard');
    } catch (err) {
      alert('Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/signup`, { email, password });
      alert('Signup successful! Please login.');
      setView('login');
    } catch (err) {
      alert('Signup failed.');
    }
    setLoading(false);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setView('login');
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    try {
      await axios.post(`${API_URL}/habits`, { name: newHabitName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewHabitName('');
      fetchHabits();
    } catch (err) {}
  };

  const markComplete = async (id) => {
    try {
      await axios.put(`${API_URL}/habits/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHabits();
    } catch (err) {}
  };

  // --- Date Logic (Fixed Chronological Order: Oldest -> Newest) ---
  const getLast7Days = () => {
    const days = [];
    // Loop from 6 days ago up to 0 (today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };
  const last7Days = getLast7Days();

  // --- Aggregate Data for the Main Trend Graph ---
  const getAggregatedActivity = () => {
    const counts = {};
    last7Days.forEach(day => counts[day] = 0);
    
    habits.forEach(habit => {
      (habit.history || []).forEach(date => {
        if (counts[date] !== undefined) {
          counts[date]++;
        }
      });
    });
    return counts;
  };

  const activityData = getAggregatedActivity();
  const maxActivity = Math.max(...Object.values(activityData), 1); // Avoid division by zero

  // --- STYLES ---
  const styles = {
    appBackground: { minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', color: '#334155' },
    
    // Auth Styles
    authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 100%)' },
    authCard: { backgroundColor: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '100%', maxWidth: '420px', textAlign: 'center' },
    authTitle: { margin: '0 0 8px 0', fontSize: '2.25rem', fontWeight: '800', background: 'linear-gradient(to right, #4f46e5, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    authSubtitle: { margin: '0 0 32px 0', color: '#64748b', fontSize: '1.125rem' },
    inputGroup: { marginBottom: '16px', textAlign: 'left' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '6px' },
    input: { width: '100%', padding: '14px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', boxSizing: 'border-box', fontSize: '1rem', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc' },
    button: { width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.125rem', fontWeight: '600', cursor: 'pointer', marginTop: '8px', transition: 'background-color 0.2s, transform 0.1s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' },
    linkButton: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginTop: '24px', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' },
    
    // Dashboard Styles
    dashboardWrap: { padding: '48px 24px', maxWidth: '1000px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    headerTitle: { margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' },
    headerSub: { margin: '8px 0 0 0', color: '#64748b', fontSize: '1.125rem' },
    logoutBtn: { padding: '10px 20px', backgroundColor: 'white', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    
    // Sections
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#1e293b' },
    
    // Trend Graph
    trendCard: { backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', marginBottom: '40px', border: '1px solid #f1f5f9' },
    chartContainer: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', marginTop: '24px', gap: '16px' },
    barCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' },
    barWrapper: { flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '6px', boxSizing: 'border-box' },
    barFill: { width: '100%', backgroundColor: '#6366f1', borderRadius: '6px', transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)', backgroundImage: 'linear-gradient(to top, #4f46e5, #818cf8)' },
    barLabel: { fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginTop: '12px' },
    barValue: { fontSize: '0.875rem', fontWeight: '700', color: '#4f46e5', marginBottom: '8px' },

    // Add Habit Form
    formRow: { display: 'flex', gap: '16px', marginBottom: '40px', backgroundColor: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' },
    addInput: { flex: 1, padding: '16px 20px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1.125rem', outline: 'none', backgroundColor: '#f8fafc' },
    addBtn: { padding: '16px 32px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.125rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' },

    // Habit List
    habitList: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', padding: 0, margin: 0, listStyle: 'none' },
    habitItem: { backgroundColor: 'white', padding: '28px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', transition: 'transform 0.2s, box-shadow 0.2s' },
    habitInfo: { flex: 1 },
    habitName: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
    habitStats: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.875rem', marginBottom: '16px', fontWeight: '500' },
    fireIcon: { color: '#f59e0b', fontSize: '1.125rem' },
    
    // Action Button
    completeBtnWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginLeft: '24px' },
    completeBtn: { padding: '14px 28px', backgroundColor: '#f8fafc', color: '#475569', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', transition: 'all 0.2s' },
    completeBtnActive: { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' },
    
    // Mini Graph
    miniGraph: { display: 'flex', gap: '8px', alignItems: 'center' },
    miniBox: { width: '24px', height: '24px', borderRadius: '6px', transition: 'background-color 0.3s' },
    miniGraphLabel: { fontSize: '0.75rem', color: '#94a3b8', marginLeft: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }
  };

  if (view === 'login' || view === 'signup') {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <h1 style={styles.authTitle}>Streakflow</h1>
          <h2 style={styles.authSubtitle}>{view === 'login' ? 'Welcome back' : 'Start your journey'}</h2>
          
          <form onSubmit={view === 'login' ? login : signup}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                style={styles.input} 
                placeholder="you@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                style={styles.input} 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button 
              style={{...styles.button, opacity: loading ? 0.7 : 1}} 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <button style={styles.linkButton} onClick={() => setView(view === 'login' ? 'signup' : 'login')}>
            {view === 'login' ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appBackground}>
      <div style={styles.dashboardWrap}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Dashboard</h1>
            <p style={styles.headerSub}>Track your daily progress and build better habits.</p>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>Sign Out</button>
        </div>

        {/* Overall Activity Trend Graph */}
        <div style={styles.trendCard}>
          <h3 style={styles.sectionTitle}>Activity Overview (Last 7 Days)</h3>
          <div style={styles.chartContainer}>
            {last7Days.map(date => {
              const count = activityData[date];
              const heightPct = Math.max((count / maxActivity) * 100, 5); // min 5%
              
              // Format date cleanly: e.g., "Mon 24"
              const dObj = new Date(date);
              const dayName = dObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = dObj.getDate();
              
              return (
                <div key={date} style={styles.barCol}>
                  <div style={styles.barValue}>{count > 0 ? count : ''}</div>
                  <div style={styles.barWrapper}>
                    <div style={{
                      ...styles.barFill, 
                      height: `${count === 0 ? 0 : heightPct}%`,
                      background: count > 0 ? 'linear-gradient(to top, #4f46e5, #818cf8)' : 'transparent'
                    }}></div>
                  </div>
                  <div style={styles.barLabel}>{dayName} {dayNum}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Add Habit Section */}
        <h3 style={styles.sectionTitle}>Your Routines</h3>
        <form style={styles.formRow} onSubmit={addHabit}>
          <input 
            style={styles.addInput} 
            placeholder="What habit do you want to start building?" 
            value={newHabitName} 
            onChange={e => setNewHabitName(e.target.value)} 
            required 
          />
          <button style={styles.addBtn} type="submit">+ Add Habit</button>
        </form>
        
        {/* Habits List */}
        <ul style={styles.habitList}>
          {habits.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', color: '#64748b', border: '1px dashed #cbd5e1'}}>
              <div style={{fontSize: '3rem', marginBottom: '16px'}}>🌱</div>
              <div style={{fontSize: '1.25rem', fontWeight: '600', color: '#334155'}}>No habits created yet</div>
              <p>Type a habit above and start building your streak!</p>
            </div>
          ) : (
            habits.map(h => {
              const history = h.history || [];
              const today = new Date().toISOString().split('T')[0];
              const isCompletedToday = history.includes(today);
              
              return (
                <li key={h.id} style={styles.habitItem}>
                  <div style={styles.habitInfo}>
                    <div style={styles.habitName}>{h.name}</div>
                    
                    <div style={styles.habitStats}>
                      <span style={styles.fireIcon}>🔥</span>
                      <span><strong>{history.length}</strong> total completions</span>
                    </div>
                    
                    {/* Mini History Graph (Chronological) */}
                    <div style={styles.miniGraph}>
                      {last7Days.map(date => {
                        const isDone = history.includes(date);
                        // Add a special style for "Today"
                        const isToday = date === today;
                        
                        return (
                          <div 
                            key={date} 
                            title={date}
                            style={{
                              ...styles.miniBox,
                              backgroundColor: isDone ? '#10b981' : '#f1f5f9',
                              border: isToday && !isDone ? '2px solid #cbd5e1' : 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        );
                      })}
                      <span style={styles.miniGraphLabel}>Past 7 Days &rarr;</span>
                    </div>
                  </div>
                  
                  <div style={styles.completeBtnWrapper}>
                    <button 
                      style={{
                        ...styles.completeBtn, 
                        ...(isCompletedToday ? styles.completeBtnActive : {})
                      }} 
                      onClick={() => markComplete(h.id)}
                      disabled={isCompletedToday}
                    >
                      {isCompletedToday ? '✓ Done Today' : 'Mark Complete'}
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
