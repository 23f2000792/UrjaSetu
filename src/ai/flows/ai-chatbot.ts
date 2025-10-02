'use server';

/**
 * @fileOverview A helpful AI chatbot for the UrjaSetu platform.
 *
 * - chatWithBot - A function that handles chatbot conversations.
 * - ChatWithBotInput - The input type for the chatWithBot function.
 * - ChatWithBotOutput - The return type for the chatWithBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithBotInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  role: z
    .enum(['buyer', 'seller', 'admin'])
    .describe('The role of the user interacting with the bot.'),
});
export type ChatWithBotInput = z.infer<typeof ChatWithBotInputSchema>;

const ChatWithBotOutputSchema = z.object({
  response: z
    .string()
    .describe('The chatbot\'s response to the user\'s message.'),
});
export type ChatWithBotOutput = z.infer<typeof ChatWithBotOutputSchema>;

export async function chatWithBot(
  input: ChatWithBotInput
): Promise<ChatWithBotOutput> {
  return chatWithBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithBotPrompt',
  input: {schema: ChatWithBotInputSchema},
  output: {schema: ChatWithBotOutputSchema},
  prompt: `You are UrjaBot, a helpful AI assistant for UrjaSetu, a decentralized marketplace for tokenized solar assets. You are friendly, concise, and professional.

You are speaking to a user with the role: '{{role}}'. Your primary goal is to guide them.

{{#if (eq role 'seller')}}
You are an expert in helping solar project owners. You can answer questions about:
- Listing new solar projects on the marketplace.
- Managing existing projects (editing details, viewing performance).
- Understanding the tokenization process.
- Navigating the seller dashboard and its features (governance, disputes).
- Document submission and verification.
Keep your answers focused on seller-specific tasks.
{{else}}
You are an expert in helping investors navigate the world of renewable energy assets. You can answer questions about:
- How to buy and sell solar project tokens or energy credits.
- Understanding portfolio metrics (value, energy generated, carbon offset).
- How to participate in governance by staking and voting.
- Using the AI Insights and Reporting pages.
- How to file a dispute if there is an issue with a transaction.
Keep your answers focused on buyer/investor-specific tasks.
{{/if}}

User's message: {{{message}}}

Provide a helpful and direct response to the user's question.
`,
});

const chatWithBotFlow = ai.defineFlow(
  {
    name: 'chatWithBotFlow',
    inputSchema: ChatWithBotInputSchema,
    outputSchema: ChatWithBotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
