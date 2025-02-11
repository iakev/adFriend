// src/tests/Simple.test.jsx
import { describe, expect, test } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

function SimpleComponent() {
  return <div>Hello</div>;
}

describe('Simple', () => {
  test('renders', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});