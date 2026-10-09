import type { ActivityBindingId, QuestActivityBinding, TaskDefinition } from '../learning/contracts';
import { listTasks, validateCatalogue } from './catalogue';

const bridge = 'lif.math.bridge.r1.total-12';
const punctuation = 'lif.english.punctuation.r1.spellbook-anchor';
const merchant = 'lif.math.merchant.r1.mult-2.pears-3';
const ids = (skillId: 'M01' | 'E06' | 'M04') => listTasks({ skillId }).map(task => task.canonicalQuestionId);
export const QUEST_ACTIVITY_BINDINGS: readonly QuestActivityBinding[] = Object.freeze([
  { bindingId: 'q1-story-m01', questId: 'Q1', availability: 'M1', role: 'story', skillId: 'M01', taskIds: [bridge], mechanic: 'drag', responseKind: 'bridge', sourceBindingId: null },
  { bindingId: 'q1-transfer-m01', questId: 'Q1', availability: 'M1', role: 'optional-transfer', skillId: 'M01', taskIds: ids('M01').filter(id => id !== bridge), mechanic: 'drag', responseKind: 'bridge', sourceBindingId: 'q1-story-m01' },
  { bindingId: 'q1-revisit-m01', questId: 'Q1', availability: 'M1', role: 'revisit', skillId: 'M01', taskIds: ids('M01'), mechanic: 'drag', responseKind: 'bridge', sourceBindingId: null },
  { bindingId: 'q2-story-e06', questId: 'Q2', availability: 'M1', role: 'story', skillId: 'E06', taskIds: [punctuation], mechanic: 'drag', responseKind: 'punctuation', sourceBindingId: null },
  { bindingId: 'q2-transfer-e06', questId: 'Q2', availability: 'M1', role: 'optional-transfer', skillId: 'E06', taskIds: ids('E06').filter(id => id !== punctuation), mechanic: 'drag', responseKind: 'punctuation', sourceBindingId: 'q2-story-e06' },
  { bindingId: 'q2-revisit-e06', questId: 'Q2', availability: 'M1', role: 'revisit', skillId: 'E06', taskIds: ids('E06'), mechanic: 'drag', responseKind: 'punctuation', sourceBindingId: null },
  { bindingId: 'q3-story-m04', questId: 'Q3', availability: 'M1', role: 'story', skillId: 'M04', taskIds: [merchant], mechanic: 'object-manipulation', responseKind: 'merchant', sourceBindingId: null },
  { bindingId: 'q3-transfer-m04', questId: 'Q3', availability: 'M1', role: 'optional-transfer', skillId: 'M04', taskIds: ids('M04').filter(id => id !== merchant), mechanic: 'object-manipulation', responseKind: 'merchant', sourceBindingId: 'q3-story-m04' },
  { bindingId: 'q3-revisit-m04', questId: 'Q3', availability: 'M1', role: 'revisit', skillId: 'M04', taskIds: ids('M04'), mechanic: 'object-manipulation', responseKind: 'merchant', sourceBindingId: null },
].map(row => Object.freeze({ ...row, taskIds: Object.freeze(row.taskIds) })) as QuestActivityBinding[]);

export type BindingIssue = Readonly<{ bindingId: string; field: string; code: string; detail: string }>;
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const admitted = (row: QuestActivityBinding, milestone: 'M1' | 'M2') => row.availability === 'M1' || (milestone === 'M2' && row.availability === 'M2');

export function validateBindings(bindings: readonly QuestActivityBinding[], catalogue: readonly TaskDefinition[], questIds: readonly string[]): readonly BindingIssue[] {
  const issues: BindingIssue[] = [];
  const add = (bindingId: string, field: string, code: string, detail: string) => { issues.push({ bindingId, field, code, detail }); };
  if (validateCatalogue(catalogue).length) {
    add('(catalogue)', 'catalogue', 'content-unavailable', 'Binding tasks require a valid reviewed delivered catalogue.'); return issues;
  }
  if (!Array.isArray(bindings)) { add('(bindings)', 'bindings', 'malformed-binding', 'Bindings must be an array.'); return issues; }
  const rows: QuestActivityBinding[] = [];
  const seen = new Set<string>();
  for (const input of bindings) {
    const row = input as QuestActivityBinding;
    const id = record(row) && nonempty(row.bindingId) ? row.bindingId : '(unknown)';
    if (!record(row) || !nonempty(row.bindingId) || !nonempty(row.questId)
      || !['M1', 'M2'].includes(row.availability) || !['story', 'optional-transfer', 'revisit'].includes(row.role)
      || !Array.isArray(row.taskIds) || !Array.from(row.taskIds).every(nonempty)
      || !(row.sourceBindingId === null || nonempty(row.sourceBindingId))) {
      add(id, 'binding', 'malformed-binding', 'A declared role, availability, source and dense task-ID list are required.'); continue;
    }
    rows.push(row);
    if (seen.has(id)) add(id, 'bindingId', 'duplicate-binding', 'Binding IDs are unique.'); seen.add(id);
    if (!questIds.includes(row.questId)) add(id, 'questId', 'unknown-quest', 'Quest must exist in the experience registry.');
    if (!row.taskIds.length || new Set(row.taskIds).size !== row.taskIds.length) add(id, 'taskIds', 'invalid-pool', 'A nonempty unique task pool is required.');
    if (row.availability === 'M1' && row.role === 'story' && row.taskIds.length !== 1) add(id, 'taskIds', 'invalid-anchor', 'M1 story rows retain one fixed anchor.');
    if (row.availability === 'M2' && row.role === 'story' && ['Q1', 'Q2', 'Q3'].includes(row.questId)) {
      add(id, 'questId', 'retrospective-requirement', 'M2 cannot add required work to the three released M1 quests.');
    }
    if (row.role !== 'optional-transfer' && row.sourceBindingId !== null) add(id, 'sourceBindingId', 'invalid-source', 'Only optional transfers may have a source binding.');
    const expectedMechanic = row.responseKind === 'merchant' ? 'object-manipulation' : row.responseKind === 'bridge' || row.responseKind === 'punctuation' ? 'drag' : null;
    if (row.mechanic !== expectedMechanic) add(id, 'mechanic', 'mechanic-mismatch', 'The mechanic must match the delivered M1 response adapter.');
    for (const taskId of row.taskIds) if (catalogue.filter(task => task.canonicalQuestionId === taskId && task.skillId === row.skillId && task.responseSpec.kind === row.responseKind).length !== 1) {
      add(id, 'taskIds', 'task-mismatch', 'Each task must resolve once with this primary skill and response kind.');
    }
    const signed = QUEST_ACTIVITY_BINDINGS.find(reference => reference.bindingId === id);
    if (signed) {
      for (const field of ['questId', 'availability', 'role', 'skillId', 'mechanic', 'responseKind', 'sourceBindingId'] as const) {
        if (row[field] !== signed[field]) add(id, field, 'released-binding-mismatch', 'Released M1 binding meanings are immutable.');
      }
      if (row.taskIds.length !== signed.taskIds.length || row.taskIds.some(taskId => !signed.taskIds.includes(taskId))) {
        add(id, 'taskIds', 'released-pool-mismatch', 'Retain the released anchor/transfer/revisit pool.');
      }
    } else if (row.availability === 'M1') add(id, 'bindingId', 'unknown-m1-binding', 'M1 has only the nine signed binding IDs.');
  }
  for (const row of rows.filter(row => row.role === 'optional-transfer')) {
    const sources = rows.filter(source => source.bindingId === row.sourceBindingId);
    const source = sources[0];
    if (sources.length !== 1 || !source || source.role !== 'story' || source.availability !== 'M1' || row.availability !== 'M1'
      || source.questId !== row.questId || source.skillId !== row.skillId || source.taskIds.length !== 1 || source.sourceBindingId !== null) {
      add(row.bindingId, 'sourceBindingId', 'invalid-source', 'Transfer source must be one M1 story anchor in the same quest/skill.');
    } else if (row.taskIds.includes(source.taskIds[0])) add(row.bindingId, 'taskIds', 'source-in-transfer', 'The source canonical question cannot be a transfer.');
  }
  for (const reference of QUEST_ACTIVITY_BINDINGS) if (!rows.some(row => row.bindingId === reference.bindingId)) {
    add(reference.bindingId, 'bindingId', 'missing-m1-binding', 'The released M1 binding set must be retained.');
  }
  const represented = new Set([...rows.map(row => row.questId), ...['Q1', 'Q2', 'Q3'].filter(id => questIds.includes(id))]);
  for (const questId of represented) if (!rows.some(row => row.questId === questId && row.role === 'story')) {
    add(questId, 'role', 'missing-required-set', 'A represented quest must have a nonempty required story set.');
  }
  return issues;
}

export function getRequiredBindingIds(bindings: readonly QuestActivityBinding[], questId: string, milestone: 'M1' | 'M2'): readonly ActivityBindingId[] {
  if (!Array.isArray(bindings) || !['M1', 'M2'].includes(milestone)) return [];
  const rows: readonly QuestActivityBinding[] = bindings.filter(input => {
    const row = input as QuestActivityBinding;
    return record(row) && row.questId === questId && row.role === 'story' && admitted(row, milestone);
  });
  if (rows.some(row => !nonempty(row.bindingId) || row.sourceBindingId !== null || !Array.isArray(row.taskIds)
    || !row.taskIds.length || !Array.from(row.taskIds).every(nonempty) || (row.availability === 'M1' && row.taskIds.length !== 1))
    || new Set(rows.map(row => row.bindingId)).size !== rows.length) return [];
  return Object.freeze(rows.map(row => row.bindingId));
}
export function areRequiredBindingsComplete(input: { bindings: readonly QuestActivityBinding[]; questId: string; milestone: 'M1' | 'M2'; completedStoryBindingIds: readonly ActivityBindingId[] }): boolean {
  const required = getRequiredBindingIds(input.bindings, input.questId, input.milestone);
  return required.length > 0 && Array.isArray(input.completedStoryBindingIds)
    && required.every(id => input.completedStoryBindingIds.includes(id));
}

// The actual constant is checked by assembly tests against the actual catalogue.
// These pure helpers never persist a binding completion, quest or award.
