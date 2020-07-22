import { getFirstName, isValidPassword } from "../src/utils/user";

test("should return first name when give full name", () => {
  const firstName = getFirstName("Muhammad Ali");
  expect(firstName).toBe("Muhammad");
});

test("should return true if password length is 8 or not includes password", () => {
  const isValid = isValidPassword("hideit90");
  expect(isValid).toBeTruthy();
});

test("should rejected if password length is less than 8", () => {
  const isValid = isValidPassword("hideit");
  expect(isValid).toBeFalsy();
});

test("should rejected if password includes password", () => {
  const isValid = isValidPassword("hideit90password");
  expect(isValid).toBeFalsy();
});
