import { makeAutoObservable } from "mobx";

class AuthStore {
  user = null;
  isAuthenticated = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  async initialize() {
    try {
      const token = localStorage.getItem("authToken");
      // console.log("Token from localStorage:", token);

      if (token && token !== "undefined" && token !== "null") {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          this.user = await response.json();
          this.isAuthenticated = true;
        } else {
          console.error("Failed to authenticate:", response.statusText);
          this.isAuthenticated = false;
          localStorage.removeItem("authToken");
        }
      } else {
        console.log("No valid token found in localStorage");
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      this.isInitialized = true;
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
    this.user = data.user;
    this.isAuthenticated = true;
    this.isInitialized = true;
    localStorage.setItem("authToken", data.token);
  }

  async login(email, password) {
    console.log("Login called with email:", email, "and password:", password);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("Login response data:", data);

    this.user = data.user;
    this.isAuthenticated = true;
    this.isInitialized = true;
    console.log("User set in store:", this.user);
    console.log("isAuthenticated set to:", this.isAuthenticated);
    console.log("isInitialized set to:", this.isInitialized);

    if (data.token) {
      localStorage.setItem("authToken", data.token);
      console.log("Token stored:", data.token);

      // Also set a cookie for middleware
      document.cookie = `auth-token=${data.token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`;
    } else if (data.accessToken) {
      localStorage.setItem("authToken", data.accessToken);
      console.log("Access token stored:", data.accessToken);

      // Also set a cookie for middleware
      document.cookie = `auth-token=${data.accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`;
    } else {
      console.error("No token found in login response:", data);
    }
  }

  async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    this.user = null;
    this.isAuthenticated = false;
    this.isInitialized = false;
    localStorage.removeItem("authToken");

    // Also remove the cookie
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.location.href = "/login";
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
}

class VideoStore {
  videos = [];
  loading = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchVideos() {
    this.loading = true;
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        this.videos = await response.json();
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      this.loading = false;
      this.isInitialized = true;
    }
  }

  async getSignedVideoUrl(videoId) {
    const response = await fetch(`/api/videos/secure?videoId=${videoId}`);
    if (!response.ok) {
      throw new Error("Failed to get video URL");
    }

    const data = await response.json();
    return data.signedUrl;
  }
}

class SubscriptionStore {
  paymentHistory = [];

  constructor() {
    makeAutoObservable(this);
  }

  async createCheckoutSession(userData) {
    const params = new URLSearchParams({
      products: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID,
      customerEmail: userData.email,
      customerName: userData.fullName,
      metadata: JSON.stringify({
        fullName: userData.fullName,
        marketingConsent: userData.marketingConsent.toString(),
      }),
    });

    const checkoutUrl = `/api/subscription/create?${params.toString()}`;
    return checkoutUrl;
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
