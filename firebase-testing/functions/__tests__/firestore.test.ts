import * as firebase from "@firebase/rules-unit-testing";
import * as fs from "fs";
import "jest";

let testEnv: firebase.RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await firebase.initializeTestEnvironment({
    projectId: "demo-test",
    firestore: {rules: fs.readFileSync("../firestore.rules", "utf8")},
  });
});

beforeEach(async () => await testEnv.clearFirestore());

afterAll(async () => await testEnv.cleanup());

test("messageの読み込みを実行", async () => {
    const db = testEnv.authenticatedContext("testUser").firestore();
    const message = db.collection("message").doc("testUser");
    await firebase.assertSucceeds(message.get());
});

test("messageへ書き込みを実行", async () => {
    const db = testEnv.authenticatedContext("testUser").firestore();
    const message = db.collection("message").doc("testUser");
    await firebase.assertSucceeds(message.set({ text: "test" }));
});
