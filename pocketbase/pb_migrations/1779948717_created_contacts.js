/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100110001",
        "max": 50,
        "min": 1,
        "name": "x_handle",
        "pattern": "",
        "presentable": true,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100110002",
        "max": 200,
        "min": 0,
        "name": "display_name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100110003",
        "max": 200,
        "min": 0,
        "name": "firm",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100110004",
        "max": 200,
        "min": 0,
        "name": "role",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select1100110005",
        "maxSelect": 1,
        "name": "segment",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": ["A", "B", "C", "D", "E", "F"]
      },
      {
        "hidden": false,
        "id": "select1100110006",
        "maxSelect": 1,
        "name": "confidence",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": ["HIGH", "MEDIUM", "LOW"]
      },
      {
        "hidden": false,
        "id": "select1100110007",
        "maxSelect": 1,
        "name": "stage",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": ["sourced", "following", "followers"]
      },
      {
        "hidden": false,
        "id": "bool1100110008",
        "name": "dream_customer",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "date1100110009",
        "max": "",
        "min": "",
        "name": "last_tweet_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100110010",
        "max": 1000,
        "min": 0,
        "name": "last_tweet_text",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "date1100110011",
        "max": "",
        "min": "",
        "name": "last_checked_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100110012",
        "max": 5000,
        "min": 0,
        "name": "notes",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate1100110013",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate1100110014",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_1100110000",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_contacts_x_handle` ON `contacts` (`x_handle`)",
      "CREATE INDEX `idx_contacts_stage` ON `contacts` (`stage`)",
      "CREATE INDEX `idx_contacts_dream` ON `contacts` (`dream_customer`)"
    ],
    "listRule": null,
    "name": "contacts",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1100110000");

  return app.delete(collection);
})
