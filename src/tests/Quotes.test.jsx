// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import MotivationalQuoteWidget from '../components/QuoteWidget.jsx';

// Mock fetch globally
global.fetch = jest.fn();

describe('MotivationalQuoteWidget', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('shows loading state initially', () => {
    render(<MotivationalQuoteWidget />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays quote and author when fetch succeeds', async () => {
    const mockQuote = {
      content: 'Test quote',
      author: 'Test author'
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockQuote)
      })
    );

    render(<MotivationalQuoteWidget />);

    await waitFor(() => {
      expect(screen.getByTestId('quote-text')).toHaveTextContent('Test quote');
      expect(screen.getByTestId('quote-author')).toHaveTextContent('Test author');
    });
  });

  it('shows error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    render(<MotivationalQuoteWidget />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('can manually update quote state for testing', async () => {
    render(<MotivationalQuoteWidget />);
    
    await act(async () => {
      window._testHelpers.setQuoteState('New test quote');
      window._testHelpers.setAuthorState('New test author');
    });

    expect(screen.getByTestId('quote-text')).toHaveTextContent('New test quote');
    expect(screen.getByTestId('quote-author')).toHaveTextContent('New test author');
  });
});