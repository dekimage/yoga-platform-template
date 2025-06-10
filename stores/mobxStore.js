import { makeAutoObservable, runInAction } from "mobx";

class AuthStore {
  user = null;
  isAuthenticated = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Helper function to convert Firestore timestamps
  convertFirestoreTimestamps(userData) {
    const converted = { ...userData };

    // Convert subscriptionEndsAt
    if (converted.subscriptionEndsAt) {
      if (converted.subscriptionEndsAt.seconds) {
        converted.subscriptionEndsAt = new Date(
          converted.subscriptionEndsAt.seconds * 1000
        );
      } else if (typeof converted.subscriptionEndsAt === "string") {
        converted.subscriptionEndsAt = new Date(converted.subscriptionEndsAt);
      }
    }

    // Convert canceledAt
    if (converted.canceledAt) {
      if (converted.canceledAt.seconds) {
        converted.canceledAt = new Date(converted.canceledAt.seconds * 1000);
      } else if (typeof converted.canceledAt === "string") {
        converted.canceledAt = new Date(converted.canceledAt);
      }
    }

    return converted;
  }

  async initialize() {
    runInAction(() => {
      this.isInitialized = false;
    });

    const token = localStorage.getItem("authToken");
    if (!token) {
      runInAction(() => {
        this.isAuthenticated = false;
        this.isInitialized = true;
        this.user = null;
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        runInAction(() => {
          this.isAuthenticated = true;
          this.user = this.convertFirestoreTimestamps(userData);
          this.isInitialized = true;
        });
      } else {
        localStorage.removeItem("authToken");
        runInAction(() => {
          this.isAuthenticated = false;
          this.isInitialized = true;
          this.user = null;
        });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      runInAction(() => {
        this.isAuthenticated = false;
        this.isInitialized = true;
        this.user = null;
      });
    }
  }

  async signup(email, password, fullName, marketingConsent = false) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, marketingConsent }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Signup failed");
    }

    const data = await response.json();

    runInAction(() => {
      this.user = this.convertFirestoreTimestamps(data.user);
      this.isAuthenticated = true;
      this.isInitialized = true;
    });

    localStorage.setItem("authToken", data.token);
  }

  async login(email, password) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();

    runInAction(() => {
      this.user = this.convertFirestoreTimestamps(data.user);
      this.isAuthenticated = true;
      this.isInitialized = true;
    });

    localStorage.setItem("authToken", data.token);
  }

  logout() {
    localStorage.removeItem("authToken");
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
      this.isInitialized = true;
    });
  }

  async resetPassword(email) {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send reset email");
    }
  }

  async updateProfile(data) {
    const response = await fetch("/api/user/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    this.user = { ...this.user, ...data };
  }

  async updatePassword(password) {
    const response = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error("Failed to update password");
    }
  }

  async forceRefresh() {
    console.log("🔄 Force refreshing user data...");
    try {
      const token = localStorage.getItem("authToken");
      if (token && token !== "undefined" && token !== "null") {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("✅ Fresh user data:", userData);
          this.user = userData;
          this.isAuthenticated = true;
          return userData;
        }
      }
    } catch (error) {
      console.error("❌ Error force refreshing user:", error);
    }
    return null;
  }

  async checkAuth() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      runInAction(() => {
        this.isAuthenticated = false;
        this.isInitialized = true;
        this.user = null;
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        runInAction(() => {
          this.isAuthenticated = true;
          this.user = this.convertFirestoreTimestamps(userData);
          this.isInitialized = true;
        });
      } else {
        localStorage.removeItem("authToken");
        runInAction(() => {
          this.isAuthenticated = false;
          this.isInitialized = true;
          this.user = null;
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      runInAction(() => {
        this.isAuthenticated = false;
        this.isInitialized = true;
        this.user = null;
      });
    }
  }
}

class VideoStore {
  videos = [];
  loading = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchVideos() {
    runInAction(() => {
      this.loading = true;
    });

    try {
      const response = await fetch("/api/videos");
      const data = await response.json();

      runInAction(() => {
        this.videos = data;
        this.loading = false;
        this.isInitialized = true;
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
      runInAction(() => {
        this.loading = false;
        this.isInitialized = true;
      });
    }
  }

  async ensureVideosLoaded() {
    if (!this.isInitialized && !this.loading) {
      await this.fetchVideos();
    }
  }

  async getSignedVideoUrl(videoId) {
    console.log("🎬 Getting signed video URL for:", videoId);

    const token = localStorage.getItem("authToken");
    console.log(
      "🔑 Token from localStorage:",
      token ? `${token.substring(0, 20)}...` : "null"
    );
    console.log("🔑 Token exists:", !!token);
    console.log("🔑 Token type:", typeof token);
    console.log("🔑 Token length:", token ? token.length : 0);

    if (!token || token === "null" || token === "undefined") {
      console.error("❌ No valid token found in localStorage");
      throw new Error("No authentication token found");
    }

    console.log("📡 Making request to /api/videos/secure with token");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("📡 Request headers:", headers);

    const response = await fetch(`/api/videos/secure?videoId=${videoId}`, {
      method: "GET",
      headers: headers,
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error:", errorData);
      throw new Error(errorData.error || "Failed to get video URL");
    }

    const data = await response.json();
    console.log("✅ Successfully got signed URL");
    return data.signedUrl;
  }
}

class SubscriptionStore {
  paymentHistory = [];

  constructor() {
    makeAutoObservable(this);
  }

  async createCheckoutSession(customerData) {
    try {
      const response = await fetch("/api/subscription/create", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Checkout creation failed:", errorText);
        throw new Error(`Failed to create checkout session: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Checkout session created:", data);

      return data.url;
    } catch (error) {
      console.error("❌ Error creating checkout session:", error);
      throw error;
    }
  }

  async getCustomerPortalUrl() {
    const response = await fetch("/api/subscription/portal");
    if (!response.ok) {
      throw new Error("Failed to get portal URL");
    }

    const data = await response.json();
    return data.portalUrl;
  }
}

class AnalyticsStore {
  constructor() {
    makeAutoObservable(this);
  }

  async trackVideoView(videoId) {
    await fetch("/api/user/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view", videoId }),
    });
  }

  async trackVideoComplete(videoId) {
    await fetch("/api/user/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete", videoId }),
    });
  }
}

class AdminStore {
  users = [];
  totalUsers = 0;
  activeSubscriptions = 0;
  monthlyRevenue = 0;
  analyticsData = {};
  userSearchQuery = "";

  constructor() {
    makeAutoObservable(this);
  }

  get filteredUsers() {
    if (!this.userSearchQuery) return this.users;

    return this.users.filter(
      (user) =>
        user.fullName
          .toLowerCase()
          .includes(this.userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.userSearchQuery.toLowerCase())
    );
  }

  setUserSearchQuery(query) {
    this.userSearchQuery = query;
  }

  async initialize() {
    const [usersRes, analyticsRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/admin/analytics"),
    ]);

    if (usersRes.ok) {
      const usersData = await usersRes.json();
      this.users = usersData.users;
      this.totalUsers = usersData.total;
      this.activeSubscriptions = usersData.activeSubscriptions;
      this.monthlyRevenue = usersData.monthlyRevenue;
    }

    if (analyticsRes.ok) {
      this.analyticsData = await analyticsRes.json();
    }
  }

  async toggleUserActivation(userId, activate) {
    await fetch("/api/admin/users/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, activate }),
    });

    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.activeMember = activate;
    }
  }
}

// Create store instances
const authStore = new AuthStore();
const videoStore = new VideoStore();
const subscriptionStore = new SubscriptionStore();
const analyticsStore = new AnalyticsStore();
const adminStore = new AdminStore();

export const mobxStore = {
  authStore,
  videoStore,
  subscriptionStore,
  analyticsStore,
  adminStore,
};
