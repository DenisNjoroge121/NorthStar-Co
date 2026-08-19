import React from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client/core';

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      sku
      name
      stockCount
    }
  }
`;

export default function App() {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Northstar Retail — Inventory Dashboard</h2>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Live inventory state via Webhook & GraphQL</p>
        </div>
        <button 
          onClick={() => refetch()}
          style={{ padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sync Data
        </button>
      </header>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '6px' }}>
          <p style={{ margin: 0, color: '#555' }}>Loading product inventory...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fce8e6', border: '1px solid #ea4335', borderRadius: '6px', color: '#c5221f' }}>
          <strong>Backend Error:</strong> Could not connect to Django GraphQL server.
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            Ensure your Django server is running at <code>http://127.0.0.1:8000/graphql/</code>. Details: {error.message}
          </p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {data.getProducts && data.getProducts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '6px' }}>
              <p style={{ margin: 0, color: '#666' }}>No products found in the database.</p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                Send a POST request to <code>http://127.0.0.1:8000/api/webhooks/inventory/</code> to add stock!
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc', background: '#f5f5f5' }}>
                  <th style={{ padding: '0.75rem' }}>SKU</th>
                  <th style={{ padding: '0.75rem' }}>Product Name</th>
                  <th style={{ padding: '0.75rem' }}>Stock Count</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.getProducts.map((product) => (
                  <tr key={product.id || product.sku} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{product.sku}</td>
                    <td style={{ padding: '0.75rem' }}>{product.name}</td>
                    <td style={{ padding: '0.75rem' }}>{product.stockCount}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        background: product.stockCount > 0 ? '#e6f4ea' : '#fce8e6',
                        color: product.stockCount > 0 ? '#137333' : '#c5221f'
                      }}>
                        {product.stockCount > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}