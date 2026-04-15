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
        "id": "text2324736937",
        "max": 50,
        "min": 0,
        "name": "key",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
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
      },
      {
        "hidden": false,
        "id": "number3852478864",
        "max": null,
        "min": null,
        "name": "day",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4224597626",
        "max": 300,
        "min": 0,
        "name": "subject",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "editor1308443783",
        "maxSize": 0,
        "name": "body_html",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "editor"
      }
    ],
    "id": "pbc_3601318437",
    "indexes": [
      "CREATE UNIQUE INDEX idx_seq_key ON email_sequences (key)"
    ],
    "listRule": null,
    "name": "email_sequences",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3601318437");

  return app.delete(collection);
})
