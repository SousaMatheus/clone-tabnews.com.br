import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const getDbVersion = await database.getDbVersion();
  const dbVersionValue = getDbVersion.rows[0].server_version;

  const maxConnectionsResult = await database.getMaxConnections();
  const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;

  var databaseName = process.env.POSTGRES_DB;
  const currentUsersDbResult =
    await database.getCurrentUsedConnections(databaseName);
  const currentUsersDbValue = currentUsersDbResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(maxConnectionsValue),
        current_used_connections: currentUsersDbValue,
      },
    },
  });
  await database.end;
}

export default status;
