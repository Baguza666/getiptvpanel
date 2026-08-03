// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import ProfitCalculator, { calculateEstimate } from '../src/components/react/ProfitCalculator';

test('calculates capacity, costs, contribution, break-even and unsold credits', () => {
  const result = calculateEstimate({
    packageCost: 500,
    creditsPurchased: 50,
    creditsPerCustomer: 5,
    retailPrice: 120,
    processingPercent: 2.9,
    fixedPaymentFee: 0.3,
    refundRate: 5,
    monthlySupportCost: 100,
    otherCosts: 50,
    customersSold: 8,
  });

  expect(result.usableCapacity).toBe(10);
  expect(result.customersCounted).toBe(8);
  expect(result.costPerUsableAccount).toBe(50);
  expect(result.estimatedRevenue).toBe(960);
  expect(result.paymentCosts).toBeCloseTo(30.24);
  expect(result.refundAllowance).toBe(48);
  expect(result.grossProfit).toBe(560);
  expect(result.operatingContribution).toBeCloseTo(331.76);
  expect(result.breakEvenCustomers).toBe(3);
  expect(result.unsoldCredits).toBe(10);
});

test('renders transparent labels and updates from user inputs', () => {
  window.getIptvTrack = () => undefined;
  render(<ProfitCalculator />);
  expect(screen.getByText(/Operating contribution:/)).toHaveTextContent('£480.00');
  expect(screen.getByText(/GetIPTVPanel does not add tax/)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Customers sold'), { target: { value: '8' } });
  expect(screen.getByText(/Operating contribution:/)).toHaveTextContent('£384.00');
  fireEvent.click(screen.getByRole('button', { name: 'Complete estimate' }));
  expect(screen.getByText('Estimate updated from the assumptions above.')).toBeInTheDocument();
});
