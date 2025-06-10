import { makeAutoObservable } from "mobx";

class AdminStore {
  users = [];
  usersLoaded = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Get user by ID from cache
  getUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  // Get user info for display (email + name)
  getUserInfo(userId) {
    const user = this.getUserById(userId);
    if (user) {
      return {
        email: user.email,
        fullName: user.fullName,
        activeMember: user.activeMember,
        subscriptionStatus: user.subscriptionStatus,
      };
    }
    return {
      email: "Unknown User",
      fullName: "Unknown User",
      activeMember: false,
      subscriptionStatus: "unknown",
    };
  }

  async fetchUsers() {
    if (this.usersLoaded && this.users.length > 0) {
      console.log("📋 Users already cached, skipping fetch");
      return;
    }

    this.loading = true;
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.users = data.users;
        this.usersLoaded = true;
        console.log(`📋 Cached ${this.users.length} users in AdminStore`);
      }
    } catch (error) {
      console.error("Error fetching users for cache:", error);
    } finally {
      this.loading = false;
    }
  }

  // Force refresh users cache
  async refreshUsers() {
    this.usersLoaded = false;
    await this.fetchUsers();
  }
}

export default AdminStore;
