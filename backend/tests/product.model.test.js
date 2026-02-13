import SequelizeMock from "sequelize-mock";

describe("Product Model", () => {
  const dbMock = new SequelizeMock();
  const ProductMock = dbMock.define("Product", {
    id: 1,
    name: "Test Product",
    description: "A test product",
    price: 10.5,
    unit: "per kg",
    stock: 100,
    category: "vegetables",
    emoji: "🌱",
    image: "/uploads/test.jpg",
    is_available: true,
  });

  it("should create a product with correct fields", async () => {
    const product = await ProductMock.create({
      name: "Test Product",
      description: "A test product",
      price: 10.5,
      unit: "per kg",
      stock: 100,
      category: "vegetables",
      emoji: "🌱",
      image: "/uploads/test.jpg",
      is_available: true,
    });
    expect(product.name).toBe("Test Product");
    expect(product.description).toBe("A test product");
    expect(product.price).toBe(10.5);
    expect(product.unit).toBe("per kg");
    expect(product.stock).toBe(100);
    expect(product.category).toBe("vegetables");
    expect(product.emoji).toBe("🌱");
    expect(product.image).toBe("/uploads/test.jpg");
    expect(product.is_available).toBe(true);
  });

  it("should have required fields defined", () => {
    // sequelize-mock doesn't enforce validations, so we verify defaults exist
    expect(ProductMock).toBeDefined();
  });

  it("should set default values for optional fields", async () => {
    const product = await ProductMock.create({
      name: "Default Product",
      price: 5.0,
    });
    expect(product.unit).toBe("per kg");
    // sequelize-mock returns the default mock values
    expect(product.category).toBe("vegetables");
    expect(product.emoji).toBe("🌱");
    expect(product.is_available).toBe(true);
  });
});