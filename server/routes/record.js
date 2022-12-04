const express = require("express");

/**
 * recordRoutes is an instance of the express router.
 * We use it to DEFINE our routes.
 * The router will be added as middleware and take control of requests starting
 * with the path "/record".
 */
const recordRoutes = express.Router();


const dbo = require("../db/conn");

/**
 * This helps conver the id from string to ObjectId (BSON format) for the _id 
 * aka Primary Key of the object between JS <-> MongoDB.
 */
const ObjectId = require("mongodb").ObjectId;

/**
 * The below section establishes routes and the assocaited request types 
 * that can hit them.
 * 
 * This one returns a list of all the records in the DB
 */
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    db_connect
        .collection("records")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        })
    
});

/**
 * This will accept a post request and extract the ID from the path, 
 * returning the single object associated with that id. 
 */
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {_id: ObjectId(req.params.id)};
    db_connect
        .collection("records")
        .findOne(myquery, function(err, result) {
            if (err) throw err;
            res.json(result);
        });
})

// Adds a new record 
recordRoutes.route("/record/add").post(function (err, res) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level
    };
    db_connect.collection("records").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    })
})

// This updates a record in the db by extracting id from the path
recordRoutes.route("/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    // grabbing pk from the path
    let myquery = { _id: ObjectId(req.params.id) };
    
    /**
     * The $set operator replaces the value of a field with 
     * the specified value.
     * If the field does not exist, $set will add a 
     * new field with the specified value
     */
    let newvalues = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    db_connect
      .collection("records")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
});

// This will delete a record by extracting the id from the path
recordRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      response.json(obj);
    });
});

/**
 * By exporting this encapsulated code using module.exports 
 * we can import it anywhere else in our application and use it.
 */
module.exports = recordRoutes;