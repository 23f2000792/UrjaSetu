
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
};

export const solarProjects: SolarProject[] = [
  { id: 'sp1', name: 'Mojave Solar Park', location: 'California, USA', capacity: 250000, tokenPrice: 100, expectedYield: 8.5, imageUrl: PlaceHolderImages.find(p => p.id === 'sp1')?.imageUrl || '', imageHint: 'solar panels' },
  { id: 'sp2', name: 'Thar Desert Array', location: 'Rajasthan, India', capacity: 2245000, tokenPrice: 70, expectedYield: 9.2, imageUrl: PlaceHolderImages.find(p => p.id === 'sp2')?.imageUrl || '', imageHint: 'desert solar' },
  { id: 'sp3', name: 'Rooftop Revolution', location: 'Berlin, Germany', capacity: 50000, tokenPrice: 125, expectedYield: 7.8, imageUrl: PlaceHolderImages.find(p => p.id === 'sp3')?.imageUrl || '', imageHint: 'rooftop solar' },
  { id: 'sp4', name: 'Sunshine Valley', location: 'Queensland, Australia', capacity: 150000, tokenPrice: 90, expectedYield: 8.9, imageUrl: PlaceHolderImages.find(p => p.id === 'sp4')?.imageUrl || '', imageHint: 'solar farm' },
];

export type EnergyCredit = {
  id: string;
  projectName: string;
  amount: number; // in kWh
  price: number; // in INR per kWh
  vintage: string; // Year of generation
  imageUrl: string;
  imageHint: string;
};

export const energyCredits: EnergyCredit[] = [
  { id: 'ec1', projectName: 'Mojave Solar Park', amount: 1000, price: 12, vintage: '2023', imageUrl: PlaceHolderImages.find(p => p.id === 'ec1')?.imageUrl || '', imageHint: 'energy grid' },
  { id: 'ec2', projectName: 'Thar Desert Array', amount: 5000, price: 10, vintage: '2024', imageUrl: PlaceHolderImages.find(p => p.id === 'ec2')?.imageUrl || '', imageHint: 'power lines' },
  { id: 'ec3', projectName: 'Rooftop Revolution', amount: 500, price: 15, vintage: '2023', imageUrl: PlaceHolderImages.find(p => p.id === 'ec3')?.imageUrl || '', imageHint: 'city energy' },
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
