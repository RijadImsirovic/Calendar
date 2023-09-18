// src/components/ConnectionsList.js

import React from "react";

function ConnectionsList() {
  // Replace this with your actual list of connections data
  const connections = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
  ];

  return (
    <div>
      {connections.map((connection) => (
        <div key={connection.id}>{connection.name}</div>
      ))}
    </div>
  );
}

export default ConnectionsList;