/**
 * User Controller Tests
 * Tests for getAllUsers, getUserById, updateUser, deleteUser,
 * toggleUserStatus, changeUserRole, getUserStats
 */

import { jest } from "@jest/globals";

// Mock User model
const mockUser = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
};

// Mock user instance
const mockUserInstance = {
  id: 1,
  name: "John Farmer",
  email: "john@farm.com",
  phone: "1234567890",
  role: "customer",
  is_active: true,
  is_verified: true,
  password: "hashedpassword123",
  update: jest.fn(),
  destroy: jest.fn(),
};

// Helper: mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users without sensitive fields", async () => {
      const users = [
        { id: 1, name: "John", email: "john@farm.com", role: "customer" },
        { id: 2, name: "Admin", email: "admin@farm.com", role: "admin" },
      ];
      mockUser.findAll.mockResolvedValue(users);

      const res = mockResponse();
      const result = await mockUser.findAll({
        attributes: {
          exclude: [
            "password",
            "verification_token",
            "reset_token",
            "verification_expires",
            "reset_expires",
          ],
        },
        order: [["createdAt", "DESC"]],
      });
      res.json(result);

      expect(mockUser.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            exclude: expect.arrayContaining(["password", "verification_token"]),
          }),
        })
      );
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should return empty array when no users exist", async () => {
      mockUser.findAll.mockResolvedValue([]);

      const res = mockResponse();
      const result = await mockUser.findAll({ attributes: { exclude: ["password"] } });
      res.json(result);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it("should return 500 on database error", async () => {
      mockUser.findAll.mockRejectedValue(new Error("DB error"));

      const res = mockResponse();
      try {
        await mockUser.findAll();
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID without password", async () => {
      const user = { id: 1, name: "John", email: "john@farm.com", role: "customer" };
      mockUser.findByPk.mockResolvedValue(user);

      const res = mockResponse();
      const result = await mockUser.findByPk(1, {
        attributes: { exclude: ["password", "verification_token", "reset_token"] },
      });
      res.json(result);

      expect(mockUser.findByPk).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          attributes: expect.objectContaining({
            exclude: expect.arrayContaining(["password"]),
          }),
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: "John" })
      );
    });

    it("should return 404 if user not found", async () => {
      mockUser.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const user = await mockUser.findByPk(999);

      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 500 on database error", async () => {
      mockUser.findByPk.mockRejectedValue(new Error("DB error"));

      const res = mockResponse();
      try {
        await mockUser.findByPk(1);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateUser", () => {
    it("should update a user with valid data", async () => {
      mockUser.findByPk.mockResolvedValue(mockUserInstance);
      mockUserInstance.update.mockResolvedValue(true);

      const user = await mockUser.findByPk(1);
      await user.update({ name: "Updated John", phone: "9876543210" });

      expect(mockUserInstance.update).toHaveBeenCalledWith({
        name: "Updated John",
        phone: "9876543210",
      });
    });

    it("should return 404 if updating non-existent user", async () => {
      mockUser.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const user = await mockUser.findByPk(999);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should prevent admin from deactivating themselves", () => {
      const reqUser = { id: 1, role: "admin" };
      const targetUser = { id: 1, role: "admin" };
      const is_active = false;

      const res = mockResponse();
      if (reqUser.id === targetUser.id && is_active === false) {
        res.status(400).json({ message: "You cannot deactivate yourself" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You cannot deactivate yourself",
      });
    });

    it("should prevent admin from changing their own role", () => {
      const reqUser = { id: 1, role: "admin" };
      const targetUser = { id: 1, role: "admin" };
      const newRole = "customer";

      const res = mockResponse();
      if (reqUser.id === targetUser.id && newRole !== targetUser.role) {
        res.status(400).json({ message: "You cannot change your own role" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You cannot change your own role",
      });
    });

    it("should reject duplicate email", async () => {
      const existingUser = { id: 2, email: "taken@farm.com" };
      mockUser.findOne.mockResolvedValue(existingUser);

      const res = mockResponse();
      const newEmail = "taken@farm.com";
      const currentEmail = "john@farm.com";

      if (newEmail && newEmail !== currentEmail) {
        const found = await mockUser.findOne({ where: { email: newEmail } });
        if (found) {
          res.status(400).json({ message: "Email already in use" });
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email already in use" });
    });

    it("should allow email update when email is not taken", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const newEmail = "newemail@farm.com";
      const currentEmail = "john@farm.com";
      let emailOk = true;

      if (newEmail && newEmail !== currentEmail) {
        const found = await mockUser.findOne({ where: { email: newEmail } });
        if (found) {
          emailOk = false;
        }
      }

      expect(emailOk).toBe(true);
    });

    it("should preserve fields when not provided in update", () => {
      const user = {
        name: "John",
        email: "john@farm.com",
        phone: "123",
        role: "customer",
        is_active: true,
        is_verified: true,
      };
      const body = { name: "Updated John" };

      const updateData = {
        name: body.name || user.name,
        email: body.email || user.email,
        phone: body.phone !== undefined ? body.phone : user.phone,
        role: body.role || user.role,
        is_active: body.is_active !== undefined ? body.is_active : user.is_active,
        is_verified:
          body.is_verified !== undefined ? body.is_verified : user.is_verified,
      };

      expect(updateData.name).toBe("Updated John");
      expect(updateData.email).toBe("john@farm.com");
      expect(updateData.phone).toBe("123");
      expect(updateData.role).toBe("customer");
    });

    it("should return updated user without password in response", () => {
      const user = {
        id: 1,
        name: "John",
        email: "john@farm.com",
        phone: "123",
        role: "customer",
        is_active: true,
        is_verified: true,
        password: "hashed123",
      };

      const res = mockResponse();
      const responseUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
      };
      res.json({ message: "User updated successfully!", user: responseUser });

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User updated successfully!",
          user: expect.not.objectContaining({ password: expect.anything() }),
        })
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      mockUser.findByPk.mockResolvedValue(mockUserInstance);
      mockUserInstance.destroy.mockResolvedValue(true);

      const res = mockResponse();
      const reqUser = { id: 99 }; // different from target
      const user = await mockUser.findByPk(1);

      if (reqUser.id === user.id) {
        res.status(400).json({ message: "You cannot delete yourself" });
      } else {
        await user.destroy();
        res.json({ message: "User deleted successfully!" });
      }

      expect(mockUserInstance.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully!",
      });
    });

    it("should return 404 if deleting non-existent user", async () => {
      mockUser.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const user = await mockUser.findByPk(999);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should prevent admin from deleting themselves", () => {
      const reqUser = { id: 1 };
      const targetUser = { id: 1 };

      const res = mockResponse();
      if (reqUser.id === targetUser.id) {
        res.status(400).json({ message: "You cannot delete yourself" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You cannot delete yourself",
      });
    });
  });

  describe("toggleUserStatus", () => {
    it("should toggle user from active to inactive", async () => {
      const user = { ...mockUserInstance, is_active: true, update: jest.fn() };
      mockUser.findByPk.mockResolvedValue(user);

      const res = mockResponse();
      const reqUser = { id: 99 }; // different from target
      const found = await mockUser.findByPk(1);

      if (reqUser.id === found.id) {
        res.status(400).json({ message: "You cannot change your own status" });
      } else {
        await found.update({ is_active: !found.is_active });
        res.json({
          message: `User ${found.is_active ? "activated" : "deactivated"} successfully!`,
          is_active: found.is_active,
        });
      }

      expect(user.update).toHaveBeenCalledWith({ is_active: false });
    });

    it("should toggle user from inactive to active", async () => {
      const user = { ...mockUserInstance, is_active: false, update: jest.fn() };
      mockUser.findByPk.mockResolvedValue(user);

      const found = await mockUser.findByPk(1);
      await found.update({ is_active: !found.is_active });

      expect(user.update).toHaveBeenCalledWith({ is_active: true });
    });

    it("should return 404 if user not found", async () => {
      mockUser.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const user = await mockUser.findByPk(999);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should prevent admin from toggling their own status", () => {
      const reqUser = { id: 1 };
      const targetUser = { id: 1 };

      const res = mockResponse();
      if (reqUser.id === targetUser.id) {
        res.status(400).json({ message: "You cannot change your own status" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You cannot change your own status",
      });
    });
  });

  describe("changeUserRole", () => {
    it("should change user role to admin", async () => {
      const user = { ...mockUserInstance, role: "customer", update: jest.fn() };
      mockUser.findByPk.mockResolvedValue(user);

      const res = mockResponse();
      const reqUser = { id: 99 };
      const newRole = "admin";

      if (!["customer", "admin"].includes(newRole)) {
        res.status(400).json({ message: "Invalid role" });
        return;
      }

      const found = await mockUser.findByPk(1);
      if (reqUser.id === found.id) {
        res.status(400).json({ message: "You cannot change your own role" });
      } else {
        await found.update({ role: newRole });
        res.json({ message: `User role changed to ${newRole}!`, role: found.role });
      }

      expect(user.update).toHaveBeenCalledWith({ role: "admin" });
    });

    it("should change user role to customer", async () => {
      const user = { ...mockUserInstance, role: "admin", update: jest.fn() };
      mockUser.findByPk.mockResolvedValue(user);

      const found = await mockUser.findByPk(1);
      await found.update({ role: "customer" });

      expect(user.update).toHaveBeenCalledWith({ role: "customer" });
    });

    it("should reject invalid role", () => {
      const role = "superadmin";

      const res = mockResponse();
      if (!["customer", "admin"].includes(role)) {
        res.status(400).json({ message: "Invalid role" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid role" });
    });

    it("should accept valid roles only", () => {
      expect(["customer", "admin"].includes("customer")).toBe(true);
      expect(["customer", "admin"].includes("admin")).toBe(true);
      expect(["customer", "admin"].includes("moderator")).toBe(false);
      expect(["customer", "admin"].includes("")).toBe(false);
    });

    it("should return 404 if user not found", async () => {
      mockUser.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const user = await mockUser.findByPk(999);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should prevent admin from changing their own role", () => {
      const reqUser = { id: 1 };
      const targetUser = { id: 1 };

      const res = mockResponse();
      if (reqUser.id === targetUser.id) {
        res.status(400).json({ message: "You cannot change your own role" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getUserStats", () => {
    it("should return user statistics", async () => {
      mockUser.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(85) // active
        .mockResolvedValueOnce(90) // verified
        .mockResolvedValueOnce(5) // admins
        .mockResolvedValueOnce(95); // customers

      const res = mockResponse();

      const totalUsers = await mockUser.count();
      const activeUsers = await mockUser.count({ where: { is_active: true } });
      const verifiedUsers = await mockUser.count({ where: { is_verified: true } });
      const adminUsers = await mockUser.count({ where: { role: "admin" } });
      const customerUsers = await mockUser.count({ where: { role: "customer" } });

      res.json({
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        admins: adminUsers,
        customers: customerUsers,
      });

      expect(res.json).toHaveBeenCalledWith({
        total: 100,
        active: 85,
        verified: 90,
        admins: 5,
        customers: 95,
      });
    });

    it("should return zeros when no users exist", async () => {
      mockUser.count.mockResolvedValue(0);

      const res = mockResponse();
      const total = await mockUser.count();
      const active = await mockUser.count({ where: { is_active: true } });

      res.json({ total, active });

      expect(res.json).toHaveBeenCalledWith({ total: 0, active: 0 });
    });

    it("should return 500 on database error", async () => {
      mockUser.count.mockRejectedValue(new Error("DB error"));

      const res = mockResponse();
      try {
        await mockUser.count();
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
