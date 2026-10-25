import { MockLanguageModelV4 } from 'ai/test';
import { z } from 'zod';

// E2E only (`BOT_MODEL=fixture`). The user's message is a JSON script: the mock emits the listed tool calls one per
// step, in order, then the reply. Anything that isn't a script gets the out-of-scope sentence.
const scriptSchema = z.object({
  calls: z.array(z.object({ tool: z.string(), input: z.unknown() })).default([]),
  reply: z.string().default('Valmis'),
});

export const FIXTURE_OUT_OF_SCOPE = 'Osaan auttaa vain lounaslistan kanssa.';

const usage = {
  inputTokens: { total: 0, noCache: 0, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 0, text: 0, reasoning: undefined },
};

function parseScript(text: string) {
  try {
    const parsed = scriptSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function createFixtureModel() {
  return new MockLanguageModelV4({
    modelId: 'fixture',
    doGenerate: async ({ prompt }) => {
      const lastUser = prompt.findLastIndex((message) => message.role === 'user');
      const userMessage = prompt[lastUser];
      const text =
        userMessage?.role === 'user'
          ? userMessage.content.flatMap((part) => (part.type === 'text' ? [part.text] : [])).join('')
          : '';
      const script = parseScript(text);
      const step = prompt.slice(lastUser + 1).filter((message) => message.role === 'tool').length;
      const call = script?.calls[step];

      if (call) {
        return {
          content: [
            { type: 'tool-call' as const, toolCallId: `fixture-${step}`, toolName: call.tool, input: JSON.stringify(call.input ?? {}) },
          ],
          finishReason: { unified: 'tool-calls' as const, raw: undefined },
          usage,
          warnings: [],
        };
      }
      return {
        content: [{ type: 'text' as const, text: script ? script.reply : FIXTURE_OUT_OF_SCOPE }],
        finishReason: { unified: 'stop' as const, raw: undefined },
        usage,
        warnings: [],
      };
    },
  });
}

export function createFixtureImportModel() {
  return new MockLanguageModelV4({
    modelId: 'fixture-import',
    doGenerate: async ({ prompt }) => {
      const lastUser = prompt.findLast((message) => message.role === 'user');
      const caption =
        lastUser?.role === 'user' ? lastUser.content.flatMap((part) => (part.type === 'text' ? [part.text] : [])).join('') : '';
      return {
        content: [{ type: 'text' as const, text: caption }],
        finishReason: { unified: 'stop' as const, raw: undefined },
        usage,
        warnings: [],
      };
    },
  });
}
