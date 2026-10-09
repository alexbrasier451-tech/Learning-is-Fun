import type { CommittedSnapshot, SaveDataV1, SaveToken } from '../../src/state/contracts';
import type { BandEvidence } from '../../src/learning/contracts';
import type { ScoreDelta } from '../../src/rewards/contracts';

/** Erased structural boundary for the Node Playwright project. Importing the
 * browser implementation even for typeof pulls IndexedDB/DOM code into Node. */
export type BackupFixture = {
  runBackupRoundtrip(capacity?: boolean, populatedTarget?: boolean): Promise<{
    namespace: string; initialToken: SaveToken; importedToken: SaveToken;
    importBeforeReconcileEqual: boolean; reexportEqual: boolean; oldEpochStatus: string;
    importedRaw: unknown; budget: { byteLength: number; visitedValues: number; nesting: number };
    profileCount: number; restoredLifetime: readonly number[]; nextWeek: string | null;
    rolloverToken: SaveToken; archivesBefore: number; archivesAfter: number;
  }>;
  runBackupRejections(): Promise<{
    namespace: string; cancelUnchanged: boolean; rejected: readonly string[];
    beforeToken: SaveToken; interveningToken: SaveToken; raceStatus: string;
    capacityStatus: string; capacityReason: string; reissuedStatus: string; replacementToken: SaveToken;
  }>;
  runUnsupportedRecovery(): Promise<{
    namespace: string; loadStatus: string; reason: unknown; before: unknown; after: unknown;
    preserved: boolean; normalValidatedExportAvailable: boolean;
  }>;
  runSupportedSuccessRegression(): Promise<{
    namespace: string; importNamespace: string;
    variants: readonly { hints: readonly boolean[]; band: BandEvidence; lifetime: number;
      validation: { status: string }; decodeStatus: string; rewardIssues: readonly unknown[]; competitionIssues: readonly unknown[] }[];
    original: SaveDataV1; before: CommittedSnapshot; committedStatus: string; after: CommittedSnapshot;
    expectedPersisted: boolean; priorPreservedOnRefusal: boolean; exportError: string | null; exportBytes?: number;
    decodeStatus: string; migrationStatus: string; compactedStatus: string; replacementStatus: string;
    importSnapshot: CommittedSnapshot | null; fresh: { validationStatus: string; band: BandEvidence };
  }>;
  runActiveFirstCheckRegression(): Promise<readonly {
    corrupted: boolean; hinted: boolean; namespace: string; decodeStatus: string;
    previewCreated: boolean; replacementStatus: string; before: CommittedSnapshot; after: CommittedSnapshot;
    issues?: readonly unknown[]; unchanged?: boolean; replaced?: CommittedSnapshot;
    learningAdvanced?: boolean; delta?: ScoreDelta; nextBand?: BandEvidence;
    nextValidationStatus?: string; nextWriteStatus?: string; expectedPersisted?: boolean;
  }[]>;
};
