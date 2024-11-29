export default function Item({ item, onRemove, onUpdateItem }) {
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