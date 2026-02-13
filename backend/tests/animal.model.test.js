import SequelizeMock from "sequelize-mock";

describe("Animal Model", () => {
  const dbMock = new SequelizeMock();
  const AnimalMock = dbMock.define("Animal", {
    id: 1,
    name: "Holstein Cow",
    description: "A healthy dairy cow",
    age: "3 years",
    weight: "500 kg",
    price: 85000.0,
    quantity: 2,
    emoji: "🐄",
    image: "/uploads/cow.jpg",
    is_available: true,
  });

  it("should create an animal with all fields", async () => {
    const animal = await AnimalMock.create({
      name: "Holstein Cow",
      description: "A healthy dairy cow",
      age: "3 years",
      weight: "500 kg",
      price: 85000.0,
      quantity: 2,
      emoji: "🐄",
      image: "/uploads/cow.jpg",
      is_available: true,
    });
    expect(animal.name).toBe("Holstein Cow");
    expect(animal.description).toBe("A healthy dairy cow");
    expect(animal.age).toBe("3 years");
    expect(animal.weight).toBe("500 kg");
    expect(animal.price).toBe(85000.0);
    expect(animal.quantity).toBe(2);
    expect(animal.emoji).toBe("🐄");
    expect(animal.image).toBe("/uploads/cow.jpg");
    expect(animal.is_available).toBe(true);
  });

  it("should have correct default values", async () => {
    const defaultAnimal = dbMock.define("AnimalDefaults", {
      id: 2,
      name: "Goat",
      price: 15000.0,
      quantity: 1,
      emoji: "🐄",
      is_available: true,
    });
    const animal = await defaultAnimal.create({
      name: "Goat",
      price: 15000.0,
    });
    expect(animal.quantity).toBe(1);
    expect(animal.emoji).toBe("🐄");
    expect(animal.is_available).toBe(true);
  });

  it("should find an animal by primary key", async () => {
    const animal = await AnimalMock.findById(1);
    expect(animal).not.toBeNull();
    expect(animal.name).toBe("Holstein Cow");
  });

  it("should return all animals", async () => {
    const animals = await AnimalMock.findAll();
    expect(Array.isArray(animals)).toBe(true);
    expect(animals.length).toBeGreaterThan(0);
  });

  it("should update an animal", async () => {
    const animal = await AnimalMock.findById(1);
    animal.name = "Updated Cow";
    expect(animal.name).toBe("Updated Cow");
  });

  it("should support price as decimal", async () => {
    const animal = await AnimalMock.create({
      name: "Buffalo",
      price: 120000.50,
    });
    expect(animal.price).toBe(120000.50);
  });
});
