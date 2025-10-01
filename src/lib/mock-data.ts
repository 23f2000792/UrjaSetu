
import { PlaceHolderImages } from './placeholder-images';
import { Timestamp } from 'firebase/firestore';

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
  price?: number; // for compatibility with EnergyCredit
  ownerId: string;
};

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
  userId: string;
};

export type GovernanceProposal = {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Passed' | 'Failed';
  votesFor: number;
  votesAgainst: number;
  proposer: string;
  endDate: string;
  createdAt: Timestamp;
};

export type Transaction = {
  id: string;
  userId: string;
  sellerId: string;
  projectId: string;
  projectName: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  type: 'Buy' | 'Sell';
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: Timestamp;
}

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  // These would be aggregated fields updated by a backend function
  volume?: number;
  offset?: number;
  avatar?: string;
};

    