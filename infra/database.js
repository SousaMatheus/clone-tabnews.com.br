import { Client } from "pg";

async function query(queryObj) {
  let client = await getNewClient();
  try {
    const result = await client.query(queryObj);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: GetSSLValue(),
  });
  await client.connect();
  return client;
}

async function getDbVersion() {
  return query("SHOW server_version;");
}

async function getMaxConnections() {
  return query("SHOW MAX_CONNECTIONS;");
}
async function getCurrentUsedConnections(databaseName) {
  return query({
    text: "SELECT COUNT(*) ::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
}
export default {
  query,
  getDbVersion,
  getMaxConnections,
  getCurrentUsedConnections,
  getNewClient,
};

function GetSSLValue() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
