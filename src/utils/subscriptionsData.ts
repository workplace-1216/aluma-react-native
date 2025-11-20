import { PlanCard } from './types';
//'First 7 days free','7 days discount every month',
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
    features: [ 'Automatically renews each month'],
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '£50',
    features: [ 'Automatically renews each year'],
  },
];
