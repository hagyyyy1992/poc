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

/**
 * セット出来ること
 */
test("SET - Authed", async () => {
  const db = testEnv.authenticatedContext("testUser").firestore();
  const message = db.collection("message").doc("testUser");
  await firebase.assertSucceeds(message.set({text: "test"}));
});

/**
 * セット出来ないこと
 */
test("SET - Not Authed", async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const message = db.collection("message").doc("testUser");
  await firebase.assertFails(message.set({text: "test"}));
});

/**
 * 更新出来ること
 */
test("UPDATE - Matched UserID", async () => {
  const db = testEnv.authenticatedContext("testUser").firestore();
  const message = db.collection("message").doc("testUser");
  await message.set({text: "test"});
  await firebase.assertSucceeds(message.update({text: "test2"}));
});

/**
 * 更新出来ないこと
 */
test("UPDATE - Unmatched UserID", async () => {
  // 他者のデータを登録
  const _db = testEnv.authenticatedContext("testUser2").firestore();
  const _message = _db.collection("message").doc("testUser2");
  await _message.set({text: "test"});
  const db = testEnv.authenticatedContext("testUser").firestore();
  const message = db.collection("message").doc("testUser2");
  await firebase.assertFails(message.update({text: "test"}));
});

/**
 * 削除出来ないこと
 */
test("DELETE - Authed", async () => {
  const db = testEnv.authenticatedContext("testUser").firestore();
  const message = db.collection("message").doc("testUser");
  await firebase.assertFails(message.delete());
});

/**
 * 削除出来ないこと
 */
test("DELETE - Not Authed", async () => {
  const _db = testEnv.authenticatedContext("testUser").firestore();
  const _message = _db.collection("message").doc("testUser");
  await _message.set({text: "test"});
  const db = testEnv.unauthenticatedContext().firestore();
  const message = db.collection("message").doc("testUser");
  await firebase.assertFails(message.delete());
});

/**
 * 1件取得出来ること
 */
test("GET - Authed", async () => {
  const db = testEnv.authenticatedContext("testUser").firestore();
  const message = db.collection("message").doc("testUser");
  await firebase.assertSucceeds(message.get());
});

/**
 * 1件取得出来ないこと
 */
test("GET - Not Authed", async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const message = db.collection("message").doc("testUser");
  await firebase.assertFails(message.get());
});

/**
 * 全件取得出来ること
 */
test("LIST - Authed", async () => {
  const db = testEnv.authenticatedContext("testUser").firestore();
  const message = db.collection("message").doc("testUser");
  await firebase.assertSucceeds(message.get());
});

/**
 * 全件取得出来ないこと
 */
test("LIST - Not Authed", async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const message = db.collection("message");
  await firebase.assertFails(message.get());
});
