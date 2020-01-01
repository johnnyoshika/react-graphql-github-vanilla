import React from 'react';

function Repository({ repository }) {
  return (
    <div>
      <p>
        <strong>In Repository:</strong>
        <a href={repository.url}>{repository.name}</a>
      </p>
    </div>
  );
}

export default Repository;