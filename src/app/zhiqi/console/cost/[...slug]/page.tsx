import CostRedirectClient from './cost-redirect-client';

export function generateStaticParams() {
  return [
    { slug: ['pricing'] },
    { slug: ['packages'] },
    { slug: ['purchased-packages'] },
    { slug: ['orders'] },
    { slug: ['bill'] },
    { slug: ['bill', 'detail'] },
    { slug: ['billing'] },
    { slug: ['income-expense'] },
  ];
}

export default function CostCatchAllRedirectPage() {
  return <CostRedirectClient />;
}
