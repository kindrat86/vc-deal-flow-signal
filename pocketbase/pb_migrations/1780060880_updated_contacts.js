/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1100110000")

  // add field
  collection.fields.addAt(19, new Field({
    "hidden": false,
    "id": "bool2303465890",
    "name": "outreach",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1100110000")

  // remove field
  collection.fields.removeById("bool2303465890")

  return app.save(collection)
})
