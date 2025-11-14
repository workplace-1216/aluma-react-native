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
    price: '£8.00',
    features: ['First 7 days free', 'Automatically renews each month'],
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '£50',
    features: ['7 days discount every month', 'Automatically renews each year'],
  },
];
