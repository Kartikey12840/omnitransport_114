import React, { createContext, useContext, useState, useEffect } from 'react';

const SEEDED_USERS = [
  {
    id: 'usr-admin-1',
    name: 'System Administrator',
    email: 'admin@chargeopt.ai',
    role: 'admin',
    organization: 'National EV Infrastructure Mission',
    title: 'Lead Systems Architect',
    joinedDate: '2026-08-15',
    lastActive: 'Just now',
    scenariosCount: 6,
    avatar: '⚡'
  },
  {
    id: 'usr-planner-1',
    name: 'Karthik Patel',
    email: 'planner@chargeopt.ai',
    role: 'user',
    organization: 'BBMP & BESCOM Urban Transport',
    title: 'Senior Urban Mobility Planner',
    joinedDate: '2026-08-20',
    lastActive: '5 mins ago',
    scenariosCount: 4,
    avatar: '🧭'
  },
  {
    id: 'usr-analyst-2',
    name: 'Priya Sharma',
    email: 'priya.fleet@mobility.in',
    role: 'user',
    organization: 'SmartFleet Commercial Logistics',
    title: 'EV Fleet Electrification Analyst',
    joinedDate: '2026-08-28',
    lastActive: '2 hours ago',
    scenariosCount: 3,
    avatar: '📊'
  }
];

const SEEDED_LOGS = [
  { id: 'log-1', userId: 'usr-admin-1', userName: 'System Administrator', action: 'SYSTEM_BOOT', details: 'Initialized ChargeOpt AI geospatial engine for Bengaluru & Mumbai', timestamp: '2026-09-01 10:00:12' },
  { id: 'log-2', userId: 'usr-planner-1', userName: 'Karthik Patel', action: 'OPTIMIZATION_RUN', details: 'Computed Maximum Coverage scenario for Bengaluru (3 stations, +13.4% lift)', timestamp: '2026-09-01 11:15:40' },
  { id: 'log-3', userId: 'usr-planner-1', userName: 'Karthik Patel', action: 'REPORT_EXPORT', details: 'Exported PDF planning roadmap for Marathahalli Junction hub', timestamp: '2026-09-01 11:22:05' },
  { id: 'log-4', userId: 'usr-analyst-2', userName: 'Priya Sharma', action: 'SCENARIO_SIMULATE', details: 'Simulated 5-station fleet corridor in Mumbai (Goregaon Link Rd)', timestamp: '2026-09-01 14:40:18' }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Load stored users or use seed
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeopt_users');
      return saved ? JSON.parse(saved) : SEEDED_USERS;
    } catch {
      return SEEDED_USERS;
    }
  });

  // Current logged in user (null = Guest)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeopt_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Audit activity logs
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeopt_activity_logs');
      return saved ? JSON.parse(saved) : SEEDED_LOGS;
    } catch {
      return SEEDED_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chargeopt_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('chargeopt_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('chargeopt_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('chargeopt_activity_logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.error(e);
    }
  }, [activityLogs]);

  const logActivity = (action, details, user = currentUser) => {
    const newLog = {
      id: `log-${Date.now()}`,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest User',
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const login = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('User not found with this email. Please check your credentials or register.');
    }
    const updatedUser = { ...found, lastActive: 'Just now' };
    setCurrentUser(updatedUser);
    logActivity('USER_LOGIN', `User ${found.name} signed in successfully`, updatedUser);
    return updatedUser;
  };

  const quickLogin = (role = 'user') => {
    const targetUser = users.find(u => u.role === role) || users[0];
    const updatedUser = { ...targetUser, lastActive: 'Just now' };
    setCurrentUser(updatedUser);
    logActivity('QUICK_DEMO_LOGIN', `Demonstration sign-in as ${targetUser.role.toUpperCase()} (${targetUser.name})`, updatedUser);
    return updatedUser;
  };

  const register = ({ name, email, role = 'user', organization = 'Urban Planning Council', title = 'Infrastructure Specialist' }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account already exists with this email address.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      organization,
      title,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      scenariosCount: 0,
      avatar: role === 'admin' ? '⚡' : '🧭'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    logActivity('USER_REGISTER', `New user registered: ${name} (${role})`, newUser);
    return newUser;
  };

  const logout = () => {
    if (currentUser) {
      logActivity('USER_LOGOUT', `User ${currentUser.name} signed out`);
    }
    setCurrentUser(null);
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }

    logActivity('ADMIN_ROLE_CHANGE', `Updated role of user ID ${userId} to ${newRole}`);
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    logActivity('ADMIN_USER_DELETE', `Deleted user account ID ${userId}`);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    logActivity('PROFILE_UPDATE', `Updated user profile preferences for ${updated.name}`);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        users,
        activityLogs,
        login,
        quickLogin,
        register,
        logout,
        updateUserRole,
        deleteUser,
        logActivity,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
