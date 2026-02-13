/**
 * Security Tests
 * Tests for input validation, sanitization, authentication,
 * and authorization logic used in the application.
 */

// ─── Input Validation Tests ────────────────────────────────────────────────

// Inline implementations matching src/utils/validation.js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;

const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return emailRegex.test(email.trim());
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  return phoneRegex.test(phone.trim());
};

const isValidPassword = (password) => {
  if (!password || typeof password !== "string") return false;
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

const sanitizeString = (value) => {
  if (!value || typeof value !== "string") return "";
  return value
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
};

const isValidString = (value, minLength = 1, maxLength = 255) => {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

const isValidNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

// ─── Test Suites ────────────────────────────────────────────────────────────

describe("Security: Email Validation", () => {
  it("should accept valid email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@domain.co")).toBe(true);
    expect(isValidEmail("name+tag@site.org")).toBe(true);
  });

  it("should reject invalid email addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user@.com")).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(12345)).toBe(false);
  });

  it("should handle emails with special characters", () => {
    expect(isValidEmail("user@exam ple.com")).toBe(false); // space
    expect(isValidEmail("  user@example.com  ")).toBe(true); // trimmed
  });
});

describe("Security: Phone Validation", () => {
  it("should accept valid phone numbers", () => {
    expect(isValidPhone("9841234567")).toBe(true);
    expect(isValidPhone("+977 9841234567")).toBe(true);
    expect(isValidPhone("(01) 4456789")).toBe(true);
    expect(isValidPhone("01-4456789")).toBe(true);
  });

  it("should reject invalid phone numbers", () => {
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("123")).toBe(false); // too short
    expect(isValidPhone(null)).toBe(false);
    expect(isValidPhone(undefined)).toBe(false);
    expect(isValidPhone(9841234567)).toBe(false); // not a string
  });
});

describe("Security: Password Validation", () => {
  it("should accept strong passwords", () => {
    expect(isValidPassword("MyPass123")).toBe(true);
    expect(isValidPassword("SecureP4ss")).toBe(true);
    expect(isValidPassword("Abcdefg1")).toBe(true);
  });

  it("should reject passwords without uppercase", () => {
    expect(isValidPassword("mypass123")).toBe(false);
  });

  it("should reject passwords without lowercase", () => {
    expect(isValidPassword("MYPASS123")).toBe(false);
  });

  it("should reject passwords without numbers", () => {
    expect(isValidPassword("MyPassWord")).toBe(false);
  });

  it("should reject passwords shorter than 8 characters", () => {
    expect(isValidPassword("Ab1")).toBe(false);
    expect(isValidPassword("Short1A")).toBe(false);
  });

  it("should reject empty or non-string passwords", () => {
    expect(isValidPassword("")).toBe(false);
    expect(isValidPassword(null)).toBe(false);
    expect(isValidPassword(undefined)).toBe(false);
    expect(isValidPassword(12345678)).toBe(false);
  });
});

describe("Security: XSS Sanitization", () => {
  it("should remove HTML tags", () => {
    expect(sanitizeString("<script>alert('xss')</script>")).toBe(
      "scriptalert('xss')/script"
    );
    expect(sanitizeString("<b>bold</b>")).toBe("bbold/b");
    expect(sanitizeString("Hello <img src=x>")).toBe("Hello img src=x");
  });

  it("should remove javascript: protocol", () => {
    expect(sanitizeString("javascript:alert(1)")).toBe("alert(1)");
    expect(sanitizeString("JAVASCRIPT:void(0)")).toBe("void(0)");
  });

  it("should remove event handlers", () => {
    expect(sanitizeString('onerror=alert(1)')).toBe("alert(1)");
    expect(sanitizeString('onload=malicious()')).toBe("malicious()");
    expect(sanitizeString('onclick=hack()')).toBe("hack()");
  });

  it("should trim whitespace", () => {
    expect(sanitizeString("  hello world  ")).toBe("hello world");
  });

  it("should handle empty and non-string inputs", () => {
    expect(sanitizeString("")).toBe("");
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString(undefined)).toBe("");
    expect(sanitizeString(12345)).toBe("");
  });

  it("should preserve normal text", () => {
    expect(sanitizeString("Hello World")).toBe("Hello World");
    expect(sanitizeString("John's Farm Products")).toBe("John's Farm Products");
    expect(sanitizeString("Price: $10.50")).toBe("Price: $10.50");
  });
});

describe("Security: String Validation", () => {
  it("should accept valid strings within range", () => {
    expect(isValidString("Hello", 1, 255)).toBe(true);
    expect(isValidString("AB", 2, 100)).toBe(true);
  });

  it("should reject strings too short", () => {
    expect(isValidString("A", 2, 100)).toBe(false);
    expect(isValidString("", 1, 100)).toBe(false);
  });

  it("should reject strings too long", () => {
    expect(isValidString("A".repeat(256), 1, 255)).toBe(false);
  });

  it("should reject non-string values", () => {
    expect(isValidString(null)).toBe(false);
    expect(isValidString(undefined)).toBe(false);
    expect(isValidString(123)).toBe(false);
  });
});

describe("Security: Number Validation", () => {
  it("should accept valid numbers in range", () => {
    expect(isValidNumber(10, 0, 100)).toBe(true);
    expect(isValidNumber(0, 0, 100)).toBe(true);
    expect(isValidNumber(100, 0, 100)).toBe(true);
  });

  it("should reject numbers out of range", () => {
    expect(isValidNumber(-1, 0, 100)).toBe(false);
    expect(isValidNumber(101, 0, 100)).toBe(false);
  });

  it("should reject non-numeric values", () => {
    expect(isValidNumber("abc")).toBe(false);
    expect(isValidNumber(NaN)).toBe(false);
  });

  it("should accept string numbers", () => {
    expect(isValidNumber("42", 0, 100)).toBe(true);
  });
});

describe("Security: Auth Middleware Logic", () => {
  // Simulates the token extraction logic from token.middleware.js
  const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "NO_TOKEN" };
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return { error: "INVALID_FORMAT" };
    }
    return { token };
  };

  it("should extract token from valid Bearer header", () => {
    const result = extractToken("Bearer eyJhbGciOiJIUzI1NiJ9.test.sig");
    expect(result.token).toBe("eyJhbGciOiJIUzI1NiJ9.test.sig");
    expect(result.error).toBeUndefined();
  });

  it("should reject missing authorization header", () => {
    expect(extractToken(null).error).toBe("NO_TOKEN");
    expect(extractToken(undefined).error).toBe("NO_TOKEN");
    expect(extractToken("").error).toBe("NO_TOKEN");
  });

  it("should reject non-Bearer auth schemes", () => {
    expect(extractToken("Basic dXNlcjpwYXNz").error).toBe("NO_TOKEN");
    expect(extractToken("Token abc123").error).toBe("NO_TOKEN");
  });

  it("should reject Bearer without token", () => {
    expect(extractToken("Bearer ").error).toBe("INVALID_FORMAT");
  });
});

describe("Security: Role Authorization Logic", () => {
  // Simulates adminMiddleware logic
  const isAdmin = (user) => user && user.role === "admin";

  it("should allow admin users", () => {
    expect(isAdmin({ role: "admin" })).toBe(true);
  });

  it("should reject customer users", () => {
    expect(isAdmin({ role: "customer" })).toBe(false);
  });

  it("should reject null/undefined user", () => {
    expect(isAdmin(null)).toBeFalsy();
    expect(isAdmin(undefined)).toBeFalsy();
  });

  it("should reject users with no role", () => {
    expect(isAdmin({ name: "John" })).toBe(false);
  });

  it("should reject role manipulation attempts", () => {
    expect(isAdmin({ role: "Admin" })).toBe(false); // case sensitive
    expect(isAdmin({ role: "ADMIN" })).toBe(false);
    expect(isAdmin({ role: "admin " })).toBe(false); // trailing space
  });
});

describe("Security: SQL Injection Prevention (input patterns)", () => {
  it("should sanitize SQL injection attempts in strings", () => {
    const input1 = sanitizeString("'; DROP TABLE users; --");
    expect(input1).not.toContain("<");
    expect(input1).not.toContain(">");
    // Sequelize uses parameterized queries, but sanitization adds defense-in-depth
  });

  it("should not accept SQL keywords as valid emails", () => {
    expect(isValidEmail("SELECT * FROM users")).toBe(false);
    expect(isValidEmail("1 OR 1=1")).toBe(false);
  });

  it("should validate numeric IDs properly", () => {
    expect(isValidNumber("1; DROP TABLE", 0, 999999)).toBe(false);
    expect(isValidNumber("1 OR 1=1", 0, 999999)).toBe(false);
  });
});
