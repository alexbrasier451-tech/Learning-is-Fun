import type { ComposedStateController } from '../state/controller';
import type { SaveToken } from '../state/contracts';

/** Allocation and persistence remain facade-owned. Retain the returned command
 * for exact retries; never allocate profile/award identities in a panel. */
export type ProfileDispatch = Pick<ComposedStateController, 'prepareCommand' | 'dispatch'>;
export type BackupActions = ComposedStateController['backupActions'] & Readonly<{
  exportRawRecoveryData?: ComposedStateController['exportRawRecoveryData'];
}>;
export type PanelSaveStatus = Readonly<{
  token: SaveToken | null;
  profileNames: readonly string[];
  pending: boolean;
  failed: boolean;
}>;
