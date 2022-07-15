import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  console.log("app comp redering")
  const [item, setItem] = useState({
    title: "",
    description: "",
  });

  const [items, setItems] = useState([
    {
      title: "",
      description: "",
      _id: "",
    },
  ]);

  const [isPut, setIsPut] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({
    title: "",
    description: "",
    id: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/items")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((jsonRes) => setItems(jsonRes))
      .catch((err) => console.log(err));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setItem((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  async function addItem(event) {
    event.preventDefault();


    const newItem = await axios.post("http://localhost:3001/newitem", {
      title: item.title,
      description: item.description
    });
    console.log(newItem);
    alert("item added");

    setItems((items) => {
      return [...items, newItem.data]
    })

    setItem({
      title: "",
      description: "",
    });

  }

  async function deleteItem(id) {
    try {
      await axios.delete("http://localhost:3001/delete/" + id);
      alert("item deleted");
      console.log(`Deleted item with id ${id}`);
      setItems((items) => {
        // console.log(items)
        return items.filter((item) => (item._id !== id))
      });

    } catch (err) {
      console.log(err.message);
    }


  }

  function openUpdate(id) {
    setIsPut(true);
    setUpdatedItem((prevInput) => {
      return {
        ...prevInput,
        id: id,
      };
    });
  }

  async function updateItem(id) {
    try {
      await axios.put("http://localhost:3001/put/" + id, updatedItem);
      alert("item updated");

      setItems((items) => {
        return items.map((item) => {
          if (item._id === id) {
            return {
              title: updatedItem.title, description: updatedItem.description, _id: updatedItem.id
            }
          }
        })
      }
      )
      console.log(`item with id ${id} updated`);
    }
    catch (err) {
      console.log(err.message);
    }
  }

  function handleUpdate(event) {
    const { name, value } = event.target;
    setUpdatedItem((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
    console.log(updatedItem);
  }

  return (
    <div className="App">
      {!isPut ? (
        <div className="main">
          <input
            onChange={handleChange}
            name="title"
            value={item.title}
            placeholder="Enter movie name"
          ></input>
          <input
            onChange={handleChange}
            name="description"
            value={item.description}
            placeholder="description"
          ></input>
          <button onClick={addItem}>ADD ITEM</button>
        </div>
      ) : (
        <div className="main">
          <input
            onChange={handleUpdate}
            name="title"
            value={updatedItem.title}
            placeholder="Enter the movie name you want to update"
          ></input>
          <input
            onChange={handleUpdate}
            name="description"
            value={updatedItem.description}
            placeholder="description"
          ></input>
          <button onClick={() => updateItem(updatedItem.id)}>
            UPDATE ITEM
          </button>
        </div>
      )}
      {items && items.map((item) => {
        return (
          <div
            key={item._id}
            style={{ background: "pink", width: "40%", margin: "auto auto" }}
          >
            <p>{item.title}</p>
            <p>{item.description}</p>
            <button onClick={() => deleteItem(item._id)}>DELETE</button>
            <button onClick={() => openUpdate(item._id)}>UPDATE</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;