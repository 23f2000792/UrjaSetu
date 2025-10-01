'use server';

/**
 * @fileOverview AI-powered summaries of energy generation and sustainability metrics.
 *
 * - summarizeEnergyInsights - A function that provides AI summaries of energy metrics.
 * - SummarizeEnergyInsightsInput - The input type for the summarizeEnergyInsights function.
 * - SummarizeEnergyInsightsOutput - The return type for the summarizeEnergyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEnergyInsightsInputSchema = z.object({
  energyGenerationData: z
    .string()
    .describe(
      'Energy generation data in JSON format, including total kWh generated, date range, and asset identifiers.'
    ),
  sustainabilityMetrics: z
    .string()
    .describe(
      'Sustainability metrics data in JSON format, including carbon offset, environmental impact scores, and renewable energy usage percentage.'
    ),
  userPreferences: z
    .string()
    .optional()
    .describe(
      'Optional user preferences for the summary, such as specific metrics of interest or desired level of detail.'
    ),
});
export type SummarizeEnergyInsightsInput = z.infer<
  typeof SummarizeEnergyInsightsInputSchema
>;

const SummarizeEnergyInsightsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise and easy-to-understand summary of the energy generation and sustainability metrics, tailored to the user preferences.'
    ),
});
export type SummarizeEnergyInsightsOutput = z.infer<
  typeof SummarizeEnergyInsightsOutputSchema
>;

export async function summarizeEnergyInsights(
  input: SummarizeEnergyInsightsInput
): Promise<SummarizeEnergyInsightsOutput> {
  return summarizeEnergyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEnergyInsightsPrompt',
  input: {schema: SummarizeEnergyInsightsInputSchema},
  output: {schema: SummarizeEnergyInsightsOutputSchema},
  prompt: `You are an AI assistant that specializes in summarizing energy generation and sustainability metrics for users.

  Your goal is to provide users with clear, concise, and actionable insights based on their energy data.

  Use the following data to generate the summary:

  Energy Generation Data: {{{energyGenerationData}}}
  Sustainability Metrics: {{{sustainabilityMetrics}}}

  User Preferences (if any): {{{userPreferences}}}

  Please generate a summary that is easy to understand and highlights the most important information for the user.
  The summary should be no more than 200 words.
  Be mindful of the user preferences, if present.
  `,
});

const summarizeEnergyInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeEnergyInsightsFlow',
    inputSchema: SummarizeEnergyInsightsInputSchema,
    outputSchema: SummarizeEnergyInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
