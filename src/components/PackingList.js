import React, { useState } from "react";
import Item from "./Item";

export default function PackingList({ items }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Item item={item} />
            </li>
        ))}
      </ul>
    </div>
  );
}