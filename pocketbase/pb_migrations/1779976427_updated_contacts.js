/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1100110000")

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "bool910862019",
    "name": "follows_me",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "bool2800556148",
    "name": "i_follow",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1861502291",
    "max": 50,
    "min": 0,
    "name": "discovered_via",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "date2222528879",
    "max": "",
    "min": "",
    "name": "last_follow_check_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1100110000")

  // remove field
  collection.fields.removeById("bool910862019")

  // remove field
  collection.fields.removeById("bool2800556148")

  // remove field
  collection.fields.removeById("text1861502291")

  // remove field
  collection.fields.removeById("date2222528879")

  return app.save(collection)
})
