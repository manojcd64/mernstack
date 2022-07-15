const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = 3001;

//config
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connect to mongodb
mongoose.connect(
      'mongodb+srv://manojbp:7975536671@mernstack.dyure10.mongodb.net/mernstack?retryWrites=true&w=majority'
  );

//data schema
const itemSchema = {
      title: String,
      description: String,
};

//data model
const Item = mongoose.model("Item", itemSchema);

//read route
app.get("/items", (req, res) => {
      console.log('/items')
      Item.find()
            .then((items) => res.json(items))
            .catch((err) => res.status(400).json("Error: " + err));
});

//create route
app.post("/newitem", (req, res) => {
      console.log(req.body);

      const newItem = new Item({
            title: req.body.title,
            description: req.body.description,
      });

      newItem
            .save()
            .then((item) => { console.log(item); res.status(201).json(item) })
            .catch((err) => res.status(400).json("Error " + err));
});

//delete route
app.delete("/delete/:id", (req, res) => {
      const id = req.params.id;

      Item.findByIdAndDelete({ _id: id }, (err, docs) => {
            if (!err) {
                  console.log("Item deleted");
                  res.status(200).json(docs);
            } else {
                  console.log(err);
                  res.status(400).json(err.message);
            }
      });
});

//update route
app.put("/put/:id", (req, res) => {
      const updatedItem = {
            title: req.body.title,
            description: req.body.description,
      };

      Item.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: updatedItem },
            (err, docs2) => {
                  if (!err) {
                        console.log("Item updated");
                        res.status(200).json(docs2);
                        
                  } else {
                        console.log(err);
                        res.status(400).json(err.message);
                  }
            }
      );
});

app.listen(port, function () {
      console.log("Express is running");
});