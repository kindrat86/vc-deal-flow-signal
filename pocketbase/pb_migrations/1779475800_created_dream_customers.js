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
        "id": "text_name",
        "max": 200,
        "min": 1,
        "name": "name",
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
        "id": "text_handle",
        "max": 100,
        "min": 1,
        "name": "handle",
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
        "id": "text_firm",
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
        "id": "text_role",
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
        "exceptDomains": null,
        "hidden": false,
        "id": "url_url",
        "name": "url",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
        "hidden": false,
        "id": "select_segment",
        "maxSelect": 1,
        "name": "segment",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": ["A", "B", "D", "F"]
      },
      {
        "hidden": false,
        "id": "select_confidence",
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
        "id": "select_stage",
        "maxSelect": 1,
        "name": "stage",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "sourced",
          "followed",
          "engaged",
          "acknowledged",
          "outreach_sent",
          "in_conversation",
          "trial",
          "paying",
          "champion"
        ]
      },
      {
        "hidden": false,
        "id": "num_comment_count",
        "max": null,
        "min": 0,
        "name": "comment_count",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "convertURLs": false,
        "hidden": false,
        "id": "text_notes",
        "max": 2000,
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
        "id": "date_last_engaged_at",
        "max": "",
        "min": "",
        "name": "last_engaged_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "autodate_created",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate_updated",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_dream_customers",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_dream_customers_handle` ON `dream_customers` (`handle` COLLATE NOCASE)",
      "CREATE INDEX `idx_dream_customers_stage` ON `dream_customers` (`stage`)"
    ],
    "listRule": null,
    "name": "dream_customers",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_dream_customers");
  return app.delete(collection);
})
