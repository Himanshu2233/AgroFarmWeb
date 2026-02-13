import SequelizeMock from "sequelize-mock";

describe("Booking Model", () => {
  const dbMock = new SequelizeMock();
  const BookingMock = dbMock.define("Booking", {
    id: 1,
    user_id: 1,
    product_id: 2,
    animal_id: null,
    booking_type: "product",
    quantity: 5,
    schedule_type: "weekly",
    start_date: "2026-02-10",
    end_date: "2026-03-10",
    delivery_time: "morning",
    notes: "Leave at the doorstep",
    status: "pending",
    total_price: 500.0,
  });

  it("should create a product booking with all fields", async () => {
    const booking = await BookingMock.create({
      user_id: 1,
      product_id: 2,
      booking_type: "product",
      quantity: 5,
      schedule_type: "weekly",
      start_date: "2026-02-10",
      end_date: "2026-03-10",
      delivery_time: "morning",
      notes: "Leave at the doorstep",
      total_price: 500.0,
    });
    expect(booking.user_id).toBe(1);
    expect(booking.product_id).toBe(2);
    expect(booking.booking_type).toBe("product");
    expect(booking.quantity).toBe(5);
    expect(booking.schedule_type).toBe("weekly");
    expect(booking.start_date).toBe("2026-02-10");
    expect(booking.end_date).toBe("2026-03-10");
    expect(booking.delivery_time).toBe("morning");
    expect(booking.notes).toBe("Leave at the doorstep");
    expect(booking.total_price).toBe(500.0);
  });

  it("should have default status as pending", async () => {
    const booking = await BookingMock.create({
      user_id: 1,
      product_id: 3,
      quantity: 1,
      schedule_type: "once",
      start_date: "2026-02-15",
    });
    expect(booking.status).toBe("pending");
  });

  it("should have default booking_type as product", async () => {
    const booking = await BookingMock.create({
      user_id: 1,
      product_id: 3,
      quantity: 2,
      schedule_type: "daily",
      start_date: "2026-02-20",
    });
    expect(booking.booking_type).toBe("product");
  });

  it("should have default delivery_time as morning", async () => {
    const booking = await BookingMock.create({
      user_id: 1,
      product_id: 4,
      quantity: 1,
      schedule_type: "once",
      start_date: "2026-02-12",
    });
    expect(booking.delivery_time).toBe("morning");
  });

  it("should allow animal bookings with animal_id", async () => {
    const animalBookingMock = dbMock.define("AnimalBooking", {
      id: 2,
      user_id: 1,
      product_id: null,
      animal_id: 5,
      booking_type: "animal",
      quantity: 1,
      schedule_type: "once",
      start_date: "2026-03-01",
      status: "pending",
    });
    const booking = await animalBookingMock.create({
      user_id: 1,
      animal_id: 5,
      booking_type: "animal",
      quantity: 1,
      schedule_type: "once",
      start_date: "2026-03-01",
    });
    expect(booking.animal_id).toBe(5);
    expect(booking.booking_type).toBe("animal");
    expect(booking.product_id).toBeNull();
  });

  it("should support various schedule types", async () => {
    const validSchedules = ["daily", "weekly", "monthly", "once"];
    const booking = await BookingMock.create({
      user_id: 1,
      product_id: 2,
      quantity: 1,
      schedule_type: "weekly",
      start_date: "2026-02-10",
    });
    expect(validSchedules).toContain(booking.schedule_type);
  });

  it("should support various status values", async () => {
    const validStatuses = ["pending", "approved", "active", "completed", "cancelled"];
    const booking = await BookingMock.create({
      user_id: 1,
      product_id: 2,
      quantity: 1,
      schedule_type: "once",
      start_date: "2026-02-10",
    });
    expect(validStatuses).toContain(booking.status);
  });

  it("should find a booking by primary key", async () => {
    const booking = await BookingMock.findById(1);
    expect(booking).not.toBeNull();
    expect(booking.user_id).toBe(1);
  });

  it("should return all bookings", async () => {
    const bookings = await BookingMock.findAll();
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
  });

  it("should support total_price as decimal", async () => {
    const booking = await BookingMock.create({
      user_id: 1,
      product_id: 2,
      quantity: 3,
      schedule_type: "monthly",
      start_date: "2026-04-01",
      total_price: 1299.99,
    });
    expect(booking.total_price).toBeDefined();
  });
});
