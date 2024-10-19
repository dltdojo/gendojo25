import { describe, it , expect } from "testlib";
import { add } from "@/main.ts";

describe("add function", () => {
    it("adds two numbers correctly", () => {
      const result = add(2, 3);
      expect(result).toBe(5);
    });
  
    it("handles negative numbers", () => {
      const result = add(-2, -3);
      expect(result).toBe(-5);
    });
  });