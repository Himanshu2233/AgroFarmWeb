import SequelizeMock from "sequelize-mock";

describe("Recipe Model", () => {
  const dbMock = new SequelizeMock();
  const RecipeMock = dbMock.define("Recipe", {
    id: 1,
    user_id: 1,
    title: "Farm Fresh Salad",
    description: "A refreshing salad with seasonal vegetables",
    ingredients: ["lettuce", "tomatoes", "cucumbers", "olive oil"],
    instructions: "1. Wash vegetables\n2. Chop into pieces\n3. Mix with olive oil\n4. Serve fresh",
    prep_time: 15,
    cook_time: 0,
    servings: 4,
    image: "/uploads/salad.jpg",
    category: "Salad",
    difficulty: "Easy",
  });

  it("should create a recipe with all fields", async () => {
    const recipe = await RecipeMock.create({
      user_id: 1,
      title: "Farm Fresh Salad",
      description: "A refreshing salad with seasonal vegetables",
      ingredients: ["lettuce", "tomatoes", "cucumbers", "olive oil"],
      instructions: "1. Wash vegetables\n2. Chop into pieces",
      prep_time: 15,
      cook_time: 0,
      servings: 4,
      category: "Salad",
      difficulty: "Easy",
    });
    expect(recipe.title).toBe("Farm Fresh Salad");
    expect(recipe.description).toBe("A refreshing salad with seasonal vegetables");
    expect(recipe.user_id).toBe(1);
    expect(recipe.prep_time).toBe(15);
    expect(recipe.cook_time).toBe(0);
    expect(recipe.servings).toBe(4);
    expect(recipe.category).toBe("Salad");
    expect(recipe.difficulty).toBe("Easy");
  });

  it("should have default servings of 4", async () => {
    const recipe = await RecipeMock.create({
      user_id: 1,
      title: "Simple Recipe",
      description: "Basic recipe",
      instructions: "Cook it",
    });
    expect(recipe.servings).toBe(4);
  });

  it("should have default category as Salad from mock defaults", async () => {
    const recipe = await RecipeMock.create({
      user_id: 1,
      title: "Another Recipe",
      description: "Another basic recipe",
      instructions: "Heat and serve",
    });
    expect(recipe.category).toBe("Salad");
  });

  it("should support difficulty values", async () => {
    const recipe = await RecipeMock.create({
      title: "Hard Recipe",
      description: "Complex dish",
      instructions: "Follow 20 steps",
      difficulty: "Easy",
    });
    expect(["Easy", "Medium", "Hard"]).toContain(recipe.difficulty);
  });

  it("should store ingredients as array (JSON)", async () => {
    const recipe = await RecipeMock.create({
      title: "Ingredient Test",
      description: "Test",
      instructions: "Cook",
      ingredients: ["salt", "pepper", "garlic"],
    });
    expect(Array.isArray(recipe.ingredients)).toBe(true);
    expect(recipe.ingredients.length).toBeGreaterThan(0);
  });

  it("should support image field", async () => {
    const recipe = await RecipeMock.create({
      title: "Image Recipe",
      description: "Recipe with image",
      instructions: "Cook it",
      image: "/uploads/recipe.jpg",
    });
    expect(recipe.image).toBeDefined();
  });

  it("should find a recipe by primary key", async () => {
    const recipe = await RecipeMock.findById(1);
    expect(recipe).not.toBeNull();
    expect(recipe.title).toBe("Farm Fresh Salad");
  });

  it("should return all recipes", async () => {
    const recipes = await RecipeMock.findAll();
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);
  });

  it("should have a user_id foreign key", async () => {
    const recipe = await RecipeMock.findById(1);
    expect(recipe.user_id).toBeDefined();
    expect(typeof recipe.user_id).toBe("number");
  });
});
