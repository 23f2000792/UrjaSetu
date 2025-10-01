export type SolarProject = {
  id: string;
  name: string;
  location: string;
  capacity: number; // in kW
  tokenPrice: number; // in USD per token
  expectedYield: number; // in % APY
  imageUrl: string;
  imageHint: string;
};

export const solarProjects: SolarProject[] = [
  { id: 'sp1', name: 'Mojave Solar Park', location: 'California, USA', capacity: 250000, tokenPrice: 1.20, expectedYield: 8.5, imageUrl: 'https://picsum.photos/seed/sp1/600/400', imageHint: 'solar panels' },
  { id: 'sp2', name: 'Thar Desert Array', location: 'Rajasthan, India', capacity: 2245000, tokenPrice: 0.85, expectedYield: 9.2, imageUrl: 'https://picsum.photos/seed/sp2/600/400', imageHint: 'desert solar' },
  { id: 'sp3', name: 'Rooftop Revolution', location: 'Berlin, Germany', capacity: 50000, tokenPrice: 1.50, expectedYield: 7.8, imageUrl: 'https://picsum.photos/seed/sp3/600/400', imageHint: 'rooftop solar' },
  { id: 'sp4', name: 'Sunshine Valley', location: 'Queensland, Australia', capacity: 150000, tokenPrice: 1.10, expectedYield: 8.9, imageUrl: 'https://picsum.photos/seed/sp4/600/400', imageHint: 'solar farm' },
];

export type EnergyCredit = {
  id: string;
  projectName: string;
  amount: number; // in kWh
  price: number; // per kWh
  vintage: string; // Year of generation
  imageUrl: string;
  imageHint: string;
};

export const energyCredits: EnergyCredit[] = [
  { id: 'ec1', projectName: 'Mojave Solar Park', amount: 1000, price: 0.15, vintage: '2023', imageUrl: 'https://picsum.photos/seed/ec1/600/400', imageHint: 'energy grid' },
  { id: 'ec2', projectName: 'Thar Desert Array', amount: 5000, price: 0.12, vintage: '2024', imageUrl: 'https://picsum.photos/seed/ec2/600/400', imageHint: 'power lines' },
  { id: 'ec3', projectName: 'Rooftop Revolution', amount: 500, price: 0.18, vintage: '2023', imageUrl: 'https://picsum.photos/seed/ec3/600/400', imageHint: 'city energy' },
];

export type PortfolioAsset = {
  id: string;
  name: string;
  type: 'Project' | 'Credit';
  quantity: number;
  purchasePrice: number;
  currentValue: number;
};

export const portfolioAssets: PortfolioAsset[] = [
    { id: 'sp1', name: 'Mojave Solar Park', type: 'Project', quantity: 500, purchasePrice: 1.15, currentValue: 1.20 },
    { id: 'ec2', name: 'Thar Desert Array ECT', type: 'Credit', quantity: 2500, purchasePrice: 0.11, currentValue: 0.12 },
    { id: 'sp3', name: 'Rooftop Revolution', type: 'Project', quantity: 100, purchasePrice: 1.50, currentValue: 1.50 },
];
