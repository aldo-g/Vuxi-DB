/**
 * Generate voucher codes for beta testers.
 *
 * Usage:
 *   npx ts-node scripts/generate-vouchers.ts --count 10 --credits 5
 *   npx ts-node scripts/generate-vouchers.ts --count 1 --credits 10 --expires 2026-06-01
 */
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

function generateCode(): string {
  // Format: XXXX-XXXX-XXXX (alphanumeric, uppercase, no ambiguous chars like 0/O/1/I)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () =>
    Array.from({ length: 4 }, () => chars[randomBytes(1)[0] % chars.length]).join('');
  return `${segment()}-${segment()}-${segment()}`;
}

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const count = parseInt(get('--count') ?? '1', 10);
  const credits = parseInt(get('--credits') ?? '1', 10);
  const expiresStr = get('--expires');
  const expiresAt = expiresStr ? new Date(expiresStr) : null;

  if (isNaN(count) || count < 1) {
    console.error('--count must be a positive integer');
    process.exit(1);
  }
  if (isNaN(credits) || credits < 1) {
    console.error('--credits must be a positive integer');
    process.exit(1);
  }

  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let code: string;
    // Retry on collision (astronomically unlikely but correct)
    while (true) {
      code = generateCode();
      const existing = await prisma.voucherCode.findUnique({ where: { code } });
      if (!existing) break;
    }
    await prisma.voucherCode.create({
      data: { code, credits, ...(expiresAt && { expiresAt }) },
    });
    codes.push(code);
  }

  console.log(`\nGenerated ${count} voucher(s) — ${credits} credit(s) each`);
  if (expiresAt) console.log(`Expires: ${expiresAt.toISOString()}`);
  console.log('\nCodes:');
  codes.forEach(c => console.log(`  ${c}`));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
