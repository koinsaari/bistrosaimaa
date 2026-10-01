import { existsSync } from 'node:fs';
import type { Allergen } from '../lib/allergens';
import { categories, dishes, getDb } from './index';

if (!process.env.DATABASE_URL && existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

type SeedDish = [name: string, allergens: Allergen[]];

const CATALOG: Record<string, SeedDish[]> = {
  Broileri: [
    ['Kievin kana', ['L']],
    ['Crispy chicken & majoneesi', ['L']],
    ['Broilerpyörykät currykastikkeessa', ['L', 'G']],
    ['Paneroitu broileri', ['L', 'G']],
    ['Hovimestarin broileri', ['L', 'G']],
    ['Pekonibroileri', ['L', 'G']],
    ['Marry me -broileri', ['L', 'G']],
    ['Valkosipuli-hunajabroileri', ['L', 'G']],
    ['Bearnaisebroileri', ['L', 'G']],
    ['Täytetyt kanatortillat', ['L']],
  ],
  Jauheliha: [
    ['Jauhelihamureke', ['L', 'G']],
    ['Lasagne', ['L']],
    ['Jauhelihakastike', ['L', 'G']],
    ['Lindströmin pihvit', ['L', 'G']],
    ['Jauheliha-makaronilaatikko', ['L']],
    ['Täytetyt jauhelihatortillat', ['L']],
    ['Aurajuusto-lihamureke', ['L', 'G']],
    ['Pekonimureke', ['L', 'G']],
    ['Pasta Bolognese', ['L']],
    ['Kaalikääryleet & puolukkahillo', ['L', 'G']],
    ['Kaalilaatikko & puolukkahillo', ['L', 'G']],
  ],
  'Makkara ja nakit': [
    ['Uuninakit & muusi', ['L', 'G']],
    ['Paistetut nakit & muusi', ['L', 'G']],
    ['Pekoninakit & muusi', ['L', 'G']],
    ['Makkarapihvit', ['L', 'G']],
    ['Nakkistroganoff', ['L', 'G']],
    ['Uunimakkara & muusi', ['L', 'G']],
    ['Makkaramix', ['L', 'G']],
    ['Juustoinen makkaravuoka', ['L', 'G']],
    ['Makkarakastike', ['L', 'G']],
    ['Nakkikastike', ['L', 'G']],
  ],
  Possu: [
    ['Porsaanfilee rosepippurikastikkeella', ['L', 'G']],
    ['Porsaanfilee sinappi-kermakastikkeella', ['L', 'G']],
    ['Porsaanfilee jaloviina-pippurikastikkeella', ['L', 'G']],
    ['Pyttipannu & paistetut kananmunat', ['L', 'G']],
    ['Karamellipossu', ['L', 'G']],
    ['BBQ-nyhtöpossu', ['L', 'G']],
    ['Hawaijinleikkeet', ['L']],
    ['Sveitsinleikkeet', ['L', 'G']],
    ['Tirripaisti & muusi', ['L', 'G']],
    ['Kinkkukiusaus', ['L', 'G']],
    ['Pepperonikiusaus', ['L', 'G']],
  ],
  Kala: [
    ['Rapeat kalaleikkeet & tartarkastike', ['L']],
    ['Teriyaki-uunilohi', ['L', 'G']],
    ['Mantelikala', ['L', 'G']],
    ['Kalapuikot & kermaviilikastike', ['L']],
    ['Sitruunaiset kalaleikkeet', ['L']],
    ['Smetanalohi', ['L', 'G']],
    ['Lohipyörykät tilli-kermakastikkeessa', ['L', 'G']],
  ],
  'Nauta ja riista': [
    ['Karjalanpaisti', ['L', 'G']],
    ['Riistakäristys & puolukkahillo', ['L', 'G']],
    ['Naudanpaisti konjakki-pippurikastikkeella', ['L', 'G']],
    ['Burgundinpata', ['L', 'G']],
  ],
};

async function main() {
  const db = getDb();

  const categoryRows = Object.keys(CATALOG).map((name, i) => ({ name, sortOrder: i }));
  await db.insert(categories).values(categoryRows).onConflictDoNothing();
  const idByName = new Map((await db.select().from(categories)).map((c) => [c.name, c.id]));

  const dishRows = Object.entries(CATALOG).flatMap(([category, list]) =>
    list.map(([name, allergens]) => ({ name, allergens, categoryId: idByName.get(category) })),
  );
  const inserted = await db.insert(dishes).values(dishRows).onConflictDoNothing().returning({ id: dishes.id });

  console.log(`categories: ${categoryRows.length}, dishes inserted: ${inserted.length}/${dishRows.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
