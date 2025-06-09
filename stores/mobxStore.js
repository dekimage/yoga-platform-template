import { makeAutoObservable } from "mobx";

// Dummy data flag - set to false to use real APIs
const isDummy = true;

// Dummy data
const dummyVideos = [
  {
    id: "1",
    title: "Morning Flow for Beginners",
    slug: "morning-flow-beginners",
    description:
      "A gentle 20-minute flow to start your day with energy and mindfulness.",
    bunnyVideoId: "video1",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Vinyasa",
    tags: ["morning", "beginner", "flow"],
    level: "beginner",
    duration: 20,
  },
  {
    id: "2",
    title: "Power Yoga for Strength",
    slug: "power-yoga-strength",
    description:
      "Build strength and endurance with this challenging 45-minute power yoga session.",
    bunnyVideoId: "video2",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Power",
    tags: ["strength", "advanced", "power"],
    level: "advanced",
    duration: 45,
  },
  {
    id: "3",
    title: "Restorative Evening Practice",
    slug: "restorative-evening-practice",
    description:
      "Wind down with this peaceful 30-minute restorative practice perfect for bedtime.",
    bunnyVideoId: "video3",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Restorative",
    tags: ["evening", "relaxation", "restorative"],
    level: "beginner",
    duration: 30,
  },
];

const dummyUser = {
  id: "user1",
  email: "demo@example.com",
  fullName: "Demo User",
  activeMember: true,
  createdAt: new Date().toISOString(),
  analytics: {
    minutesWatched: 120,
    monthsPaid: 2,
    lastSession: new Date().toISOString(),
    completedVideos: ["1"],
  },
  preferences: {
    notifications: true,
  },
  marketingConsent: false,
  isAdmin: true,
};

class AuthStore {
  user = null;
  isAuthenticated = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  async initialize() {
    try {
      if (isDummy) {
        this.user = dummyUser;
        this.isAuthenticated = true;
      } else {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          this.user = await response.json();
          this.isAuthenticated = true;
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      this.isInitialized = true;
    }
  }

  async signup(email, password, fullName, marketingConsent = false) {
    if (isDummy) {
      // For dummy mode, just create a fake user
      this.user = {
        ...dummyUser,
        email,
        fullName,
        marketingConsent,
        activeMember: false,
      };
      this.isAuthenticated = true;
      return;
    }

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
  }

  async login(email, password) {
    if (isDummy) {
      this.user = dummyUser;
      this.isAuthenticated = true;
      return;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    this.user = await response.json();
    this.isAuthenticated = true;
  }

  async logout() {
    if (isDummy) {
      this.user = null;
      this.isAuthenticated = false;
      return;
    }

    await fetch("/api/auth/logout", { method: "POST" });
    this.user = null;
    this.isAuthenticated = false;
  }

  async resetPassword(email) {
    if (isDummy) {
      return;
    }

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
    if (isDummy) {
      this.user = { ...this.user, ...data };
      return;
    }

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
    if (isDummy) {
      return;
    }

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
      if (isDummy) {
        this.videos = dummyVideos;
      } else {
        const response = await fetch("/api/videos");
        if (response.ok) {
          this.videos = await response.json();
        }
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      this.loading = false;
      this.isInitialized = true;
    }
  }

  async getSignedVideoUrl(videoId) {
    if (isDummy) {
      return "/placeholder.mp4";
    }

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
    if (isDummy) {
      return "https://checkout.polar.sh/demo";
    }

    // Build query parameters for the new Polar.sh Next.js package
    const params = new URLSearchParams({
      products: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID,
      customerEmail: userData.email,
      customerName: userData.fullName,
      metadata: JSON.stringify({
        fullName: userData.fullName,
        marketingConsent: userData.marketingConsent.toString(),
      }),
    });

    // The new Polar.sh package uses GET with query parameters
    const checkoutUrl = `/api/subscription/create?${params.toString()}`;

    // Return the URL directly since the Polar package handles the redirect
    return checkoutUrl;
  }

  async getCustomerPortalUrl() {
    if (isDummy) {
      return "https://portal.polar.sh/demo";
    }

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
    if (isDummy) {
      return;
    }

    await fetch("/api/user/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view", videoId }),
    });
  }

  async trackVideoComplete(videoId) {
    if (isDummy) {
      return;
    }

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
    if (isDummy) {
      this.users = [dummyUser];
      this.totalUsers = 1;
      this.activeSubscriptions = 1;
      this.monthlyRevenue = 12;
      this.analyticsData = {
        totalWatchTime: 120,
        avgSessionDuration: 25,
        completionRate: 75,
        popularVideos: dummyVideos.map((v) => ({
          ...v,
          views: Math.floor(Math.random() * 100),
        })),
      };
      return;
    }

    // Load real admin data
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
    if (isDummy) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.activeMember = activate;
      }
      return;
    }

    await fetch("/api/admin/users/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, activate }),
    });

    // Update local state
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
  isDummy,
};
