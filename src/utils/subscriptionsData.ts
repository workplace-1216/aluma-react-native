import { PlanCard } from './types';

export const features = [
  'Full library of frequencies',
  'A new guided breathwork monthly',
  'Nature sounds and relaxation',
];

export const plans: PlanCard[] = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '£8.00/month', // Most prominent: billed amount
    features: [
      '7 days free, then £8.00/month', // Subordinate: trial info with post-trial price
      'Automatically renews each month',
    ],
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '£50/year', // Most prominent: billed amount
    features: ['Automatically renews each year'],
  },
];
