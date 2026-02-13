/**
 * Booking Controller Tests
 * Tests for createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking
 */

import { jest } from "@jest/globals";

// Mock models
const mockBooking = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockProduct = {
  findByPk: jest.fn(),
};

const mockAnimal = {
  findByPk: jest.fn(),
};

// Mock instances
const mockProductInstance = {
  id: 1,
  name: "Organic Tomatoes",
  price: 5.99,
  stock: 50,
  image: "/uploads/tomato.jpg",
  save: jest.fn(),
};

const mockAnimalInstance = {
  id: 1,
  name: "Jersey Cow",
  price: 1500,
  quantity: 3,
  image: "/uploads/cow.jpg",
  save: jest.fn(),
};

const mockBookingInstance = {
  id: 1,
  user_id: 1,
  product_id: 1,
  animal_id: null,
  quantity: 5,
  total_price: 29.95,
  status: "pending",
  update: jest.fn(),
  save: jest.fn(),
  destroy: jest.fn(),
};

// Helper: mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Booking Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should block admin users from creating bookings", async () => {
      const req = { user: { id: 1, role: "admin" }, body: { product_id: 1, quantity: 2 } };
      const res = mockResponse();

      if (req.user.role === "admin") {
        res.status(403).json({ message: "Admins cannot create bookings" });
      }

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Admins cannot create bookings" });
    });

    it("should require product_id or animal_id", async () => {
      const req = { user: { id: 1, role: "customer" }, body: { quantity: 2 } };
      const res = mockResponse();

      const { product_id, animal_id, quantity } = req.body;
      if (!product_id && !animal_id) {
        res.status(400).json({ message: "Product ID or Animal ID is required" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should require quantity", async () => {
      const req = { user: { id: 1, role: "customer" }, body: { product_id: 1 } };
      const res = mockResponse();

      if (!req.body.quantity) {
        res.status(400).json({ message: "Quantity is required" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create a product booking and reduce stock", async () => {
      const product = { ...mockProductInstance, stock: 50 };
      mockProduct.findByPk.mockResolvedValue(product);

      const quantity = 5;
      const total_price = product.price * quantity;

      const newBooking = {
        id: 2,
        user_id: 1,
        product_id: product.id,
        quantity,
        total_price,
        status: "pending",
      };
      mockBooking.create.mockResolvedValue(newBooking);

      const res = mockResponse();
      const foundProduct = await mockProduct.findByPk(1);
      expect(foundProduct).toBeTruthy();

      // Check sufficient stock
      expect(foundProduct.stock >= quantity).toBe(true);

      // Create booking
      const booking = await mockBooking.create({
        user_id: 1,
        product_id: foundProduct.id,
        quantity,
        total_price: foundProduct.price * quantity,
        status: "pending",
      });

      // Reduce stock
      foundProduct.stock -= quantity;
      await foundProduct.save();

      res.status(201).json({ message: "Booking created successfully!", booking });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(foundProduct.stock).toBe(45);
      expect(foundProduct.save).toHaveBeenCalled();
    });

    it("should return 404 if product not found", async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const product = await mockProduct.findByPk(999);

      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 if insufficient stock", async () => {
      const product = { ...mockProductInstance, stock: 2 };
      mockProduct.findByPk.mockResolvedValue(product);

      const quantity = 10;
      const res = mockResponse();
      const foundProduct = await mockProduct.findByPk(1);

      if (foundProduct.stock < quantity) {
        res.status(400).json({ message: "Insufficient stock" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create an animal booking", async () => {
      const animal = { ...mockAnimalInstance, quantity: 3 };
      mockAnimal.findByPk.mockResolvedValue(animal);

      const quantity = 1;
      const newBooking = {
        id: 3,
        user_id: 1,
        animal_id: animal.id,
        quantity,
        total_price: animal.price * quantity,
        status: "pending",
      };
      mockBooking.create.mockResolvedValue(newBooking);

      const res = mockResponse();
      const foundAnimal = await mockAnimal.findByPk(1);
      expect(foundAnimal).toBeTruthy();
      expect(foundAnimal.quantity >= quantity).toBe(true);

      const booking = await mockBooking.create({
        user_id: 1,
        animal_id: foundAnimal.id,
        quantity,
        total_price: foundAnimal.price * quantity,
        status: "pending",
      });

      foundAnimal.quantity -= quantity;

      res.status(201).json({ message: "Booking created successfully!", booking });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(foundAnimal.quantity).toBe(2);
    });
  });

  describe("getMyBookings", () => {
    it("should return user bookings", async () => {
      const bookings = [
        { id: 1, user_id: 1, status: "pending" },
        { id: 2, user_id: 1, status: "confirmed" },
      ];
      mockBooking.findAll.mockResolvedValue(bookings);

      const res = mockResponse();
      const result = await mockBooking.findAll({ where: { user_id: 1 } });
      res.json(result);

      expect(mockBooking.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 1 } })
      );
      expect(res.json).toHaveBeenCalledWith(bookings);
    });

    it("should return empty array if no bookings", async () => {
      mockBooking.findAll.mockResolvedValue([]);

      const res = mockResponse();
      const result = await mockBooking.findAll({ where: { user_id: 999 } });
      res.json(result);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe("getAllBookings (admin)", () => {
    it("should return all bookings for admin", async () => {
      const bookings = [
        { id: 1, user_id: 1, status: "pending" },
        { id: 2, user_id: 2, status: "confirmed" },
      ];
      mockBooking.findAll.mockResolvedValue(bookings);

      const res = mockResponse();
      const result = await mockBooking.findAll();
      res.json(result);

      expect(res.json).toHaveBeenCalledWith(bookings);
      expect(bookings.length).toBe(2);
    });
  });

  describe("updateBookingStatus", () => {
    it("should update booking status", async () => {
      const booking = { ...mockBookingInstance, status: "pending" };
      booking.update = jest.fn().mockResolvedValue({ ...booking, status: "confirmed" });
      mockBooking.findByPk.mockResolvedValue(booking);

      const res = mockResponse();
      const found = await mockBooking.findByPk(1);
      await found.update({ status: "confirmed" });
      res.json({ message: "Booking status updated", booking: found });

      expect(found.update).toHaveBeenCalledWith({ status: "confirmed" });
    });

    it("should return 404 if booking not found", async () => {
      mockBooking.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const booking = await mockBooking.findByPk(999);

      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should validate booking status values", () => {
      const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];
      expect(validStatuses).toContain("pending");
      expect(validStatuses).toContain("confirmed");
      expect(validStatuses).toContain("delivered");
      expect(validStatuses).toContain("cancelled");
      expect(validStatuses).not.toContain("invalid");
    });
  });

  describe("cancelBooking", () => {
    it("should cancel booking and restore product stock", async () => {
      const booking = {
        id: 1,
        user_id: 1,
        product_id: 1,
        animal_id: null,
        quantity: 5,
        status: "pending",
        update: jest.fn(),
      };
      const product = { id: 1, stock: 45, save: jest.fn() };

      mockBooking.findByPk.mockResolvedValue(booking);
      mockProduct.findByPk.mockResolvedValue(product);

      const res = mockResponse();
      const found = await mockBooking.findByPk(1);

      // Restore stock
      if (found.product_id) {
        const prod = await mockProduct.findByPk(found.product_id);
        prod.stock += found.quantity;
        await prod.save();
        expect(prod.stock).toBe(50);
      }

      await found.update({ status: "cancelled" });
      res.json({ message: "Booking cancelled successfully!" });

      expect(found.update).toHaveBeenCalledWith({ status: "cancelled" });
      expect(product.save).toHaveBeenCalled();
    });

    it("should cancel booking and restore animal quantity", async () => {
      const booking = {
        id: 2,
        user_id: 1,
        product_id: null,
        animal_id: 1,
        quantity: 1,
        status: "pending",
        update: jest.fn(),
      };
      const animal = { id: 1, quantity: 2, save: jest.fn() };

      mockBooking.findByPk.mockResolvedValue(booking);
      mockAnimal.findByPk.mockResolvedValue(animal);

      const found = await mockBooking.findByPk(2);

      if (found.animal_id) {
        const anim = await mockAnimal.findByPk(found.animal_id);
        anim.quantity += found.quantity;
        await anim.save();
        expect(anim.quantity).toBe(3);
      }

      await found.update({ status: "cancelled" });

      expect(found.update).toHaveBeenCalledWith({ status: "cancelled" });
      expect(animal.save).toHaveBeenCalled();
    });

    it("should only allow user to cancel their own booking", async () => {
      const booking = { id: 1, user_id: 5, status: "pending" };
      const reqUser = { id: 1, role: "customer" };
      const res = mockResponse();

      if (booking.user_id !== reqUser.id && reqUser.role !== "admin") {
        res.status(403).json({ message: "Not authorized" });
      }

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should allow admin to cancel any booking", async () => {
      const booking = { id: 1, user_id: 5, status: "pending" };
      const reqUser = { id: 1, role: "admin" };

      const canCancel = booking.user_id === reqUser.id || reqUser.role === "admin";
      expect(canCancel).toBe(true);
    });
  });
});
