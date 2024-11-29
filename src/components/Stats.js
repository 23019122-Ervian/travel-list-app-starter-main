export default function Stats({ items }) {
    const packedItems = items.filter(item => item.packed).length;
    const totalItems = items.length;
    const packedPercentage = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);
  
    return (
      <footer className="stats">
        <em>You have {totalItems} items in the list. You already packed {packedItems} ({packedPercentage}%).</em>
        {packedPercentage === 0 && <p>Let's start packing!</p>}
        {packedPercentage > 0 && packedPercentage < 100 && <p>Keep going!</p>}
        {packedPercentage === 100 && <p>Well done! You are ready to go!</p>}
      </footer>
    );
  }