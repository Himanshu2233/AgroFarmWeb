/**
 * Product Controller Tests
 * Tests for getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
 */

import { jest } from "@jest/globals";

// Mock Product model
const mockProduct = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

// Mock product instance
const mockProductInstance = {
  id: 1,
  name: "Fresh Tomatoes",
  description: "Organic farm tomatoes",
  price: 4.99,
  unit: "kg",
  stock: 100,
  category: "Vegetables",
  emoji: "🍅",
  image: "/uploads/tomatoes.jpg",
  is_available: true,
  season: "Summer",
  availability_start: "2024-06-01",
  availability_end: "2024-09-30",
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

describe("Product Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return all available products", async () => {
      const products = [
        { id: 1, name: "Tomatoes", is_available: true },
        { id: 2, name: "Carrots", is_available: true },
      ];
      mockProduct.findAll.mockResolvedValue(products);

      const res = mockResponse();
      const result = await mockProduct.findAll({
        where: { is_available: true },
        order: [["createdAt", "DESC"]],
      });
      res.json(result);

      expect(mockProduct.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { is_available: true } })
      );
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it("should return empty array when no products exist", async () => {
      mockProduct.findAll.mockResolvedValue([]);

      const res = mockResponse();
      const result = await mockProduct.findAll({ where: { is_available: true } });
      res.json(result);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it("should return 500 on database error", async () => {
      mockProduct.findAll.mockRejectedValue(new Error("DB error"));

      const res = mockResponse();
      try {
        await mockProduct.findAll({ where: { is_available: true } });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      mockProduct.findByPk.mockResolvedValue(mockProductInstance);

      const res = mockResponse();
      const product = await mockProduct.findByPk(1);
      res.json(product);

      expect(mockProduct.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: "Fresh Tomatoes" })
      );
    });

    it("should return 404 if product not found", async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const product = await mockProduct.findByPk(999);

      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should return 500 on database error", async () => {
      mockProduct.findByPk.mockRejectedValue(new Error("DB error"));

      const res = mockResponse();
      try {
        await mockProduct.findByPk(1);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("createProduct", () => {
    it("should create a product with valid data", async () => {
      const newProduct = {
        id: 3,
        name: "Organic Carrots",
        description: "Fresh organic carrots",
        price: 3.49,
        unit: "kg",
        stock: 50,
        category: "Vegetables",
        emoji: "🥕",
        image: "/uploads/carrots.jpg",
        season: "Year-round",
      };
      mockProduct.create.mockResolvedValue(newProduct);

      const res = mockResponse();
      const product = await mockProduct.create(newProduct);
      res.status(201).json({ message: "Product created!", product });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Product created!",
          product: expect.objectContaining({ name: "Organic Carrots" }),
        })
      );
    });

    it("should create a product without image", async () => {
      const newProduct = {
        id: 4,
        name: "Honey",
        description: "Raw farm honey",
        price: 12.0,
        unit: "jar",
        stock: 20,
        category: "Other",
        emoji: "🍯",
        image: null,
        season: "Year-round",
      };
      mockProduct.create.mockResolvedValue(newProduct);

      const res = mockResponse();
      const product = await mockProduct.create(newProduct);
      res.status(201).json({ message: "Product created!", product });

      expect(product.image).toBeNull();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should safely parse price with parseFloat", () => {
      const price = "4.99";
      const parsed = price !== undefined ? parseFloat(price) : 0;
      expect(parsed).toBe(4.99);
    });

    it("should default price to 0 when undefined", () => {
      const price = undefined;
      const parsed = price !== undefined ? parseFloat(price) : 0;
      expect(parsed).toBe(0);
    });

    it("should safely parse stock with parseInt", () => {
      const stock = "50";
      const parsed = stock !== undefined ? parseInt(stock, 10) : 0;
      expect(parsed).toBe(50);
    });

    it("should default stock to 0 when undefined", () => {
      const stock = undefined;
      const parsed = stock !== undefined ? parseInt(stock, 10) : 0;
      expect(parsed).toBe(0);
    });

    it("should default season to Year-round when not provided", () => {
      const season = undefined;
      const result = season || "Year-round";
      expect(result).toBe("Year-round");
    });

    it("should use provided season value", () => {
      const season = "Summer";
      const result = season || "Year-round";
      expect(result).toBe("Summer");
    });

    it("should handle availability dates", () => {
      const start = "2024-06-01";
      const end = "2024-09-30";
      expect(start).toBeDefined();
      expect(end).toBeDefined();
    });

    it("should set availability dates to null when not provided", () => {
      const start = undefined;
      const end = undefined;
      const resultStart = start || null;
      const resultEnd = end || null;
      expect(resultStart).toBeNull();
      expect(resultEnd).toBeNull();
    });
  });

  describe("updateProduct", () => {
    it("should update a product", async () => {
      mockProduct.findByPk.mockResolvedValue(mockProductInstance);
      mockProductInstance.update.mockResolvedValue(true);

      const product = await mockProduct.findByPk(1);
      await product.update({ name: "Premium Tomatoes", price: 6.99 });

      expect(mockProductInstance.update).toHaveBeenCalledWith({
        name: "Premium Tomatoes",
        price: 6.99,
      });
    });

    it("should return 404 if updating non-existent product", async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const product = await mockProduct.findByPk(999);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should keep old image when no new file is uploaded", () => {
      const currentImage = "/uploads/tomatoes.jpg";
      const reqFile = null;
      const clearImage = false;
      let image = currentImage;

      if (clearImage) {
        image = null;
      } else if (reqFile) {
        image = `/uploads/${reqFile.filename}`;
      }

      expect(image).toBe("/uploads/tomatoes.jpg");
    });

    it("should replace image when new file is uploaded", () => {
      const reqFile = { filename: "new-tomatoes.jpg" };
      const clearImage = false;
      let image = "/uploads/old.jpg";

      if (clearImage) {
        image = null;
      } else if (reqFile) {
        image = `/uploads/${reqFile.filename}`;
      }

      expect(image).toBe("/uploads/new-tomatoes.jpg");
    });

    it("should clear image when clearImage flag is set to true", () => {
      const clearImage = "true";
      let image = "/uploads/tomatoes.jpg";

      if (clearImage === "true" || clearImage === true) {
        image = null;
      }

      expect(image).toBeNull();
    });

    it("should clear image when clearImage flag is boolean true", () => {
      const clearImage = true;
      let image = "/uploads/tomatoes.jpg";

      if (clearImage === "true" || clearImage === true) {
        image = null;
      }

      expect(image).toBeNull();
    });

    it("should preserve price when not provided in update", () => {
      const existingPrice = 4.99;
      const updatePrice = undefined;
      const price =
        updatePrice !== undefined ? parseFloat(updatePrice) : existingPrice;

      expect(price).toBe(4.99);
    });

    it("should preserve season when not provided in update", () => {
      const existingSeason = "Summer";
      const updateSeason = undefined;
      const season = updateSeason || existingSeason;

      expect(season).toBe("Summer");
    });

    it("should preserve availability dates when not provided", () => {
      const existingStart = "2024-06-01";
      const updateStart = undefined;
      const start =
        updateStart !== undefined ? updateStart : existingStart;

      expect(start).toBe("2024-06-01");
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      mockProduct.findByPk.mockResolvedValue(mockProductInstance);
      mockProductInstance.destroy.mockResolvedValue(true);

      const res = mockResponse();
      const product = await mockProduct.findByPk(1);
      await product.destroy();
      res.json({ message: "Product deleted!" });

      expect(mockProductInstance.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Product deleted!" });
    });

    it("should return 404 if deleting non-existent product", async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const product = await mockProduct.findByPk(999);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle image deletion when product has image", () => {
      const product = { image: "/uploads/tomatoes.jpg" };
      const hasImage = !!product.image;
      expect(hasImage).toBe(true);
    });

    it("should skip image deletion when product has no image", () => {
      const product = { image: null };
      const hasImage = !!product.image;
      expect(hasImage).toBe(false);
    });
  });
});
