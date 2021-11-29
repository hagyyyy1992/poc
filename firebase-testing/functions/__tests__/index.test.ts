import * as http from "../src/index";

describe("helloWorld", () => {
  test("it returns a successful response", () => {
    const req:any = {};
    const res:any = {
      send: (payload: string) => {
        expect(payload).toBe("Hello from Firebase!");
      },
    };

    http.helloWorld(req, res);
  });
});
