import database from "infra/database";

beforeAll(CleanDatabase);

async function CleanDatabase() {
  await database.query("Drop schema public cascade; Create schema public;");
}

test("GET to api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
