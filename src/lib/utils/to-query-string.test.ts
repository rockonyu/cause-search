import toQueryString from "./to-query-string";

describe("toQueryString 函式", () => {
  it("應該正確轉換包含有效鍵值的物件為查詢字串", () => {
    const input = { key1: "value1", key2: "value2" };
    const result = toQueryString(input);
    expect(result).toBe("?key1=value1&key2=value2");
  });

  it("應該忽略值為 null 的鍵值", () => {
    const input = { key1: "value1", key2: null };
    const result = toQueryString(input);
    expect(result).toBe("?key1=value1");
  });

  it("應該忽略值為 undefined 的鍵值", () => {
    const input = { key1: "value1", key2: undefined };
    const result = toQueryString(input);
    expect(result).toBe("?key1=value1");
  });

  it("應該忽略值為空字串的鍵值", () => {
    const input = { key1: "value1", key2: "" };
    const result = toQueryString(input);
    expect(result).toBe("?key1=value1");
  });

  it("當物件為空時應該返回空字串", () => {
    const input = {};
    const result = toQueryString(input);
    expect(result).toBe("");
  });

  it("應該正確處理只有一個有效鍵值的物件", () => {
    const input = { key1: "value1" };
    const result = toQueryString(input);
    expect(result).toBe("?key1=value1");
  });

  it("應該正確處理所有鍵值都為無效值的物件", () => {
    const input = { key1: null, key2: undefined, key3: "" };
    const result = toQueryString(input);
    expect(result).toBe("");
  });
});
