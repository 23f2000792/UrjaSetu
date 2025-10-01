
import { PlaceHolderImages } from './placeholder-images';

export type SolarProject = {
  id: string;
  name: string;
  location: string;
  capacity: number; // in kW
  tokenPrice: number; // in INR per token
  expectedYield: number; // in % APY
  imageUrl: string;
  imageHint: string;
  description: string;
  operator: string;
  panelType: string;
  totalTokens: number;
  tokensAvailable: number;
};

export const solarProjects: SolarProject[] = [
  { 
    id: 'sp1', 
    name: 'Mojave Solar Park', 
    location: 'California, USA', 
    capacity: 250000, 
    tokenPrice: 100, 
    expectedYield: 8.5, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'sp1')?.imageUrl || '', 
    imageHint: 'solar panels',
    description: 'A large-scale solar farm located in the Mojave Desert, contributing significantly to California\'s renewable energy goals. This project is known for its high efficiency and consistent energy output.',
    operator: 'SolarGen Inc.',
    panelType: 'Monocrystalline Silicon',
    totalTokens: 1000000,
    tokensAvailable: 250000,
  },
  { 
    id: 'sp2', 
    name: 'Thar Desert Array', 
    location: 'Rajasthan, India', 
    capacity: 2245000, 
    tokenPrice: 70, 
    expectedYield: 9.2, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'sp2')?.imageUrl || '', 
    imageHint: 'desert solar',
    description: 'One of the largest solar parks in the world, the Thar Desert Array leverages the intense Indian sun to generate massive amounts of clean energy, supporting India\'s ambitious green energy targets.',
    operator: 'Bharat Power',
    panelType: 'Polycrystalline Silicon',
    totalTokens: 5000000,
    tokensAvailable: 1200000,
  },
  { 
    id: 'sp3', 
    name: 'Rooftop Revolution', 
    location: 'Berlin, Germany', 
    capacity: 50000, 
    tokenPrice: 125, 
    expectedYield: 7.8, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'sp3')?.imageUrl || '', 
    imageHint: 'rooftop solar',
    description: 'A decentralized project consisting of thousands of rooftop solar installations across Berlin. This community-driven initiative empowers citizens to participate directly in the energy transition.',
    operator: 'Urban Energie eG',
    panelType: 'Thin-Film (CIS)',
    totalTokens: 200000,
    tokensAvailable: 50000,
  },
  { 
    id: 'sp4', 
    name: 'Sunshine Valley', 
    location: 'Queensland, Australia', 
    capacity: 150000, 
    tokenPrice: 90, 
    expectedYield: 8.9, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'sp4')?.imageUrl || '', 
    imageHint: 'solar farm',
    description: 'Located in the heart of Australia\'s "Sunshine State," this project takes advantage of the region\'s abundant sunlight to provide clean power to the local grid and beyond.',
    operator: 'Aussie Solar Co.',
    panelType: 'Monocrystalline PERC',
    totalTokens: 750000,
    tokensAvailable: 300000,
  },
];

export type EnergyCredit = {
  id: string;
  projectName: string;
  amount: number; // in kWh
  price: number; // in INR per kWh
  vintage: string; // Year of generation
  imageUrl: string;
  imageHint: string;
  description: string;
  creditType: string; // e.g., REC, I-REC
  verifier: string;
};

export const energyCredits: EnergyCredit[] = [
  { 
    id: 'ec1', 
    projectName: 'Mojave Solar Park', 
    amount: 1000, 
    price: 12, 
    vintage: '2023', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'ec1')?.imageUrl || '', 
    imageHint: 'energy grid',
    description: 'Renewable Energy Credits (RECs) generated from the Mojave Solar Park in 2023. Each credit represents 1 MWh of clean electricity added to the grid.',
    creditType: 'REC',
    verifier: 'Green-e Energy',
  },
  { 
    id: 'ec2', 
    projectName: 'Thar Desert Array', 
    amount: 5000, 
    price: 10, 
    vintage: '2024', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'ec2')?.imageUrl || '', 
    imageHint: 'power lines',
    description: 'International Renewable Energy Credits (I-RECs) from the first quarter of 2024 production at the massive Thar Desert Array in India.',
    creditType: 'I-REC',
    verifier: 'I-REC Standard',
  },
  { 
    id: 'ec3', 
    projectName: 'Rooftop Revolution', 
    amount: 500, 
    price: 15, 
    vintage: '2023', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'ec3')?.imageUrl || '', 
    imageHint: 'city energy',
    description: 'Community-generated energy credits from the Berlin Rooftop Revolution. These credits directly support decentralized, citizen-owned power generation.',
    creditType: 'TIGR',
    verifier: 'APX',
  },
];

export type PortfolioAsset = {
  id: string;
  name: string;
  type: 'Project' | 'Credit';
  quantity: number;
  purchasePrice: number; // in INR
  currentValue: number; // in INR
};

export const portfolioAssets: PortfolioAsset[] = [
    { id: 'sp1', name: 'Mojave Solar Park', type: 'Project', quantity: 500, purchasePrice: 95, currentValue: 100 },
    { id: 'ec2', name: 'Thar Desert Array ECT', type: 'Credit', quantity: 2500, purchasePrice: 9, currentValue: 10 },
    { id: 'sp3', name: 'Rooftop Revolution', type: 'Project', quantity: 100, purchasePrice: 125, currentValue: 125 },
];
