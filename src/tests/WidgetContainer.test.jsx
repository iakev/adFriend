import { describe, expect, test, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import WidgetContainer from '../components/WidgetContainer.jsx';

// Mock Chrome Storage API
const mockStorage = {};
const chrome = {
  storage: {
    local: {
      get: vi.fn(async (keys) => {
        return Array.isArray(keys)
          ? keys.reduce((acc, key) => ({ ...acc, [key]: mockStorage[key] || null }), {})
          : { [keys]: mockStorage[keys] || null };
      }),
      set: vi.fn(async (items) => {
        Object.assign(mockStorage, items);
      }),
    },
  },
};
global.chrome = chrome;

// Mock Widgets (note the .jsx extension)
vi.mock('../components/QuoteWidget.jsx', () => ({
  default: () => <div data-testid="quote-widget">Mock Quote</div>
}));

vi.mock('../components/TodoWidget.jsx', () => ({
  default: () => <div data-testid="todo-widget">Mock Todo</div>
}));

describe('WidgetContainer', () => {
  test('renders quote widget correctly', async () => {
    mockStorage['quote-123'] = { text: 'Test Quote', author: 'John Doe' };

    await act(async () => {
      render(<WidgetContainer widgetType="quote" adSlotId="123" />);
    });

    expect(await screen.findByTestId('quote-widget')).toBeInTheDocument();
  });

  test('renders default data if storage is empty', async () => {
    await act(async () => {
      render(<WidgetContainer widgetType="quote" adSlotId="999" />);
    });

    expect(await screen.findByTestId("quote-widget")).toHaveTextContent("Mock Quote");
  });

  test('toggles widget minimization', async () => {
    await act(async () => {
      render(<WidgetContainer widgetType="quote" adSlotId="123" />);
    });

    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('quote-widget')).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(await screen.findByTestId('quote-widget')).toBeInTheDocument();
  });

  test('updates widget data', async () => {
    await act(async () => {
      render(<WidgetContainer widgetType="todo" adSlotId="456" />);
    });

    mockStorage['todo-456'] = { items: [{ text: 'New Task', completed: false }] };

    await act(async () => {
      await chrome.storage.local.set({ 'todo-456': mockStorage['todo-456'] });
    });

    const todoWidget = await screen.findByTestId('todo-widget');
    expect(todoWidget).toBeInTheDocument();
  });
});