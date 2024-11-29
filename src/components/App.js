import React, { useState } from "react";
import {jsPDF} from "jspdf";
function Logo() {
  return <h1>My Travel List</h1>;
}

function Form({ onAddItem, onSortChange }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isCustom, setIsCustom] = useState(false); // State to track if custom input is shown
  const [sortBy, setSortBy] = useState("description");

  function handleSubmit(e) {
    e.preventDefault();
    const newItem = { id: Date.now(), description, quantity: parseInt(quantity, 10), packed: false };
    onAddItem(newItem);
    setDescription("");
    setQuantity(1);
    setIsCustom(false); // Reset custom state
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "Custom") {
      setIsCustom(true);
      setQuantity(""); // Clear quantity when custom is selected
    } else {
      setIsCustom(false);
      setQuantity(value);
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Sort by:</h3>
      <select value={sortBy} onChange={(e) => {
        setSortBy(e.target.value);
        onSortChange(e.target.value);
      }}>
        <option value="description">Description</option>
        <option value="quantity">Quantity</option>
      </select>
      <h3>What do you need to pack?</h3>
      <select value={quantity} onChange={handleQuantityChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="Custom">Custom</option>
      </select>
      {isCustom && (
        <input
          type="number"
          min="1"
          placeholder="Enter quantity..."
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      )}
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function PackingList({ items, onRemoveItem, onUpdateItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Item item={item} onRemove={onRemoveItem} onUpdateItem={onUpdateItem} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Item({ item, onRemove, onUpdateItem }) {
  const { description, quantity, packed } = item;
  return (
    <li style={{ textDecoration: packed ? "line-through" : "none" }}> 
      <input
        type="checkbox"
        checked={packed}
        onChange={(e) => onUpdateItem(item.id, e.target.checked)}
      />
      {quantity} x {description}
      <button onClick={() => onRemove(item.id)} style={{ marginLeft: '1rem', cursor: 'pointer' }}>
        ❌
      </button>
    </li>
  );
}

function Stats({ items, onClearAll, onCheckAll }) {
  const packedItems = items.filter(item => item.packed).length;
  const totalItems = items.length;
  const packedPercentage = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("My Travel List", 10, 10);
    items.forEach((item, index) => {
      doc.text(`${item.quantity} x ${item.description}`, 10, 20 + (index * 10));
    });
    doc.save("travel-list.pdf");
  };

  const handleShareLink = () => {
    const shareText = `Check out my travel list: ${items.map(item => `${item.quantity} x ${item.description}`).join(', ')}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Travel List',
        text: shareText,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  const handleEmailList = () => {
    const emailBody = `My Travel List:\n${items.map(item => `${item.quantity} x ${item.description}`).join('\n')}`;
    const mailtoLink = `mailto:?subject=My Travel List&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <footer className="stats">
      <em>You have {totalItems} items in the list. You already packed {packedItems} ({packedPercentage}%).</em>
      {packedPercentage === 0 && <p>Let's start packing!</p>}
      {packedPercentage > 0 && packedPercentage < 100 && <p>Keep going!</p>}
      {packedPercentage === 100 && <p>Well done! You are ready to go!</p>}
      <button onClick={onCheckAll} style={{ marginTop: '1rem', cursor: 'pointer' }}>
        Check All
      </button>
      <button onClick={onClearAll} style={{ marginTop: '1rem', marginLeft: '1rem', cursor: 'pointer' }}>
        Clear All
      </button>
      <button onClick={handleDownloadPDF} style={{ marginTop: '1rem', marginLeft: '1rem', cursor: 'pointer' }}>
        Download PDF
      </button>
      <button onClick={handleShareLink} style={{ marginTop: '1rem', marginLeft: '1rem', cursor: 'pointer' }}>
        Share Link
      </button>
      <button onClick={handleEmailList} style={{ marginTop: '1rem', marginLeft: '1rem', cursor: 'pointer' }}>
        Email List
      </button>
    </footer>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState("description"); // Default sort by description

  function handleAddItem(newItem) {
    setItems((prevItems) => [...prevItems, newItem]);
  }

  function handleRemoveItem(id) {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  }

  function handleUpdateItem(id, packed) {
    setItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, packed } : item
      )
    );
  }

  function handleSort() {
    const sortedItems = [...items].sort((a, b) => {
      if (sortBy === "description") {
        return a.description.localeCompare(b.description);
      } else {
        return a.quantity - b.quantity;
      }
    });
    setItems(sortedItems);
  }

  function handleSortChange(newSortBy) {
    setSortBy(newSortBy);
    handleSort();
  }

  function handleCheckAll() {
    const allPacked = items.every(item => item.packed);
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, packed: !allPacked }))
    );
  }

  function handleClearAll() {
    setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} onSortChange={handleSortChange} />
      <PackingList items={items} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} />
      <Stats items={items} onClearAll={handleClearAll} onCheckAll={handleCheckAll} />
    </div>
  );
}

export default App;