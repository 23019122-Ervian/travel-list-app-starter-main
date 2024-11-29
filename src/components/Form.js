import React, { useState } from "react";

export default function Form({ onAddItem, checkAll, items = [] }) {
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(1);
    const allPacked = items.length > 0 && items.every(item => item.packed);
    function handleSubmit(e) {
      e.preventDefault();
      const newItem = { id: Date.now(), description, quantity, packed: false };
      onAddItem(newItem);
      setDescription("");
      setQuantity(1);
    }
  
    return (
      <form className="add-form" onSubmit={handleSubmit}>
        <h3>What do you need to pack?</h3>
  
        <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
  
        <input
          type="text"
          placeholder="Item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
        <button onClick={() => checkAll(!allPacked)}>
                {allPacked ? "Uncheck All" : "Check All"}
        </button>
      </form>
    );
  }