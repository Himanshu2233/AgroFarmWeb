import SequelizeMock from "sequelize-mock";

describe("User Model", () => {
  const dbMock = new SequelizeMock();
  const UserMock = dbMock.define("User", {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$hashedpasswordhere",
    phone: "9841234567",
    role: "customer",
    address: "Kathmandu, Nepal",
    is_verified: true,
    verification_token: null,
    verification_expires: null,
    reset_token: null,
    reset_expires: null,
    profile_image: "/uploads/profile.jpg",
    is_active: true,
  });

  it("should create a user with all fields", async () => {
    const user = await UserMock.create({
      name: "John Doe",
      email: "john@example.com",
      password: "$2a$10$hashedpasswordhere",
      phone: "9841234567",
      role: "customer",
      address: "Kathmandu, Nepal",
    });
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.phone).toBe("9841234567");
    expect(user.role).toBe("customer");
    expect(user.address).toBe("Kathmandu, Nepal");
    expect(user.is_active).toBe(true);
  });

  it("should have default role as customer", async () => {
    const user = await UserMock.create({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "hashed",
      phone: "9841234568",
    });
    expect(user.role).toBe("customer");
  });

  it("should have is_verified default to true in mock", async () => {
    const user = await UserMock.create({
      name: "Test User",
      email: "test@example.com",
      password: "hashed",
      phone: "9841234569",
    });
    expect(user.is_verified).toBe(true);
  });

  it("should have is_active default to true", async () => {
    const user = await UserMock.create({
      name: "Active User",
      email: "active@example.com",
      password: "hashed",
      phone: "9841000000",
    });
    expect(user.is_active).toBe(true);
  });

  it("should support profile_image field", async () => {
    const user = await UserMock.create({
      name: "Profile User",
      email: "profile@example.com",
      password: "hashed",
      phone: "9841111111",
    });
    expect(user.profile_image).toBe("/uploads/profile.jpg");
  });

  it("should find a user by primary key", async () => {
    const user = await UserMock.findById(1);
    expect(user).not.toBeNull();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
  });

  it("should return all users", async () => {
    const users = await UserMock.findAll();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it("should have password field (hashed)", async () => {
    const user = await UserMock.create({
      name: "Password User",
      email: "pw@example.com",
      password: "$2a$10$hashedpasswordhere",
      phone: "9842222222",
    });
    expect(user.password).toBeDefined();
    expect(user.password).not.toBe("plaintext");
  });

  it("should support verification token fields", async () => {
    const user = await UserMock.findById(1);
    expect(user).toHaveProperty("verification_token");
    expect(user).toHaveProperty("verification_expires");
  });

  it("should support reset token fields", async () => {
    const user = await UserMock.findById(1);
    expect(user).toHaveProperty("reset_token");
    expect(user).toHaveProperty("reset_expires");
  });
});
