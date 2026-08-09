// Supabase Configuration and Initialization
// Real-time cloud integration for Study Hub
// This file provides the foundation for cloud migration and sync

// ===== SUPABASE CLIENT SETUP =====
const SUPABASE_CONFIG = {
  url: 'https://nnrdkdisjfudibvrggxb.supabase.co',
  anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucmRrZGlzamZ1ZGlidnJnZ3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzEyNjUsImV4cCI6MjA5OTMwNzI2NX0.DYzp1AEOrZ-iJ3keB4jtlZvHSetWO_h49gYXR9gK-Ro',
  // Admin writes run through the /api/cloud serverless proxy (service key stays server-side).
  service_key: ''
};

// Initialize Supabase client
let supabase = null;
let supabaseAdmin = null;
try {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabase = window.supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anon_key
    );
    if (SUPABASE_CONFIG.service_key) {
      supabaseAdmin = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.service_key
      );
    }
  } else {
    console.warn('[Cloud] Supabase SDK not available — cloud features disabled');
  }
} catch (e) {
  console.warn('[Cloud] Failed to initialize Supabase client:', e.message);
}

// ===== USER MANAGEMENT =====
class UserManager {
  constructor() {
    this.currentUserId = null;
    this.userProfile = null;
  }

  async initialize() {
    // Generate consistent user ID
    this.currentUserId = this.getUserId();
    await this.ensureProfileExists();
    return this.currentUserId;
  }

  getUserId() {
    // Use existing localStorage key if available, otherwise create new
    let userId = localStorage.getItem('studyhub_user_id');
    if (!userId) {
      userId = `user_${Math.random().toString(36).substr(2, 9)}${Date.now().toString(36).slice(-4)}`;
      localStorage.setItem('studyhub_user_id', userId);
    }
    return userId;
  }

  async ensureProfileExists() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', this.currentUserId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const newProfile = {
        id: this.currentUserId,
        name: state.profile.name || 'Scholar',
        major: state.profile.major || 'General Studies',
        weekly_target_hours: state.profile.weeklyTargetHours || 20,
        target_gpa: state.profile.targetGpa || 3.8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: created, error: createError } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error('Failed to create user profile:', createError);
        return false;
      }

      this.userProfile = created;
      return true;
    } else if (data) {
      this.userProfile = data;
      return true;
    } else {
      // Graceful degradation: a non-PGRST116 error means the cloud backend
      // is not set up (e.g. missing 'users' table or unreachable project).
      // Log once with a clear message instead of spamming the console.
      const msg = error && (error.message || error.error_description || error.code)
        ? (error.message || error.error_description || error.code)
        : 'unknown error';
      if (!this._cloudWarned) {
        this._cloudWarned = true;
        console.warn('[Cloud] Supabase backend unavailable (' + msg + '). Running on local storage only.');
      }
      return false;
    }
  }

  async updateProfile(updates) {
    const updatedData = {
      ...this.userProfile,
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .update(updatedData)
      .eq('id', this.currentUserId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update user profile:', error);
      return false;
    }

    this.userProfile = data;
    return true;
  }
}

// ===== CLOUD SYNC SYSTEM =====
class CloudSyncManager {
  constructor(userManager) {
    this.userManager = userManager;
    this.syncQueue = [];
    this.isSyncing = false;
    this.lastSyncTimestamp = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for state changes and queue them for sync
    if (typeof saveState !== 'function' || saveState.__cloudWrapped) return;
    const originalSaveState = saveState;
    saveState = () => {
      originalSaveState();
      this.queueStateChange();
    };
    saveState.__cloudWrapped = true;

    // Listen for user actions
    window.addEventListener('beforeunload', () => {
      this.flushSyncQueue();
    });

    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.processSyncQueue();
    });
  }

  queueStateChange() {
    const change = {
      type: 'STATE_UPDATE',
      data: {
        user_id: this.userManager.currentUserId,
        state_data: state,
        last_updated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    this.syncQueue.push(change);
    localStorage.setItem('studyhub_sync_queue', JSON.stringify(this.syncQueue));

    // Process immediately if online
    if (navigator.onLine) {
      this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      for (const change of [...this.syncQueue]) {
        await this.processChange(change);
        const index = this.syncQueue.indexOf(change);
        if (index > -1) {
          this.syncQueue.splice(index, 1);
        }
      }

      localStorage.setItem('studyhub_sync_queue', JSON.stringify(this.syncQueue));
      this.lastSyncTimestamp = new Date().toISOString();
      showToast('Data synced to cloud successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      showToast('Sync failed, will retry later');
    } finally {
      this.isSyncing = false;
    }
  }

  async processChange(change) {
    switch (change.type) {
      case 'STATE_UPDATE':
        await this.upsertUserState(change.data);
        break;
      default:
        throw new Error(`Unknown change type: ${change.type}`);
    }
  }

  async upsertUserState(data) {
    const { error } = await supabase
      .from('user_state_snapshots')
      .upsert(data, {
        onConflict: 'user_id',
        returning: 'minimal'
      });

    if (error) {
      throw error;
    }
  }

  async flushSyncQueue() {
    if (this.syncQueue.length === 0 || !navigator.onLine) {
      return;
    }

    await this.processSyncQueue();
  }

  async getRemoteChanges(since) {
    const { data, error } = await supabase
      .from('user_state_snapshots')
      .select('*')
      .eq('user_id', this.userManager.currentUserId)
      .gt('last_updated', since)
      .order('last_updated', { ascending: false });

    if (error) {
      console.error('Failed to fetch remote changes:', error);
      return [];
    }

    return data || [];
  }
}

// ===== REAL-TIME EVENT BUS =====
class EventBus {
  constructor(supabase) {
    this.supabase = supabase;
    this.subscribers = new Map();
    this.realtimeChannels = new Map();
  }

  emit(eventType, payload) {
    const event = {
      ...payload,
      event_type: eventType,
      user_id: this.userManager.currentUserId,
      timestamp: new Date().toISOString(),
      source: 'frontend'
    };

    // Send to Supabase real-time channel
    if (this.realtimeChannel) {
      this.realtimeChannel.send({
        type: 'INSERT',
        table: 'analytics_events',
        data: event
      });
    }

    // Also notify local subscribers
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event subscriber for ${eventType}:`, error);
        }
      });
    }
  }

  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);
    return () => this.unsubscribe(eventType, callback);
  }

  unsubscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      return;
    }

    const callbacks = this.subscribers.get(eventType);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  setupRealtimeSubscription() {
    // Subscribe to Supabase realtime updates
    this.realtimeChannel = this.supabase
      .channel('analytics_events')
      .on('INSERT', payload => {
        this.emit('event:created', payload.new);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to analytics events');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Realtime channel error');
        }
      });
  }
}

// ===== ANALYTICS TRACKER =====
class AnalyticsTracker {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.setupPageTracking();
    this.setupInteractionTracking();
    this.setupPerformanceTracking();
  }

  setupPageTracking() {
    // Track page navigation
    let currentPage = window.location.hash || '#dashboard';

    window.addEventListener('hashchange', () => {
      const newPage = window.location.hash || '#dashboard';
      if (newPage !== currentPage) {
        this.track('page_view', {
          from_page: currentPage,
          to_page: newPage,
          user_agent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        });
        currentPage = newPage;
      }
    });
  }

  setupInteractionTracking() {
    // Track key user interactions
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-analytics]');
      if (target) {
        this.track('user_interaction', {
          element_type: target.tagName.toLowerCase(),
          element_class: target.className,
          element_id: target.id,
          action: target.dataset.analytics,
          text_content: target.textContent?.trim().substring(0, 100)
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form.tagName === 'FORM') {
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        this.track('form_submit', {
          form_id: form.id,
          form_class: form.className,
          fields: Object.keys(formDataObj)
        });
      }
    });
  }

  setupPerformanceTracking() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.track('performance_metric', {
              metric: 'first_contentful_paint',
              value: entry.startTime
            });
          } else if (entry.name === 'largest-contentful-paint') {
            this.track('performance_metric', {
              metric: 'largest_contentful_paint',
              value: entry.startTime
            });
          } else if (entry.name === 'cumulative-layout-shift') {
            this.track('performance_metric', {
              metric: 'cumulative_layout_shift',
              value: entry.value
            });
          }
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
    }

    // Track timer performance
    let timerIntervalCount = 0;
    const originalSetInterval = window.setInterval;
    window.setInterval = (callback, delay) => {
      if (callback && callback.name === 'tickTimer') {
        timerIntervalCount++;
      }
      return originalSetInterval(callback, delay);
    };

    // Report performance periodically
    setInterval(() => {
      if (timerIntervalCount > 0) {
        this.track('performance_metrics', {
          timer_intervals_active: timerIntervalCount,
          uptime: performance.now()
        });
      }
    }, 60000);
  }

  track(eventType, properties) {
    this.eventBus.emit(eventType, {
      ...properties,
      session_id: this.getSessionId(),
      device_info: this.getDeviceInfo()
    });
  }

  getSessionId() {
    let sessionId = localStorage.getItem('studyhub_session_id');
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substr(2, 9)}${Date.now().toString(36).slice(-4)}`;
      localStorage.setItem('studyhub_session_id', sessionId);
      // Clear session ID after 24 hours
      setTimeout(() => {
        localStorage.removeItem('studyhub_session_id');
      }, 24 * 60 * 60 * 1000);
    }
    return sessionId;
  }

  getDeviceInfo() {
    return {
      user_agent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen_width: screen.width,
      screen_height: screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      connection: navigator.connection?.effectiveType || 'unknown'
    };
  }
}

// ===== FEATURE: REAL-TIME ANALYTICS DASHBOARD =====
class RealTimeDashboard {
  constructor() {
    this.setupDashboardConnection();
    this.initializeCharts();
    this.setupDashboardControls();
  }

  setupDashboardConnection() {
    // Connect to Supabase for real-time updates
    this.realtimeChannel = supabase
      .channel('dashboard_updates')
      .on('INSERT', { table: 'analytics_events' }, payload => {
        this.updateDashboardViews(payload.new);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Dashboard connected to real-time updates');
        }
      });
  }

  updateDashboardViews(event) {
    // Update various dashboard components
    switch (event.event_type) {
      case 'session_logged':
        if (this.updateStudyTimeChart) this.updateStudyTimeChart(event);
        break;
      case 'task_completed':
        if (this.updateTaskCompletionChart) this.updateTaskCompletionChart(event);
        break;
      case 'flashcard_reviewed':
        if (this.updateFlashcardReview) this.updateFlashcardReview(event);
        break;
      case 'quiz_completed':
        if (this.updateQuizPerformance) this.updateQuizPerformance(event);
        break;
      case 'user_interaction':
        if (this.updateUserActivity) this.updateUserActivity(event);
        break;
    }
  }

  async initializeCharts() {
    // Initialize Chart.js with real-time data
    // Note: app.js renderCharts() already owns the analytics canvases.
    // Only create charts here when the helper methods exist AND the canvas
    // is not already managed by the app, otherwise Chart.js throws
    // "Canvas is already in use".
    if (typeof Chart !== 'undefined') {
      const c1 = document.getElementById('studyChart');
      if (c1 && !Chart.getChart(c1)) {
        this.studyTimeChart = this.createStudyTimeChart();
      }
      if (this.createTaskCompletionChart) {
        const c2 = document.getElementById('completionChart');
        if (c2 && !Chart.getChart(c2)) {
          this.taskCompletionChart = this.createTaskCompletionChart();
        }
      }
      if (this.createActivityHeatmap) {
        this.analyticsHeatmap = this.createActivityHeatmap();
      }
    }
  }

  setupDashboardControls() {
    // Add dashboard refresh and export controls
    const dashboardHeader = document.querySelector('#analytics header');
    if (dashboardHeader) {
      const refreshBtn = document.createElement('button');
      refreshBtn.textContent = 'Refresh Data';
      refreshBtn.className = 'ghost';
      refreshBtn.onclick = () => this.refreshDashboardData();
      dashboardHeader.appendChild(refreshBtn);

      const exportBtn = document.createElement('button');
      exportBtn.textContent = 'Export JSON';
      exportBtn.className = 'ghost';
      exportBtn.onclick = () => this.exportDashboardData();
      dashboardHeader.appendChild(exportBtn);
    }
  }

  createStudyTimeChart() {
    const canvas = document.getElementById('studyChart');
    if (!canvas) return null;

    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Study Minutes',
          data: [],
          borderColor: 'rgb(15, 118, 110)',
          backgroundColor: 'rgba(15, 118, 110, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        animation: false, // No animations for better performance
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Minutes' }
          }
        }
      }
    });
  }

  async refreshDashboardData() {
    showToast('Refreshing dashboard data...');

    // Fetch latest analytics from Supabase
    const since = this.lastRefreshTimestamp || new Date(Date.now() - 5 * 60000).toISOString();

    const { data: recentEvents, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gt('timestamp', since)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Failed to refresh dashboard data:', error);
      showToast('Failed to refresh dashboard');
      return;
    }

    this.updateChartsWithRecentData(recentEvents);
    this.lastRefreshTimestamp = new Date().toISOString();
    showToast('Dashboard refreshed');
  }

  updateChartsWithRecentData(events) {
    events.forEach(event => {
      this.updateDashboardViews(event);
    });
  }

  exportDashboardData() {
    // Export analytics data as JSON
    const exportData = {
      exported_at: new Date().toISOString(),
      events: [], // Could pull from Supabase here
      user_id: this.userManager.currentUserId
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studyhub-analytics-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Analytics data exported');
  }
}

// ===== LIVE LEADERBOARD (send-only) =====
// Your stats are pushed to the cloud so peers can see live rankings.
// The leaderboard read-back is never written into your local state.
class LeaderboardManager {
  constructor() {
    this.weekStart = this.getWeekStart();
    this.realtimeChannel = null;
  }

  getWeekStart() {
    const now = new Date();
    const day = (now.getDay() + 6) % 7; // Monday = 0
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    return d.toISOString().split('T')[0];
  }

  async submitStats() {
    if (!supabase || !state) return { ok: false, reason: 'unavailable' };
    try {
      const weekSessions = state.sessions.filter(s => {
        const d = new Date(s.date);
        return d >= new Date(this.weekStart);
      });
      const entry = {
        user_id: localStorage.getItem('studyhub_user_id') || 'anon_' + Math.random().toString(36).substr(2, 8),
        name: (state.profile && state.profile.name) || 'Scholar',
        week_start: this.weekStart,
        xp: (state.profile && state.profile.xp) || 0,
        streak: (state.profile && state.profile.currentStreak) || 0,
        study_minutes: weekSessions.reduce((s, x) => s + (x.minutes || 0), 0),
        quizzes_taken: (state.quizAttempts || []).length,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase
        .from('leaderboard_entries')
        .upsert(entry, { onConflict: 'user_id,week_start' });
      if (error) throw error;
      return { ok: true };
    } catch (e) {
      console.warn('[Leaderboard] Submit failed:', e.message);
      return { ok: false, reason: e.message };
    }
  }

  async fetchLeaderboard() {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .eq('week_start', this.weekStart)
        .order('xp', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn('[Leaderboard] Fetch failed:', e.message);
      return [];
    }
  }

  subscribe(onUpdate) {
    if (!supabase) return;
    try {
      this.realtimeChannel = supabase
        .channel('leaderboard_' + this.weekStart)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard_entries', filter: 'week_start=eq.' + this.weekStart }, () => {
          this.fetchLeaderboard().then(onUpdate);
        })
        .subscribe();
    } catch (e) {
      console.warn('[Leaderboard] Realtime subscribe failed:', e.message);
    }
  }
}

// ===== MAIN INITIALIZATION =====
async function initializeCloudSystem() {
  try {
    // Initialize user manager
    const userManager = new UserManager();
    await userManager.initialize();

    // Initialize event bus
    const eventBus = new EventBus(supabase);
    eventBus.userManager = userManager;
    eventBus.setupRealtimeSubscription();

    // Initialize analytics tracker
    const analyticsTracker = new AnalyticsTracker(eventBus);

    // Initialize cloud sync manager
    const cloudSyncManager = new CloudSyncManager(userManager);

    // Initialize real-time dashboard
    const realTimeDashboard = new RealTimeDashboard();
    realTimeDashboard.userManager = userManager;

    // Initialize live leaderboard (send-only stats, read live rankings)
    const leaderboardManager = new LeaderboardManager();
    await leaderboardManager.submitStats();
    if (typeof window.onLeaderboardUpdate === 'function') {
      leaderboardManager.subscribe(rows => window.onLeaderboardUpdate(rows));
    }

    // Replace original saveState to enable cloud sync
    if (typeof saveState !== 'function' || saveState.__cloudWrapped) {
      console.log('saveState already wrapped — skipping duplicate wrap');
    } else {
      const originalSaveState = saveState;
      saveState = function() {
        originalSaveState();
        cloudSyncManager.queueStateChange();
      };
      saveState.__cloudWrapped = true;
    }

    // Expose globally for other modules
    window.studyHub = {
      ...window.studyHub,
      userManager,
      eventBus,
      analyticsTracker,
      cloudSyncManager,
      realTimeDashboard,
      leaderboardManager
    };

    console.log('✅ Cloud system initialized successfully');
    showToast('Cloud sync enabled');

    return {
      userManager,
      eventBus,
      analyticsTracker,
      cloudSyncManager,
      realTimeDashboard,
      leaderboardManager
    };

  } catch (error) {
    console.error('Failed to initialize cloud system:', error);
    showToast('Cloud sync unavailable, using local storage only');
    return null;
  }
}

// Initialize cloud system when the app starts
if (typeof app !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    await initializeCloudSystem();
  });
}

// ===== BACKWARD COMPATIBILITY =====
// Keep original localStorage functionality as fallback
function getLegacyState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse legacy state:', error);
    return null;
  }
}

function saveLegacyState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Export for module compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeCloudSystem,
    UserManager,
    CloudSyncManager,
    EventBus,
    AnalyticsTracker,
    RealTimeDashboard,
    LeaderboardManager
  };
}
