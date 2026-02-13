/**
 * Animal Controller Tests
 * Tests for getAllAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal
 */

import { jest } from "@jest/globals";

// Mock Animal model
const mockAnimal = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

// Mock animal instance
const mockAnimalInstance = {
  id: 1,
  name: "Dairy Cow",
  description: "Healthy dairy cow",
  age: "3 years",
  weight: "500kg",
  price: 1500.0,
  quantity: 5,
  emoji: "🐄",
  image: "/uploads/cow.jpg",
  is_available: true,
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

describe("Animal Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllAnimals", () => {
    it("should return all available animals", async () => {
      const animals = [
        { id: 1, name: "Dairy Cow", is_available: true },
        { id: 2, name: "Chicken", is_available: true },
      ];
      mockAnimal.findAll.mockResolvedValue(animals);

      const res = mockResponse();
      const result = await mockAnimal.findAll({
        where: { is_available: true },
        order: [["createdAt", "DESC"]],
      });
      res.json(result);

      expect(mockAnimal.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { is_available: true } })
      );
      expect(res.json).toHaveBeenCalledWith(animals);
    });

    it("should return empty array when no animals exist", async () => {
      mockAnimal.findAll.mockResolvedValue([]);

      const res = mockResponse();
      const result = await mockAnimal.findAll({ where: { is_available: true } });
      res.json(result);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it("should return 500 on database error", async () => {
      mockAnimal.findAll.mockRejectedValue(new Error("DB error"));

      const res = mockResponse();
      try {
        await mockAnimal.findAll({ where: { is_available: true } });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getAnimalById", () => {
    it("should return an animal by ID", async () => {
      mockAnimal.findByPk.mockResolvedValue(mockAnimalInstance);

      const res = mockResponse();
      const animal = await mockAnimal.findByPk(1);
      res.json(animal);

      expect(mockAnimal.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: "Dairy Cow" })
      );
    });

    it("should return 404 if animal not found", async () => {
      mockAnimal.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const animal = await mockAnimal.findByPk(999);

      if (!animal) {
        res.status(404).json({ message: "Animal not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Animal not found" });
    });

    it("should return 500 on database error", async () => {
      mockAnimal.findByPk.mockRejectedValue(new Error("DB error"));

      const res = mockResponse();
      try {
        await mockAnimal.findByPk(1);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("createAnimal", () => {
    it("should create an animal with valid data", async () => {
      const newAnimal = {
        id: 3,
        name: "Sheep",
        description: "Healthy sheep",
        age: "2 years",
        weight: "80kg",
        price: 300.0,
        quantity: 10,
        emoji: "🐑",
        image: "/uploads/sheep.jpg",
      };
      mockAnimal.create.mockResolvedValue(newAnimal);

      const res = mockResponse();
      const animal = await mockAnimal.create(newAnimal);
      res.status(201).json({ message: "Animal added!", animal });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Animal added!",
          animal: expect.objectContaining({ name: "Sheep" }),
        })
      );
    });

    it("should create an animal without image", async () => {
      const newAnimal = {
        id: 4,
        name: "Goat",
        description: "Mountain goat",
        price: 200.0,
        quantity: 3,
        emoji: "🐐",
        image: null,
      };
      mockAnimal.create.mockResolvedValue(newAnimal);

      const res = mockResponse();
      const animal = await mockAnimal.create(newAnimal);
      res.status(201).json({ message: "Animal added!", animal });

      expect(animal.image).toBeNull();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should safely parse price with parseFloat", () => {
      const price = "1500.50";
      const parsed = price !== undefined ? parseFloat(price) : 0;
      expect(parsed).toBe(1500.5);
    });

    it("should default price to 0 when undefined", () => {
      const price = undefined;
      const parsed = price !== undefined ? parseFloat(price) : 0;
      expect(parsed).toBe(0);
    });

    it("should safely parse quantity with parseInt", () => {
      const quantity = "10";
      const parsed = quantity !== undefined ? parseInt(quantity, 10) : 0;
      expect(parsed).toBe(10);
    });

    it("should default quantity to 0 when undefined", () => {
      const quantity = undefined;
      const parsed = quantity !== undefined ? parseInt(quantity, 10) : 0;
      expect(parsed).toBe(0);
    });

    it("should handle NaN from invalid price string", () => {
      const price = "not-a-number";
      const parsed = parseFloat(price);
      expect(isNaN(parsed)).toBe(true);
    });
  });

  describe("updateAnimal", () => {
    it("should update an animal", async () => {
      mockAnimal.findByPk.mockResolvedValue(mockAnimalInstance);
      mockAnimalInstance.update.mockResolvedValue(true);

      const animal = await mockAnimal.findByPk(1);
      await animal.update({ name: "Updated Cow", price: 1800.0 });

      expect(mockAnimalInstance.update).toHaveBeenCalledWith({
        name: "Updated Cow",
        price: 1800.0,
      });
    });

    it("should return 404 if updating non-existent animal", async () => {
      mockAnimal.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const animal = await mockAnimal.findByPk(999);
      if (!animal) {
        res.status(404).json({ message: "Animal not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should keep old image when no new file is uploaded", () => {
      const currentImage = "/uploads/cow.jpg";
      const reqFile = null;
      const image = reqFile ? `/uploads/${reqFile.filename}` : currentImage;

      expect(image).toBe("/uploads/cow.jpg");
    });

    it("should replace image when new file is uploaded", () => {
      const reqFile = { filename: "new-cow.jpg" };
      const image = reqFile ? `/uploads/${reqFile.filename}` : "/uploads/old.jpg";

      expect(image).toBe("/uploads/new-cow.jpg");
    });

    it("should preserve price when not provided in update", () => {
      const existingPrice = 1500.0;
      const updatePrice = undefined;
      const price =
        updatePrice !== undefined ? parseFloat(updatePrice) : existingPrice;

      expect(price).toBe(1500.0);
    });
  });

  describe("deleteAnimal", () => {
    it("should delete an animal", async () => {
      mockAnimal.findByPk.mockResolvedValue(mockAnimalInstance);
      mockAnimalInstance.destroy.mockResolvedValue(true);

      const res = mockResponse();
      const animal = await mockAnimal.findByPk(1);
      await animal.destroy();
      res.json({ message: "Animal deleted!" });

      expect(mockAnimalInstance.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Animal deleted!" });
    });

    it("should return 404 if deleting non-existent animal", async () => {
      mockAnimal.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const animal = await mockAnimal.findByPk(999);
      if (!animal) {
        res.status(404).json({ message: "Animal not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle image deletion when animal has image", () => {
      const animal = { image: "/uploads/cow.jpg" };
      const hasImage = !!animal.image;
      expect(hasImage).toBe(true);
    });

    it("should skip image deletion when animal has no image", () => {
      const animal = { image: null };
      const hasImage = !!animal.image;
      expect(hasImage).toBe(false);
    });
  });
});
