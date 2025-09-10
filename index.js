const Surreal = require("surrealdb.js").default;

class FluidDB {
  constructor({ url = "http://127.0.0.1:8000/rpc", namespace = "test", database = "test" }) {
    this.db = new Surreal(url);

    this.ready = (async () => {
      await this.db.signin({ user: "root", pass: "root" });
      await this.db.use({ ns: namespace, db: database });
    })();

    return new Proxy(this, {
      get: (target, table) => {
        if (typeof table === "string") return target._tableProxy(table);

        return target[table];
      }
    });
  }

  _tableProxy(tableName) {
    const self = this;

    const getId = (key) => key.includes(':') ? key : `${tableName}:${key}`;

    return new Proxy(
      {},
      {
        get: (_, key) => {
          if (key === "push") return async (value) => {
            await self.ready;

            const result = await self.db.create(tableName, value);

            return result[0];
          };

          if (key === "filter") return async (filterObject) => {
            await self.ready;

            const conditions = Object.keys(filterObject).map((k) => `${k} = $${k}`).join(" AND ");

            const result = await self.db.query(
              `SELECT * FROM ${tableName} WHERE ${conditions}`,
              filterObject
            );

            return result[0].result;
          };

          return (async () => {
            await self.ready;

            const id = getId(key);
            const result = await self.db.select(id);

            return result || null;
          })();
        },

        set: async (_, key, value) => {
          await self.ready;

          const id = getId(key);
          const result = await self.db.upsert(id, value);

          return result;
        },

        deleteProperty: async (_, key) => {
          await self.ready;

          const id = getId(key);
          await self.db.delete(id);

          return true;
        }
      }
    );
  }
};

module.exports = FluidDB;