import {nextGenkit} from 'genkit/next';
import {ai} from '@/ai/genkit';

export const {GET, POST} = nextGenkit({ai});
