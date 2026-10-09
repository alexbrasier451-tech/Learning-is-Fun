import type { BackupEnvelopeV1, DecodeResult } from './backup';
import { decodeBackup, measureBackupBudget, SUPPORTED_CONTENT_VERSION } from './backup';
import type { TaskDefinition } from '../learning/contracts';
import { listTasks } from '../content/catalogue';

export const CURRENT_SAVE_VERSION = 1 as const;
/** The original v1 format has no v0 predecessor. Identity is a fresh pure
 * decode/validation, never a write or calendar reconciliation. Future adjacent
 * paths must be explicitly registered with their compatible content catalogue. */
export function migrateSupportedSave(envelope: BackupEnvelopeV1, targetContentVersion: string,
  catalogue: readonly TaskDefinition[] = listTasks()): DecodeResult {
  if (targetContentVersion !== SUPPORTED_CONTENT_VERSION) return { status: 'unsupported', issues: [
    { path: 'save.contentVersion', code: 'unsupported-content', message: 'No migration to this content version is registered. Keep the original backup.' },
  ] };
  try { measureBackupBudget(envelope); return decodeBackup(JSON.stringify(envelope), catalogue); }
  catch { return { status: 'invalid', issues: [{ path: '$', code: 'invalid-save', message: 'Migration could not read this backup; the original data is unchanged.' }] }; }
}
