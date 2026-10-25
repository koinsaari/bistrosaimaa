import type { LanguageModel } from 'ai';
import type { BotEnv } from '@/lib/bot/env';
import { createLogTelegramClient, createTelegramClient, type TelegramClient } from '@/lib/bot/telegram';

export const GATEWAY_MODEL = 'anthropic/claude-sonnet-5-5';

export type BotDeps = {
  telegram: TelegramClient;
  agentModel: LanguageModel;
  importModel: LanguageModel;
  allowedUserIds: Set<number>;
};

export async function createBotDeps(env: BotEnv): Promise<BotDeps> {
  const telegram = env.transport === 'log' ? createLogTelegramClient() : createTelegramClient(env.token);
  if (env.model === 'fixture') {
    // Imported lazily so `ai/test` never loads in production.
    const { createFixtureImportModel, createFixtureModel } = await import('@/lib/bot/fixtureModel');
    return { telegram, agentModel: createFixtureModel(), importModel: createFixtureImportModel(), allowedUserIds: env.allowedUserIds };
  }
  return { telegram, agentModel: GATEWAY_MODEL, importModel: GATEWAY_MODEL, allowedUserIds: env.allowedUserIds };
}
