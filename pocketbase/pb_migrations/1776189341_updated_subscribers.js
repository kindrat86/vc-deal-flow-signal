/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3745265112")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX idx_subscribers_email ON subscribers (email)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "email3885137012",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 200,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select614373258",
    "maxSelect": 0,
    "name": "tier",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "free",
      "dashboard",
      "insider"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1888339527",
    "max": 100,
    "min": 0,
    "name": "stripe_customer_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 0,
    "name": "status",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "churned",
      "paused"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "json3046377112",
    "maxSize": 0,
    "name": "sectors",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1602912115",
    "max": 100,
    "min": 0,
    "name": "source",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3745265112")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  // remove field
  collection.fields.removeById("email3885137012")

  // remove field
  collection.fields.removeById("text1579384326")

  // remove field
  collection.fields.removeById("select614373258")

  // remove field
  collection.fields.removeById("text1888339527")

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("json3046377112")

  // remove field
  collection.fields.removeById("text1602912115")

  return app.save(collection)
})
