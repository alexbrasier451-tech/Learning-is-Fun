import { createRoot } from 'react-dom/client';
import { ProgressView } from '../../src/adult/ProgressView';
import { listTasks, STARTER_TASKS } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { SKILLS } from '../../src/content/skills';
import { COSMETICS, CREATIVE_CHOICES, QUESTS, STORY_DISPLAYS } from '../../src/experience/catalogue';
import { resolveWorldView } from '../../src/experience/world';
import { evaluateResponse } from '../../src/learning/evaluate';
import { summarizeLearning } from '../../src/learning/summarize';
import { createStateController } from '../../src/state/controller';
import { createInitialSave, sameValue } from '../../src/state/transition';
import { openSaveRepository } from '../../src/state/repository';
import { decodeBackup, measureBackupBudget, validateSave } from '../../src/state/backup';
import { migrateSupportedSave } from '../../src/state/migrations';
import type { ActivityResponse, LearningAssistance, SkillId, TaskDefinition } from '../../src/learning/contracts';
import type { CommitResult, EncounterSave, SaveDataV1, StateCommand } from '../../src/state/contracts';
import cases from './expanded-cases.json';

const catalogue = listTasks(), date = '2026-10-11T12:00:00.000Z';
const progress = createRoot(document.getElementById('progress')!);
function assert(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
function committed(result: CommitResult) { assert(result.status === 'committed', JSON.stringify(result)); return result; }
function acknowledged(result: CommitResult) { assert(result.status === 'committed' || result.status === 'already-applied', JSON.stringify(result)); }
const taskFor = (e: EncounterSave) => catalogue.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!;
function answer(task: TaskDefinition): ActivityResponse {
  if (task.answerRule.kind === 'accepted-responses') return structuredClone(task.answerRule.responses[0]);
  if (task.answerRule.kind === 'bridge-total') return { kind: 'bridge', planks: [...Array(Math.floor(task.answerRule.target / 6)).fill(6), ...(task.answerRule.target % 6 ? [task.answerRule.target % 6] : [])] };
  const pears = task.answerRule.total / (task.answerRule.multiplier + 1);
  return { kind: 'merchant', apples: pears * task.answerRule.multiplier, pears };
}
async function host(initialSave = createInitialSave(), namespace = `expanded-${crypto.randomUUID()}`, delivered = catalogue, milestone: 'M1' | 'M2' = 'M2') {
  let now = Date.parse(date);
  const repositoryFor = () => openSaveRepository({ appNamespace: namespace, initialSave, validateSave, catalogue: delivered });
  const initialRepository = repositoryFor(), initialLoad = await initialRepository.loadRoot();
  assert(initialLoad.status === 'new' || initialLoad.status === 'ready', JSON.stringify(initialLoad));
  // This sole-repository checkpoint precedes facade startup reconciliation.
  const make = (repository = repositoryFor()) => createStateController({ repository,
    catalogue: delivered, questBindings: QUEST_ACTIVITY_BINDINGS, milestone, clock: { nowEpochMs: () => now },
    preferenceGate: { applyLiveIntent() {} }, readTransientReadiness: () => ({ dirty: false, pending: false, failed: false }) });
  let controller = make(initialRepository); assert(['new', 'ready'].includes((await controller.ready).status), JSON.stringify(controller.getLoadState()));
  const act = (kind: StateCommand['kind'], payload: unknown, profileId?: string) => controller.dispatch({ kind, payload,
    actionId: crypto.randomUUID(), expected: controller.getSnapshot().token, ...(profileId ? { profileId } : {}) } as StateCommand);
  const profile = (id = 'expanded') => controller.getSnapshot().save.profiles[id];
  const active = (id = 'expanded') => Object.values(profile(id).encounters).reverse().find(e => e.learningEpisode.status === 'open')!;
  const check = (e: EncounterSave, response = answer(taskFor(e)), id = 'expanded') => act('SubmitCheck', { encounterId: e.encounterId,
    learningEpisodeOrdinal: e.learningEpisode.ordinal, submissionId: crypto.randomUUID(), checkSequence: e.validChecks + 1, response }, id);
  const replay = (e: EncounterSave, id = 'expanded') => {
    assert(e.lastCommittedCheck, 'Retained replay needs a real Check'); const last = e.lastCommittedCheck;
    return controller.dispatch({ kind: 'SubmitCheck', profileId: id, actionId: e.learningEpisode.completionActionId ?? crypto.randomUUID(),
      expected: controller.getSnapshot().token, payload: { encounterId: e.encounterId, learningEpisodeOrdinal: last.learningEpisodeOrdinal,
        submissionId: last.submissionId, checkSequence: last.checkSequence, response: last.response } });
  };
  const exported = async () => { const out = await controller.backupActions.export('flushed'); assert(out.status === 'ready', JSON.stringify(out)); return out.backup; };
  return { namespace, initialLoad: initialLoad.snapshot, act, active, check, replay, profile, exported, get controller() { return controller; },
    setDate(value: string) { now = Date.parse(value); },
    async reopen() { const before = controller.getSnapshot().save; controller.dispose(); controller = make();
      assert((await controller.ready).status === 'ready' && sameValue(controller.getSnapshot().save, before), 'Native reopen changed logical save'); return controller.getSnapshot(); },
    close() { controller.dispose(); } };
}
async function roundtrip(h: Awaited<ReturnType<typeof host>>) {
  const out = await h.exported(), original = h.controller.getSnapshot().save, target = await host();
  const preview = await target.controller.backupActions.prepare({ size: out.byteLength, text: async () => out.json });
  assert(preview.status === 'ready', JSON.stringify(preview)); committed(await target.controller.backupActions.confirm(preview.preview.preparedImportId));
  assert(sameValue(original, target.controller.getSnapshot().save), 'Import changed logical save before time reconciliation');
  const decode = decodeBackup(out.json, catalogue); assert(decode.status === 'valid', JSON.stringify(decode));
  return { target, json: out.json, budget: measureBackupBudget(decode.envelope), save: target.controller.getSnapshot().save };
}
const summary = (save: SaveDataV1, id: string) => summarizeLearning(save.profiles[id].learning.evidence, catalogue, '2026-10-13');
function render(save: SaveDataV1, id: string) { progress.render(<div className="adult-area"><ProgressView profileIdentity={save.profiles[id].identity} summaries={summary(save, id)} /></div>); }

export async function runBaseline(text: string) {
  const starter = decodeBackup(text, catalogue), h = await host();
  try {
    committed(await h.act('CreateProfile', { newProfileId: 'expanded', nickname: 'Expanded', avatarId: 'pip' }));
    const opened = await h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'E08', mode: 'suggested' }, suppressDueReviewForVisit: true }, 'expanded');
    let assistance: { status: string; value: LearningAssistance } | null = null, check: unknown = null;
    if (opened.status === 'committed') {
      const e = h.active(); const heard = await h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'assessed-text-read-aloud' }, 'expanded');
      assistance = { status: heard.status, value: h.profile().encounters[e.encounterId].assistance }; check = await h.check(h.active());
    }
    return { starter: starter.status, taskCount: catalogue.length, bindingCount: QUEST_ACTIVITY_BINDINGS.length,
      longestCanonical: Math.max(...catalogue.map(t => t.canonicalQuestionId.length)), opened, assistance, check,
      cases: cases.map(c => { const task = catalogue.find(t => t.canonicalQuestionId === c.canonicalQuestionId)!;
        const value = evaluateResponse(task, c.response as ActivityResponse);
        return { caseId: c.caseId, status: value.status, correct: value.status === 'judged' ? value.correct : null,
          expectedStatus: c.expectedStatus, expectedCorrect: c.expectedCorrect }; }) };
  } finally { h.close(); }
}
export async function runStarter(text: string) {
  const decoded = decodeBackup(text, catalogue); assert(decoded.status === 'valid', JSON.stringify(decoded));
  const original = decoded.envelope.save, h = await host(original);
  try {
    const loaded = h.initialLoad, migrated = migrateSupportedSave(decoded.envelope, 'm1', catalogue);
    assert(migrated.status === 'valid' && sameValue(migrated.envelope.save, original), 'Compatible v1 identity migration changed source');
    const rt = await roundtrip(h);
    try {
      const imported = rt.target.controller.getSnapshot(), statuses: string[] = [];
      const river = Object.values(original.profiles).find(p => p.identity.nickname.startsWith('River'))!, riverId = river.identity.profileId;
      for (const e of Object.values(river.encounters).filter(e => e.learningEpisode.status === 'completed-success')) statuses.push((await rt.target.replay(e, riverId)).status);
      statuses.push((await rt.target.act('OpenEncounter', { route: { kind: 'quest', questId: 'Q1' }, suppressDueReviewForVisit: true }, riverId)).status);
      assert(sameValue(rt.target.controller.getSnapshot().save, original), 'Replaying starter completion changed root or points');
      await rt.target.reopen();
      const unfinished = Object.values(river.encounters).find(e => e.learningEpisode.status === 'suspended')!;
      const resumed = committed(await rt.target.act('OpenEncounter', { resumeEncounterId: unfinished.encounterId, suppressDueReviewForVisit: true }, riverId));
      const resumedEncounter = rt.target.active(riverId);
      assert(sameValue(resumedEncounter, { ...unfinished, learningEpisode: { ...unfinished.learningEpisode, status: 'open' } }), 'Real starter resume changed retained identity, draft, help or opportunity');
      assert(resumed.changes.earnedPoints.lifetimeDelta === 0 && resumed.changes.earnedPoints.competitiveDelta === 0, 'Resume awarded points');
      await rt.target.reopen(); const resumedRoundtrip = await roundtrip(rt.target);
      resumedRoundtrip.target.close();
      render(original, Object.values(original.profiles).find(p => p.identity.nickname.startsWith('Moss'))!.identity.profileId);
      rt.target.setDate('2026-10-20T12:00:00Z'); const calendar = committed(await rt.target.act('ReconcileCalendar', {}));
      return { original, loaded: loaded.save, imported: imported.save, loadedToken: loaded.token, importedToken: imported.token,
        duplicateStatuses: statuses, resumedEncounter, resumeDelta: resumed.changes.earnedPoints, preCalendarJson: rt.json, budget: rt.budget, calendar: { changes: calendar.changes,
          save: calendar.snapshot.save, token: calendar.snapshot.token }, summaries: summary(original, riverId) };
    } finally { rt.target.close(); }
  } finally { h.close(); }
}

export async function runExpansion() {
  let h = await host(); const trace: unknown[] = [], forms = new Set<string>();
  try {
    committed(await h.act('CreateProfile', { newProfileId: 'expanded', nickname: 'Expanded', avatarId: 'rowan' }));
    committed(await h.act('CreateProfile', { newProfileId: 'absent', nickname: 'Not practised', avatarId: 'pip' }));
    const absent = summary(h.controller.getSnapshot().save, 'absent');
    const completeBinding = async (bindingId: string, hint = false) => {
      const b = QUEST_ACTIVITY_BINDINGS.find(b => b.bindingId === bindingId)!;
      const opened = await h.act('OpenEncounter', { route: b.role === 'story' ? { kind: 'quest', questId: b.questId, bindingId } : { kind: 'revisit', bindingId }, suppressDueReviewForVisit: true }, 'expanded');
      committed(opened); let e = h.active(); const task = taskFor(e), response = answer(task); forms.add(response.kind);
      if (hint) committed(await h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'answer-hint', hintId: task.hints[0].id }, 'expanded'));
      committed(await h.act('SaveDraft', { encounterId: e.encounterId, responseDraft: response }, 'expanded'));
      await h.reopen(); e = h.active(); assert(sameValue(e.responseDraft, response) && (!hint || e.assistance.answerHintUsed), 'Draft/help lost on native reload');
      const checked = committed(await h.check(e, response)); trace.push({ bindingId, canonicalQuestionId: e.canonicalQuestionId, response,
        delta: checked.changes.earnedPoints, token: checked.snapshot.token });
      return h.profile().encounters[e.encounterId];
    };
    for (const quest of QUESTS.filter(q => Number(q.id.slice(1)) <= 8)) for (const b of QUEST_ACTIVITY_BINDINGS.filter(b => b.questId === quest.id && b.role === 'story')) await completeBinding(b.bindingId, quest.id === 'Q4');
    const clock = await completeBinding('q9-story-m08-clock', true), partialBefore = h.controller.getSnapshot().save;
    assert(!h.profile().world.completedQuestIds.includes('Q9') && !h.profile().rewards.questReceipts.some(r => r.questId === 'Q9'), 'Clock alone awarded Q9');
    committed(await h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M08', mode: 'repeat' }, suppressDueReviewForVisit: true }, 'expanded'));
    const repeat = h.active(); assert(repeat.canonicalQuestionId === clock.canonicalQuestionId && repeat.bindingProvenance === null, 'Optional repeat must be the same clock without a story binding');
    const optional = committed(await h.check(repeat)); assert(optional.changes.earnedPoints.lifetimeDelta === 0, 'Familiar optional practice renewed rewards');
    assert(!h.profile().encounters[clock.encounterId], 'Actual successful repeat did not compact the older same-canonical encounter');
    // Through the real unbound selector, complete optional work until it chooses
    // the still-missing sequence task. Hints keep this bounded core practice from
    // becoming an independent-success promotion fixture. No pool is filtered.
    const sequencePool = QUEST_ACTIVITY_BINDINGS.find(b => b.bindingId === 'q9-story-m08-sequence')!.taskIds;
    const optionalFresh: { canonicalQuestionId: string; delta: unknown }[] = [];
    let optionalSequence: EncounterSave | null = null;
    for (let count = 0; count < catalogue.filter(t => t.skillId === 'M08').length && !optionalSequence; count++) {
      committed(await h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M08', mode: 'suggested' }, suppressDueReviewForVisit: true }, 'expanded'));
      const e = h.active(), task = taskFor(e); assert(e.bindingProvenance === null, 'Optional work gained story provenance');
      committed(await h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'answer-hint', hintId: task.hints[0].id }, 'expanded'));
      const checked = committed(await h.check(h.active()));
      assert(checked.changes.earnedPoints.lifetimeDelta === 10 && checked.changes.earnedPoints.competitiveDelta === 10, 'Fresh hinted optional work must retain ordinary question awards only');
      optionalFresh.push({ canonicalQuestionId: e.canonicalQuestionId, delta: checked.changes.earnedPoints });
      assert(!h.profile().world.completedStoryBindingIds.includes('q9-story-m08-sequence') && !h.profile().rewards.questReceipts.some(r => r.questId === 'Q9'), 'Optional success completed a missing required binding');
      if (sequencePool.includes(e.canonicalQuestionId)) optionalSequence = h.profile().encounters[e.encounterId];
    }
    assert(optionalSequence, 'Delivered optional selector did not reach the real sequence pool');
    const partialCompacted = h.controller.getSnapshot().save; await h.reopen();
    const partial = await roundtrip(h); h.close(); h = partial.target;
    assert(sameValue(h.controller.getSnapshot().save, partialCompacted), 'Partial required set lost through import');
    const final = await completeBinding('q9-story-m08-sequence');
    assert(final.canonicalQuestionId === optionalSequence.canonicalQuestionId, 'Final story case must be the exact optionally succeeded canonical sequence');
    assert(final.lastCommittedCheck?.delta.lifetimeDelta === 20 && final.lastCommittedCheck.delta.competitiveDelta === 0,
      'Final required familiar success must award the quest once without renewed question points');
    const beforeDuplicate = h.controller.getSnapshot(); const duplicate = await h.replay(final);
    assert(duplicate.status === 'already-applied' && sameValue(h.controller.getSnapshot(), beforeDuplicate), 'Final required duplicate changed state');
    await h.reopen(); const afterReloadDuplicate = await h.replay(final);
    for (const b of QUEST_ACTIVITY_BINDINGS.filter(b => b.questId === 'Q10' && b.role === 'story')) await completeBinding(b.bindingId);
    await completeBinding('q2-revisit-e06-punctuation');
    for (const skill of SKILLS) {
      committed(await h.act('OpenEncounter', { route: { kind: 'practice', skillId: skill.skillId, mode: 'easier' }, suppressDueReviewForVisit: true }, 'expanded'));
      committed(await h.check(h.active()));
    }
    const choiceTrace: unknown[] = [];
    for (const cosmetic of COSMETICS) {
      const value = { ...h.profile().creative, [cosmetic.target]: cosmetic.id };
      const result = committed(await h.act('ChooseCosmetic', { choice: { kind: 'appearance', value } }, 'expanded'));
      choiceTrace.push({ id: cosmetic.id, creative: result.snapshot.save.profiles.expanded.creative });
    }
    for (const [index, decoration] of CREATIVE_CHOICES.decorations.entries()) {
      const socket = CREATIVE_CHOICES.sockets[index].id;
      const value = { ...h.profile().creative, placements: { ...h.profile().creative.placements, [socket]: decoration.id } };
      committed(await h.act('ChooseCosmetic', { choice: { kind: 'appearance', value } }, 'expanded'));
    }
    const finalSave = h.controller.getSnapshot().save; await h.reopen(); const finalRoundtrip = await roundtrip(h);
    try {
      render(finalSave, 'expanded');
      return { save: finalSave, reloaded: h.controller.getSnapshot().save, roundtrip: finalRoundtrip.save, finalJson: finalRoundtrip.json,
        budget: finalRoundtrip.budget, partialBefore, partialCompacted, partialImported: partial.save, partialJson: partial.json,
        compactedEncounterId: clock.encounterId, optionalDelta: optional.changes.earnedPoints,
        optionalFresh, optionalSequenceCanonical: optionalSequence.canonicalQuestionId, finalSequenceCanonical: final.canonicalQuestionId,
        duplicateStatus: duplicate.status, afterReloadDuplicateStatus: afterReloadDuplicate.status, trace, forms: [...forms], choiceTrace,
        summaries: summary(finalSave, 'expanded'), absentSummaries: absent,
        displays: STORY_DISPLAYS.filter(d => d.requiresAll.every(q => h.profile().world.completedQuestIds.includes(q))),
        library: resolveWorldView({ world: h.profile().world, creative: h.profile().creative, entitlements: h.profile().rewards.entitlementIds, sceneId: 'whispering-library', milestone: 'M2' }),
        workshop: resolveWorldView({ world: h.profile().world, creative: h.profile().creative, entitlements: h.profile().rewards.entitlementIds, sceneId: 'tinkers-workshop', milestone: 'M2' }),
        olderCatalogueResult: validateSave(finalSave, STARTER_TASKS).status };
    } finally { finalRoundtrip.target.close(); }
  } finally { h.close(); }
}

export async function runListening() {
  const results = [];
  for (const skillId of ['E02', 'E03', 'E04', 'E05', 'E08', 'E09', 'E10'] as SkillId[]) for (const mode of ['neutral', 'assessed', 'hinted'] as const) {
    const h = await host();
    try {
      committed(await h.act('CreateProfile', { newProfileId: 'expanded', nickname: `${skillId} ${mode}`, avatarId: 'iona' }));
      committed(await h.act('OpenEncounter', { route: { kind: 'practice', skillId: skillId, mode: 'suggested' }, suppressDueReviewForVisit: true }, 'expanded'));
      let e = h.active(); const task = taskFor(e);
      acknowledged(await h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: mode === 'neutral' ? 'instruction-read-aloud' : 'assessed-text-read-aloud' }, 'expanded'));
      if (mode === 'hinted') committed(await h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'answer-hint', hintId: task.hints[0].id }, 'expanded'));
      await h.reopen(); e = h.active(); const reloadedAssistance = e.assistance;
      acknowledged(await h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'instruction-read-aloud' }, 'expanded'));
      const checked = committed(await h.check(h.active())); const rt = await roundtrip(h);
      try { results.push({ skillId, mode, canonicalQuestionId: e.canonicalQuestionId, reloadedAssistance,
        delta: checked.changes.earnedPoints, summary: summary(rt.save, 'expanded').find(s => s.skillId === skillId),
        save: rt.save, json: rt.json }); } finally { rt.target.close(); }
    } finally { h.close(); }
  }
  const original = await host();
  try {
    committed(await original.act('CreateProfile', { newProfileId: 'expanded', nickname: 'M1 spellbook', avatarId: 'iona' }));
    for (const questId of ['Q1', 'Q2']) {
      committed(await original.act('OpenEncounter', { route: { kind: 'quest', questId }, suppressDueReviewForVisit: true }, 'expanded'));
      const e = original.active();
      if (questId === 'Q1') committed(await original.check(e));
      else {
        const before = original.controller.getSnapshot();
        const forbidden = await original.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'assessed-text-read-aloud' }, 'expanded');
        assert(forbidden.status === 'invalid' && sameValue(original.controller.getSnapshot(), before), 'Original M1 assessed narration must remain unavailable without changing saved state');
        acknowledged(await original.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'instruction-read-aloud' }, 'expanded'));
        await original.reopen(); const reloadedAssistance = original.active().assistance;
        const checked = committed(await original.check(original.active())); const rt = await roundtrip(original);
        try { results.push({ skillId: 'E06', mode: 'm1-forbidden', canonicalQuestionId: e.canonicalQuestionId, reloadedAssistance,
          delta: checked.changes.earnedPoints, summary: summary(rt.save, 'expanded').find(s => s.skillId === 'E06'), save: rt.save, json: rt.json }); }
        finally { rt.target.close(); }
      }
    }
  } finally { original.close(); }
  return results;
}

declare global { interface Window { expandedFixture: { runBaseline: typeof runBaseline; runStarter: typeof runStarter; runExpansion: typeof runExpansion; runListening: typeof runListening } } }
window.expandedFixture = { runBaseline, runStarter, runExpansion, runListening };
