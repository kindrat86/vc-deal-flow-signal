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
        "cascadeDelete": true,
        "collectionId": "pbc_1100110000",
        "hidden": false,
        "id": "relation1100120001",
        "maxSelect": 1,
        "minSelect": 1,
        "name": "contact",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "select1100120002",
        "maxSelect": 1,
        "name": "direction",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": ["outbound", "inbound"]
      },
      {
        "hidden": false,
        "id": "select1100120003",
        "maxSelect": 1,
        "name": "type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": ["like", "reply", "repost", "quote"]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100120004",
        "max": 30,
        "min": 1,
        "name": "tweet_id",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1100120005",
        "max": 500,
        "min": 0,
        "name": "tweet_url",
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
        "id": "text1100120006",
        "max": 1000,
        "min": 0,
        "name": "tweet_excerpt",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "date1100120007",
        "max": "",
        "min": "",
        "name": "occurred_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "number1100120008",
        "max": null,
        "min": null,
        "name": "score_weight",
        "onlyInt": true,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "autodate1100120009",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate1100120010",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_1100120000",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_engagement_unique` ON `engagement_events` (`contact`, `direction`, `type`, `tweet_id`)",
      "CREATE INDEX `idx_engagement_contact` ON `engagement_events` (`contact`)",
      "CREATE INDEX `idx_engagement_occurred` ON `engagement_events` (`occurred_at`)"
    ],
    "listRule": null,
    "name": "engagement_events",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1100120000");

  return app.delete(collection);
})
