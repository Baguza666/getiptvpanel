// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import RoiCalculator from '../src/components/react/RoiCalculator';

test('Calculates profit accurately based on credits and selling price', () => {
    render(<RoiCalculator />);
    
    // Setup inputs
    const creditsSlider = screen.getByTestId('credits-slider');
    const priceSlider = screen.getByTestId('price-slider');
    const profitDisplay = screen.getByTestId('profit-display');

    // By default, credits = 10, price = 50. Cost basis = 12.
    // Profit = (50 * 10) - (12 * 10) = 500 - 120 = 380
    expect(profitDisplay.textContent).toContain('380 €');

    // Change price to 100, credits to 10. 
    // Profit = (100 * 10) - (12 * 10) = 1000 - 120 = 880
    fireEvent.change(priceSlider, { target: { value: '100' } });
    expect(profitDisplay.textContent).toContain('880 €');

    // Change credits to 50, price to 100. 
    // Profit = (100 * 50) - (12 * 50) = 5000 - 600 = 4400
    fireEvent.change(creditsSlider, { target: { value: '50' } });
    expect(profitDisplay.textContent).toContain('4400 €');
    
    // Change price to 20, credits to 1. 
    // Profit = (20 * 1) - (12 * 1) = 20 - 12 = 8
    fireEvent.change(priceSlider, { target: { value: '20' } });
    fireEvent.change(creditsSlider, { target: { value: '1' } });
    expect(profitDisplay.textContent).toContain('8 €');
});
