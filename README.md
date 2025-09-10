# FluidDB

**FluidDB** is a minimalist, Proxy-based ORM for [SurrealDB](https://surrealdb.com).
It gives you a natural, object-like API for interacting with tables and records — inspired by [SyncStore](https://npmjs.com/package/syncstore.json) but backed by a real database.

---

## 🚀 Features

* 🔁 **Push syntax**: `db.users.push({...})` to insert records
* 🔑 **Direct access by ID**: `await db.users[id]`
* 🧩 **Filter queries**: `await db.users.filter({ active: true })`
* 🗑 **Delete syntax**: `delete db.users[id]`
* ⚡ **Auto-upsert**: `db.users[id] = {...}` updates or creates a record
* 🧩 **Schema-less by default** — but supports SurrealDB schemas

---

## 📦 Installation

```bash
npm install fluid.db
```

Requires a running [SurrealDB server](https://surrealdb.com/docs/start).

---

## 🛠️ Usage

```js
const FluidDB = require("fluid.db");

(async () => {
  const db = new FluidDB({
    url: "http://127.0.0.1:8000/rpc",
    namespace: "test",
    database: "test",
  });

  // Insert records
  const alice = await db.users.push({ name: "Alice", age: 25, active: true });
  const bob   = await db.users.push({ name: "Bob", age: 30, active: false });

  console.log(alice);
  // { id: "users:xyz123", name: "Alice", age: 25, active: true }

  // Fetch by ID
  console.log(await db.users[alice.id]);

  // Filter
  console.log(await db.users.filter({ active: true }));

  // Update (upsert)
  await (db.users[alice.id] = { ...alice, active: false });

  // Delete
  await delete db.users[alice.id];
})();
```

---

## 📁 Example Data in SurrealDB

After the example above, your `users` table will look like:

| id             | name  | age | active |
| -------------- | ----- | --- | ------ |
| `users:xyz123` | Alice | 25  | false  |
| `users:abc456` | Bob   | 30  | false  |

---

## ✅ Use Cases

* Quick prototypes with SurrealDB
* Local tools needing a super simple ORM
* Teaching / demos of SurrealDB
* Anywhere you want object-like DB access without writing SQL

---

## ⚠️ Notes

* By default SurrealDB is **schemaless** — you can push extra props and they’ll be stored.
* If you want strict schemas, define them in SurrealDB with `DEFINE TABLE ... SCHEMAFULL`.

---

## 📜 License

MIT © DinoscapeProgramming