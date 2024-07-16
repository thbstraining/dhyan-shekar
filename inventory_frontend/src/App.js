import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000/api/clothingitems/';

function App() {
  const [clothingItems, setClothingItems] = useState([]);
  const [formData, setFormData] = useState({
    brand: '',
    size: '',
    color: '',
    price: '',
    quantity: '',
  });
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchClothingItems();
  }, []);

  const fetchClothingItems = () => {
    axios.get(API_URL)
      .then(response => {
        setClothingItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItemId) {
      axios.put(`${API_URL}${editItemId}/`, formData)
        .then(response => {
          console.log('Item updated successfully:', response.data);
          setEditItemId(null);
          setFormData({
            brand: '',
            size: '',
            color: '',
            price: '',
            quantity: '',
          });
          fetchClothingItems(); // Refresh the list after updating
        })
        .catch(error => {
          console.error('Error updating item: ', error);
        });
    } else {
      axios.post(API_URL, formData)
        .then(response => {
          console.log('Item added successfully:', response.data);
          setFormData({
            brand: '',
            size: '',
            color: '',
            price: '',
            quantity: '',
          });
          fetchClothingItems(); // Refresh the list after adding
        })
        .catch(error => {
          console.error('Error adding item: ', error);
        });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      brand: item.brand,
      size: item.size,
      color: item.color,
      price: item.price,
      quantity: item.quantity,
    });
    setEditItemId(item.id);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}${id}/`)
      .then(response => {
        console.log('Item deleted successfully:', response.data);
        fetchClothingItems(); // Refresh the list after deleting
      })
      .catch(error => {
        console.error('Error deleting item: ', error);
      });
  };

  return (
    <div className="container">
      <h1>Fashion Boutique Inventory Tracker</h1>

      {/* Form to Add or Edit Item */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required />
        <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="Size" required />
        <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color" required />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" step="0.01" required />
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required />
        <button type="submit">{editItemId ? 'Update Item' : 'Add Item'}</button>
      </form>

      {/* List of Items */}
      <div className="inventory-list">
        {clothingItems.map(item => (
          <div key={item.id} className="inventory-item">
            <p>{item.brand} - {item.color}</p>
            <p>Size: {item.size}, Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
