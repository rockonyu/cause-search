/**
 * @jest-environment node
 */

import { fetchOrganizations } from "@/lib/db";
import express from "express";
import request from "supertest";
import router from "./organizations";

jest.mock("@/lib/db", () => ({
  fetchOrganizations: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/organizations", router);

describe("GET /api/organizations", () => {
  it("應該正確返回組織資料", async () => {
    (fetchOrganizations as jest.Mock).mockResolvedValue([
      { id: 1, name: "Organization A", createdAt: new Date("2023-01-01") },
      { id: 2, name: "Organization B", createdAt: new Date("2023-01-02") },
    ]);

    const response = await request(app).get("/api/organizations").query({
      "created-at": "2023-01-01",
      q: "A",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          name: "Organization A",
          createdAt: "2023-01-01T00:00:00.000Z",
        },
        {
          id: 2,
          name: "Organization B",
          createdAt: "2023-01-02T00:00:00.000Z",
        },
      ],
      nextCursor: null,
    });

    expect(fetchOrganizations).toHaveBeenCalledWith({
      limit: 11,
      cursor: new Date("2023-01-01"),
      keyword: "A",
    });
  });

  it("應該正確處理沒有資料的情況", async () => {
    (fetchOrganizations as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get("/api/organizations");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [], nextCursor: null });
  });

  it("應該在發生錯誤時記錄並回應空資料", async () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (fetchOrganizations as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app).get("/api/organizations");

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [], nextCursor: null });

    consoleErrorMock.mockRestore();
  });
});
