
import {createNextApiHandler} from '@genkit-ai/next';
import {ai} from '@/ai/genkit';
import {config} from 'dotenv';

config();

export const {GET, POST} = createNextApiHandler({
  ai,
  auth: {
    providers: [
      {
        provider: 'google',
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    ],
    session: {
      secret: process.env.AUTH_SECRET!,
    },
  },
});
