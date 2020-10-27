const dbopr = require("./operations");
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const assert = require("assert");

const dbname = "conFusion";
mongoClient.connect(url).then((client) => {
    
        console.log("Connected to the database server!");
        const db = client.db(dbname);
    
        dbopr.insertDocument(db, { name: "Uthapizza", description: "Test" }, "dishes")
        .then((result) => {
          console.log("Inserted document:\n ", result.ops);
    
          return dbopr.findDocuments(db, "dishes")
        })
        .then((docs) => {
          console.log("Found Documents:\n", docs);
    
          return dbopr.updateDocument(db, { name: "Uthapizza" }, { description: "updated test" }, "dishes")
        })
        .then((result) => {
          console.log("Updated Document:\n ", result.result);
    
          return dbopr.findDocuments(db, "dishes")
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);
    
            return db.dropCollection("dishes")
        })
        .then((result) => {
          console.log("Dropped the collection:\n", result);
          client.close();
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
    