import { PlanCard } from './types';
//'First 7 days free','7 days discount every month',
export const features = [
  'A curated library of frequencies',
  'Access to all our guided breathworks',
  'Weekly Meditation',
];

export const plans: PlanCard[] = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '£8.00',
    features: [ 'Recurring monthly payment. Cancel anytime' ],
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '€4.16/mo (€50/y)',
    features: [ 'Billed as one payment. Recurring annual payment. Cancel anytime' ],
  },
];
