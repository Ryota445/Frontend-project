import React from 'react';
import ItemCardComponent from './ItemCardComponent';

function CardViewInventory(props) {
  const { data, onDeleteSuccess } = props;
  return (
    <div>
      {Array.isArray(data.data) && data.data.map((item, index) => (
        <ItemCardComponent key={index} data={item} onDeleteSuccess={onDeleteSuccess} />
      ))}
    </div>
  );
}


export default CardViewInventory;
