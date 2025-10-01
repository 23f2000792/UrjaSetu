




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
  userId: string;
};

export const portfolioAssets: PortfolioAsset[] = [
    { id: 'sp1', name: 'Mojave Solar Park', type: 'Project', quantity: 500, purchasePrice: 95, currentValue: 100, userId: 'dummy' },
    { id: 'ec2', name: 'Thar Desert Array ECT', type: 'Credit', quantity: 2500, purchasePrice: 9, currentValue: 10, userId: 'dummy' },
    { id: 'sp3', name: 'Rooftop Revolution', type: 'Project', quantity: 100, purchasePrice: 125, currentValue: 125, userId: 'dummy' },
];

export type GovernanceProposal = {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Passed' | 'Failed';
  votesFor: number;
  votesAgainst: number;
  proposer: string;
  endDate: string;
}

export const proposals: GovernanceProposal[] = [
  { 
    id: 'GP-001', 
    title: 'Increase Staking Rewards by 5%', 
    status: 'Active',
    description: 'This proposal suggests increasing the base APY for staking URJA tokens from 12.5% to 17.5%. The goal is to incentivize more users to stake their tokens, which increases the security and stability of the platform. The additional rewards would be sourced from the community treasury, which currently has a surplus. This change would be active for a period of 6 months, after which it will be re-evaluated.',
    votesFor: 1234567,
    votesAgainst: 234567,
    proposer: '0x1a2b...c3d4',
    endDate: '2024-08-15',
  },
  { 
    id: 'GP-002', 
    title: 'Fund a new solar project in Africa', 
    status: 'Passed',
    description: 'This proposal seeks to allocate 5,000,000 URJA tokens from the treasury to co-fund the "Sahara Sun" project, a new 50MW solar farm in Nigeria. This aligns with our mission to expand renewable energy access globally. The project has been vetted by our partners and promises a strong return on investment and significant environmental impact.',
    votesFor: 8765432,
    votesAgainst: 1234567,
    proposer: '0x5e6f...a7b8',
    endDate: '2024-07-01',
  },
  { 
    id: 'GP-003', 
    title: 'Update platform fee structure', 
    status: 'Failed',
    description: 'This proposal suggests a change in the platform\'s fee structure. It proposes reducing the transaction fee from 0.5% to 0.25% for trades over 100,000 URJA, and introducing a small 0.05% fee for staking and unstaking operations to cover network costs. The aim is to attract larger traders while ensuring platform sustainability.',
    votesFor: 2345678,
    votesAgainst: 5678901,
    proposer: '0x9c0d...e1f2',
    endDate: '2024-06-20',
  },
];


export type Transaction = {
  id: string;
  userId: string;
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
    

    

    