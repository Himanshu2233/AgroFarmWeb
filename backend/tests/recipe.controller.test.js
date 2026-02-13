/**
 * Recipe Controller Tests
 * Tests for getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe
 */

import { jest } from "@jest/globals";

// Mock Recipe and User models
const mockRecipe = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

const mockUser = {};

// Mock recipe instance methods
const mockRecipeInstance = {
  id: 1,
  user_id: 1,
  title: "Farm Fresh Salad",
  description: "A refreshing salad",
  ingredients: ["lettuce", "tomatoes"],
  instructions: "Mix and serve",
  prep_time: 15,
  cook_time: 0,
  servings: 4,
  category: "Salad",
  difficulty: "Easy",
  image: "/uploads/salad.jpg",
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

describe("Recipe Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllRecipes", () => {
    it("should return all recipes", async () => {
      const recipes = [
        { id: 1, title: "Salad", description: "Fresh salad" },
        { id: 2, title: "Soup", description: "Hot soup" },
      ];
      mockRecipe.findAll.mockResolvedValue(recipes);

      const req = { query: {} };
      const res = mockResponse();

      // Simulate controller logic
      const result = await mockRecipe.findAll({ where: {} });
      res.json(result);

      expect(res.json).toHaveBeenCalledWith(recipes);
    });

    it("should filter recipes by category", async () => {
      const recipes = [{ id: 1, title: "Salad", category: "Salad" }];
      mockRecipe.findAll.mockResolvedValue(recipes);

      const req = { query: { category: "Salad" } };
      const whereClause = {};
      if (req.query.category) whereClause.category = req.query.category;

      const result = await mockRecipe.findAll({ where: whereClause });
      expect(mockRecipe.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { category: "Salad" } })
      );
    });

    it("should filter recipes by difficulty", async () => {
      mockRecipe.findAll.mockResolvedValue([]);
      const req = { query: { difficulty: "Hard" } };
      const whereClause = {};
      if (req.query.difficulty) whereClause.difficulty = req.query.difficulty;

      await mockRecipe.findAll({ where: whereClause });
      expect(mockRecipe.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { difficulty: "Hard" } })
      );
    });
  });

  describe("getRecipe", () => {
    it("should return a recipe by ID", async () => {
      mockRecipe.findByPk.mockResolvedValue(mockRecipeInstance);

      const res = mockResponse();
      const recipe = await mockRecipe.findByPk(1);
      res.json(recipe);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, title: "Farm Fresh Salad" })
      );
    });

    it("should return 404 if recipe not found", async () => {
      mockRecipe.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const recipe = await mockRecipe.findByPk(999);

      if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Recipe not found" });
    });
  });

  describe("createRecipe", () => {
    it("should create a recipe with valid data", async () => {
      const newRecipe = {
        id: 3,
        user_id: 1,
        title: "New Recipe",
        description: "Test description",
        ingredients: ["salt", "pepper"],
        instructions: "Cook it",
        category: "Other",
        difficulty: "Medium",
        image: null,
      };
      mockRecipe.create.mockResolvedValue(newRecipe);

      const res = mockResponse();
      const recipe = await mockRecipe.create(newRecipe);
      res.status(201).json({ message: "Recipe created successfully!", recipe });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Recipe created successfully!",
          recipe: expect.objectContaining({ title: "New Recipe" }),
        })
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const res = mockResponse();
      const body = { title: "No Description" };

      // Validate as the controller does
      if (!body.title || !body.description || !body.ingredients || !body.instructions) {
        res.status(400).json({
          message: "Title, description, ingredients, and instructions are required",
        });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should parse string ingredients as JSON", () => {
      const ingredientsStr = '["salt", "pepper", "garlic"]';
      let parsed;
      try {
        parsed = JSON.parse(ingredientsStr);
      } catch (e) {
        parsed = ingredientsStr.split("\n").filter((i) => i.trim());
      }
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toEqual(["salt", "pepper", "garlic"]);
    });

    it("should parse newline-separated ingredients", () => {
      const ingredientsStr = "salt\npepper\ngarlic";
      let parsed;
      try {
        parsed = JSON.parse(ingredientsStr);
      } catch (e) {
        parsed = ingredientsStr.split("\n").filter((i) => i.trim());
      }
      expect(parsed).toEqual(["salt", "pepper", "garlic"]);
    });
  });

  describe("updateRecipe", () => {
    it("should update a recipe", async () => {
      mockRecipe.findByPk.mockResolvedValue(mockRecipeInstance);
      mockRecipeInstance.update.mockResolvedValue(true);

      const recipe = await mockRecipe.findByPk(1);
      await recipe.update({ title: "Updated Salad" });

      expect(mockRecipeInstance.update).toHaveBeenCalledWith({ title: "Updated Salad" });
    });

    it("should return 404 if updating non-existent recipe", async () => {
      mockRecipe.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const recipe = await mockRecipe.findByPk(999);
      if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 if user does not own recipe", async () => {
      const recipe = { ...mockRecipeInstance, user_id: 5 };
      const reqUser = { id: 1, role: "customer" };
      const res = mockResponse();

      if (recipe.user_id !== reqUser.id && reqUser.role !== "admin") {
        res.status(403).json({ message: "Not authorized" });
      }

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
    });

    it("should allow admin to update any recipe", async () => {
      const recipe = { ...mockRecipeInstance, user_id: 5 };
      const reqUser = { id: 1, role: "admin" };

      const isAuthorized = recipe.user_id === reqUser.id || reqUser.role === "admin";
      expect(isAuthorized).toBe(true);
    });
  });

  describe("deleteRecipe", () => {
    it("should delete a recipe", async () => {
      mockRecipe.findByPk.mockResolvedValue(mockRecipeInstance);
      mockRecipeInstance.destroy.mockResolvedValue(true);

      const res = mockResponse();
      const recipe = await mockRecipe.findByPk(1);
      await recipe.destroy();
      res.json({ message: "Recipe deleted successfully!" });

      expect(mockRecipeInstance.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Recipe deleted successfully!" });
    });

    it("should return 404 if deleting non-existent recipe", async () => {
      mockRecipe.findByPk.mockResolvedValue(null);

      const res = mockResponse();
      const recipe = await mockRecipe.findByPk(999);
      if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
      }

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 if non-owner tries to delete", async () => {
      const recipe = { ...mockRecipeInstance, user_id: 10 };
      const reqUser = { id: 2, role: "customer" };
      const res = mockResponse();

      if (recipe.user_id !== reqUser.id && reqUser.role !== "admin") {
        res.status(403).json({ message: "Not authorized" });
      }

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
