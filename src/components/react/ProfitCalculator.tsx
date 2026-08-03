import React, { useMemo, useRef, useState } from 'react';
import { whatsAppHref } from '../../config/contact';

export interface CalculatorInputs {
  packageCost: number;
  creditsPurchased: number;
  creditsPerCustomer: number;
  retailPrice: number;
  processingPercent: number;
  fixedPaymentFee: number;
  refundRate: number;
  monthlySupportCost: number;
  otherCosts: number;
  customersSold: number;
}

export interface CalculatorResult {
  usableCapacity: number;
  customersCounted: number;
  costPerUsableAccount: number;
  estimatedRevenue: number;
  paymentCosts: number;
  refundAllowance: number;
  grossProfit: number;
  operatingContribution: number;
  grossMargin: number;
  breakEvenCustomers: number | null;
  unsoldCredits: number;
}

const safe = (value: number) => (Number.isFinite(value) && value >= 0 ? value : 0);

export function calculateEstimate(raw: CalculatorInputs): CalculatorResult {
  const inputs = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, safe(value)]),
  ) as unknown as CalculatorInputs;

  const usableCapacity = inputs.creditsPerCustomer > 0
    ? Math.floor(inputs.creditsPurchased / inputs.creditsPerCustomer)
    : 0;
  const customersCounted = Math.min(Math.floor(inputs.customersSold), usableCapacity);
  const creditUnitCost = inputs.creditsPurchased > 0 ? inputs.packageCost / inputs.creditsPurchased : 0;
  const costPerUsableAccount = creditUnitCost * inputs.creditsPerCustomer;
  const costOfAccountsSold = costPerUsableAccount * customersCounted;
  const estimatedRevenue = customersCounted * inputs.retailPrice;
  const paymentCosts = estimatedRevenue * (inputs.processingPercent / 100) + customersCounted * inputs.fixedPaymentFee;
  const refundAllowance = estimatedRevenue * (inputs.refundRate / 100);
  const grossProfit = estimatedRevenue - costOfAccountsSold;
  const operatingContribution = grossProfit - paymentCosts - refundAllowance - inputs.monthlySupportCost - inputs.otherCosts;
  const grossMargin = estimatedRevenue > 0 ? (grossProfit / estimatedRevenue) * 100 : 0;
  const contributionPerCustomer =
    inputs.retailPrice -
    costPerUsableAccount -
    inputs.retailPrice * (inputs.processingPercent / 100) -
    inputs.fixedPaymentFee -
    inputs.retailPrice * (inputs.refundRate / 100);
  const breakEvenCustomers = contributionPerCustomer > 0
    ? Math.ceil((inputs.monthlySupportCost + inputs.otherCosts) / contributionPerCustomer)
    : null;
  const unsoldCredits = Math.max(inputs.creditsPurchased - customersCounted * inputs.creditsPerCustomer, 0);

  return {
    usableCapacity,
    customersCounted,
    costPerUsableAccount,
    estimatedRevenue,
    paymentCosts,
    refundAllowance,
    grossProfit,
    operatingContribution,
    grossMargin,
    breakEvenCustomers,
    unsoldCredits,
  };
}

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 });
const number = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });

const initialInputs: CalculatorInputs = {
  packageCost: 120,
  creditsPurchased: 10,
  creditsPerCustomer: 1,
  retailPrice: 60,
  processingPercent: 0,
  fixedPaymentFee: 0,
  refundRate: 0,
  monthlySupportCost: 0,
  otherCosts: 0,
  customersSold: 10,
};

type InputKey = keyof CalculatorInputs;

export default function ProfitCalculator() {
  const [inputs, setInputs] = useState(initialInputs);
  const [completed, setCompleted] = useState(false);
  const started = useRef(false);
  const result = useMemo(() => calculateEstimate(inputs), [inputs]);
  const scenarioWhatsApp = whatsAppHref(
    `Hello, I modelled ${result.customersCounted} customer sales from ${inputs.creditsPurchased} credits. The calculator shows ${money.format(result.operatingContribution)} estimated operating contribution after the optional business costs I entered. I would like the current reseller terms.`,
  );

  const update = (key: InputKey, value: string) => {
    setInputs((current) => ({ ...current, [key]: Math.max(0, Number(value) || 0) }));
    setCompleted(false);
  };

  const complete = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCompleted(true);
    window.getIptvTrack?.('profit_calculator_complete', { completionState: 'completed' });
  };

  const start = () => {
    if (started.current) return;
    started.current = true;
    window.getIptvTrack?.('profit_calculator_start');
  };

  const fields: Array<{ key: InputKey; label: string; step?: string; suffix?: string; help: string }> = [
    { key: 'packageCost', label: 'Package cost', step: '0.01', suffix: '£', help: 'Total amount paid for the reseller package.' },
    { key: 'creditsPurchased', label: 'Credits purchased', step: '1', help: 'Total credits in the package.' },
    { key: 'creditsPerCustomer', label: 'Credits per customer plan', step: '1', help: 'Credits consumed by one customer account.' },
    { key: 'retailPrice', label: 'Retail selling price', step: '0.01', suffix: '£', help: 'Amount charged per customer account.' },
    { key: 'processingPercent', label: 'Your payment-processing rate', step: '0.1', suffix: '%', help: 'Optional cost from the payment service you use for customers.' },
    { key: 'fixedPaymentFee', label: 'Your fixed payment fee', step: '0.01', suffix: '£', help: 'Optional fixed cost from your customer payment service.' },
    { key: 'refundRate', label: 'Your refund allowance', step: '0.1', suffix: '%', help: 'Optional allowance for refunds issued by your business.' },
    { key: 'monthlySupportCost', label: 'Your monthly support cost', step: '0.01', suffix: '£', help: 'Optional labour, tools or outsourced support cost.' },
    { key: 'otherCosts', label: 'Your other operating costs', step: '0.01', suffix: '£', help: 'Optional marketing, software or business costs.' },
    { key: 'customersSold', label: 'Customers sold', step: '1', help: 'Accounts sold within the package capacity.' },
  ];

  return (
    <div className="calculator-shell" onFocus={start}>
      <div className="notice warning-notice">
        <strong>No tax or added panel fees</strong>
        Use the displayed panel total or your larger-order quote. The optional cost fields are expenses from your own reseller business, not charges from GetIPTVPanel.
      </div>
      <form className="calculator-form" onSubmit={complete}>
        <fieldset>
          <legend>Your assumptions</legend>
          <div className="calculator-fields">
            {fields.map((field) => (
              <div className="field" key={field.key}>
                <label htmlFor={`calc-${field.key}`}>{field.label}{field.suffix ? ` (${field.suffix})` : ''}</label>
                <input
                  id={`calc-${field.key}`}
                  type="number"
                  min="0"
                  step={field.step ?? '0.01'}
                  inputMode={field.step === '1' ? 'numeric' : 'decimal'}
                  value={inputs[field.key]}
                  aria-describedby={`calc-${field.key}-help`}
                  onChange={(event) => update(field.key, event.target.value)}
                />
                <small id={`calc-${field.key}-help`}>{field.help}</small>
              </div>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="button button-primary">Complete estimate</button>
      </form>

      <section className="calculator-results" aria-labelledby="results-title">
        <div>
          <p className="eyebrow">Estimated result</p>
          <h2 id="results-title">Operating contribution: {money.format(result.operatingContribution)}</h2>
          <p role={completed ? 'status' : undefined} aria-live={completed ? 'polite' : undefined} aria-atomic={completed ? 'true' : undefined}>{completed ? 'Estimate updated from the assumptions above.' : 'Results update as you change an input. Complete the estimate when the scenario is ready.'}</p>
        </div>
        <dl className="result-grid">
          <div><dt>Usable customer capacity</dt><dd>{result.usableCapacity}</dd></div>
          <div><dt>Customers counted</dt><dd>{result.customersCounted}</dd></div>
          <div><dt>Cost per usable account</dt><dd>{money.format(result.costPerUsableAccount)}</dd></div>
          <div><dt>Estimated revenue</dt><dd>{money.format(result.estimatedRevenue)}</dd></div>
          <div><dt>Your payment-processing costs</dt><dd>{money.format(result.paymentCosts)}</dd></div>
          <div><dt>Your refund allowance</dt><dd>{money.format(result.refundAllowance)}</dd></div>
          <div><dt>Gross profit before your optional operating costs</dt><dd>{money.format(result.grossProfit)}</dd></div>
          <div><dt>Gross margin</dt><dd>{number.format(result.grossMargin)}%</dd></div>
          <div><dt>Break-even customers for entered fixed costs</dt><dd>{result.breakEvenCustomers ?? 'Not reached'}</dd></div>
          <div><dt>Unsold credits</dt><dd>{number.format(result.unsoldCredits)}</dd></div>
        </dl>
        <p className="result-note">Operating contribution subtracts the panel cost and only the optional business costs you enter. GetIPTVPanel does not add tax, setup fees or separate panel fees to the displayed panel price.</p>
        <a href={scenarioWhatsApp} className="button button-primary" data-event="whatsapp_click" data-placement="calculator-result">Discuss this estimate on WhatsApp</a>
      </section>
    </div>
  );
}
