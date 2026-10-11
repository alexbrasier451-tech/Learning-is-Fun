import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const build = 'b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1';
const starterPath = resolve(`artifacts/playtests/M1/${build}/boundaries/starter-save.json`);
async function nativeRoot(page: Page): Promise<any> {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('learning-is-fun:/Learning-is-Fun/:save');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction('records');
      const read = tx.objectStore('records').get('root');
      read.onsuccess = () => resolve(read.result); read.onerror = () => reject(read.error);
      tx.oncomplete = () => db.close();
    };
  }));
}
async function adult(page: Page) {
  await page.getByRole('button', { name: 'Grown-ups', exact: true }).click();
  await page.getByRole('button', { name: 'For grown-ups', exact: true }).click();
  await page.getByRole('button', { name: 'Continue to adult area', exact: true }).click();
}
async function importStarter(page: Page) {
  await page.goto('./'); await adult(page);
  await page.locator('input[type=file]').setInputFiles(starterPath);
  await page.getByRole('button', { name: 'Confirm whole-save replacement', exact: true }).click();
  await expect(page.getByRole('button', { name: 'River Boundary Choose explorer', exact: true })).toBeVisible();
}

test('published genuine M1 backup replacement and owner-defined truncated rejection', async ({ page }, info) => {
  await importStarter(page);
  const donor = JSON.parse(await readFile(starterPath, 'utf8'));
  const imported = await nativeRoot(page);
  expect(imported.save).toEqual(donor.save); expect(imported.revision).toBe(0);
  await adult(page);
  // This exact rejection recipe is supplied by WP04 backup-roundtrip.ts:77.
  await page.locator('input[type=file]').setInputFiles({name:'truncated.json',mimeType:'application/json',buffer:Buffer.from((await readFile(starterPath,'utf8')).slice(0,-1))});
  await expect(page.getByText('Not imported. The backup is malformed or truncated.', { exact: true })).toBeVisible();
  expect(await nativeRoot(page)).toEqual(imported);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download current backup', exact: true }).click();
  const download = await pending, output = info.outputPath('normal-reexport.json');
  await download.saveAs(output);
  expect(JSON.parse(await readFile(output, 'utf8')).save).toEqual(donor.save);
  await info.attach('whole-save-reexport', {path:output,contentType:'application/json'});
  await info.attach('native-import-and-rejection', {body:JSON.stringify(imported),contentType:'application/json'});
});

// Accepted producer inputs cabce3f399e3f81a8815f946e49efd0477f736b6.
// No fixture construction or reward/progression mutation belongs to this observer.
const fixtureRoot = resolve('artifacts/playtests/M1/producer-fixtures');
async function importBoundary(page: Page, file: string, instant: string, explorer: string, info: TestInfo) {
  await page.clock.setFixedTime(new Date(instant));
  await page.goto('./');
  await page.getByRole('button', {name:'Help',exact:true}).click();
  await expect(page.getByText(`Game version: ${build}`, {exact:true})).toBeVisible();
  await page.getByRole('button', {name:'Back to my story',exact:true}).click();
  await expect(page.getByText('Ready offline',{exact:true})).toBeVisible({timeout:60000});
  const worker = await page.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration(location.pathname);
    return await new Promise<any>((resolve,reject) => {
      const c = new MessageChannel(), timer = setTimeout(() => reject(Error('worker timeout')),10000);
      c.port1.onmessage = e => { clearTimeout(timer); resolve(e.data); c.port1.close(); };
      r!.active!.postMessage({type:'OFFLINE_INVENTORY_PROBE',requestId:'boundary-resume'},[c.port2]);
    });
  });
  expect(worker).toMatchObject({buildId:build,complete:true});
  await adult(page);
  await page.locator('input[type=file]').setInputFiles(resolve(fixtureRoot,file));
  await page.getByRole('button',{name:'Confirm whole-save replacement',exact:true}).click();
  await expect(page.getByRole('button',{name:`${explorer} Choose explorer`,exact:true})).toBeVisible();
  const imported = await nativeRoot(page);
  const fixture = JSON.parse(await readFile(resolve(fixtureRoot,file),'utf8'));
  expect(imported.save).toEqual(fixture.save);
  await info.attach('fixture-import', {body:JSON.stringify({file,instant,worker,imported,browser:page.context().browser()?.version(),viewport:page.viewportSize(),seeded:true}),contentType:'application/json'});
  await page.getByRole('button',{name:`${explorer} Choose explorer`,exact:true}).click();
  return imported;
}
async function exportObserved(page: Page, info: TestInfo, label: string) {
  await adult(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button',{name:'Download current backup',exact:true}).click();
  const output = info.outputPath(`${label}.json`); await (await pending).saveAs(output);
  const exported = JSON.parse(await readFile(output,'utf8'));
  expect(exported.save).toEqual((await nativeRoot(page)).save);
  await info.attach(label,{path:output,contentType:'application/json'});
  return exported.save;
}
async function punctuation(page: Page, slot: string, mark: string) {
  await page.getByRole('button',{name:`Choose ${mark}`,exact:true}).click();
  await page.getByRole('button',{name:`Place selected mark in ${slot}`,exact:true}).click();
  await page.getByRole('button',{name:'Check my idea',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Your idea worked!',exact:true})).toBeVisible();
}
async function bridgeSuccess(page: Page) {
  while (await page.getByRole('button',{name:'Remove plank 1',exact:true}).count())
    await page.getByRole('button',{name:'Remove plank 1',exact:true}).click();
  for(let i=0;i<2;i++) {
    await page.getByRole('button',{name:'Choose 6 metre plank',exact:true}).click();
    await page.getByRole('button',{name:'Place selected plank at the end',exact:true}).click();
  }
  await page.getByRole('button',{name:'Check my idea',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Your idea worked!',exact:true})).toBeVisible();
}
const slotCount = (save:any,id:string) => Object.keys(save.competition.currentSlots[id] ?? {}).length;

for (const continuous of [true,false]) test(`accepted fixture cap ${continuous?'30 then continuous 31':'independent 31'}`, async ({page},info) => {
  test.setTimeout(90000);
  const initial = await importBoundary(page,continuous?'cap-before-30.json':'cap-before-31.json','2026-07-01T11:00:00.000Z','Cap Explorer',info);
  await page.getByRole('button',{name:'Resume Wake the Whispering Library',exact:true}).click();
  if(continuous) {
    await punctuation(page,'admiration','.');
    const thirty = await nativeRoot(page);
    expect(thirty.save.profiles['boundary-cap'].rewards.lifetimePoints).toBe(660);
    expect(thirty.save.competition.currentScores['boundary-cap']).toBe(600);
    expect(slotCount(thirty.save,'boundary-cap')).toBe(30);
    await info.attach('thirtieth-native',{body:JSON.stringify(thirty),contentType:'application/json'});
    await exportObserved(page,info,'thirtieth-export');
    await page.getByRole('button',{name:'Exit adult area',exact:true}).click();
    await page.getByRole('button',{name:'Whispering Library',exact:true}).click();
    await page.getByRole('button',{name:'Try some practice',exact:true}).click();
  }
  await expect(page.getByRole('button',{name:'Place selected mark in warning',exact:true})).toBeVisible();
  const before31 = await nativeRoot(page);
  await punctuation(page,'warning','!');
  const after = await nativeRoot(page), p = after.save.profiles['boundary-cap'];
  expect(p.rewards.lifetimePoints).toBe(680);
  expect(after.save.competition).toEqual(before31.save.competition);
  expect(p.rewards.questReceipts).toHaveLength(3);
  expect(after.save.profiles['boundary-cap-other']).toEqual(initial.save.profiles['boundary-cap-other']);
  const canonical = 'lif.english.punctuation.r1.authored-%5B%22spellbook-06%22%2C%5B%5D%5D';
  const e:any = Object.values(p.encounters).find((x:any)=>x.canonicalQuestionId===canonical);
  expect(e.lastCommittedCheck.delta).toMatchObject({lifetimeDelta:20,competitiveDelta:0,consumedSlot:null});
  await expect(page.getByRole('button',{name:'Check my idea',exact:true})).toBeDisabled();
  await info.attach('capped-native',{body:JSON.stringify({before31,after}),contentType:'application/json'});
  await info.attach('capped-screen',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  await exportObserved(page,info,'capped-export');
  await page.reload(); await page.getByRole('button',{name:'Cap Explorer Choose explorer',exact:true}).click();
  expect((await nativeRoot(page)).save.profiles['boundary-cap'].rewards).toEqual(p.rewards);
});

for (const fromBefore of [true,false]) test(`accepted fixture summer ${fromBefore?'whole Sunday hinted sequence':'saved wrong shortcut'}`, async ({page},info) => {
  test.setTimeout(90000);
  const initial = await importBoundary(page,fromBefore?'summer-sunday-before-check.json':'summer-sunday-wrong.json','2026-07-05T22:59:59.000Z','Sunday Explorer',info);
  await page.getByRole('button',{name:'Resume A Bridge Back Home',exact:true}).click();
  if(fromBefore) {
    await page.getByRole('button',{name:'Choose 1 metre plank',exact:true}).click();
    await page.getByRole('button',{name:'Place selected plank at the end',exact:true}).click();
    await page.getByRole('button',{name:'Check my idea',exact:true}).click();
    await expect(page.getByRole('heading',{name:'A useful step. Keep exploring.',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Ask Pip for a hint',exact:true}).click();
    await expect.poll(async()=> (await nativeRoot(page)).save.profiles['boundary-summer'].encounters['summer-encounter-3'].assistance.answerHintUsed).toBe(true);
  }
  const sunday = await nativeRoot(page);
  expect(sunday.save.profiles['boundary-summer'].rewards.lifetimePoints).toBe(5);
  expect(sunday.save.competition.currentScores['boundary-summer']).toBe(5);
  await exportObserved(page,info,'sunday-export');
  await page.clock.setFixedTime(new Date('2026-07-05T23:00:00.000Z'));
  await page.reload(); await page.getByRole('button',{name:'Sunday Explorer Choose explorer',exact:true}).click();
  await page.getByRole('button',{name:'Resume A Bridge Back Home',exact:true}).click();
  await expect(page.getByRole('button',{name:'Check my idea',exact:true})).toBeEnabled();
  const monday = await nativeRoot(page);
  expect(monday.save.competition.latestOpenedWeek).toBe('2026-07-06');
  expect(monday.save.competition.archives).toHaveLength(1);
  expect(monday.save.competition.archives[0].entries[0]).toMatchObject({points:5,rank:1,medal:'gold'});
  await bridgeSuccess(page);
  const after = await nativeRoot(page), p=after.save.profiles['boundary-summer'], e=p.encounters['summer-encounter-3'];
  expect(p.rewards.lifetimePoints).toBe(30);
  expect(after.save.competition).toEqual(monday.save.competition);
  expect(e).toMatchObject({opportunityId:'summer-opportunity-3',validChecks:2,firstCheckCorrect:false,learningEpisode:{ordinal:1,status:'completed-success'}});
  expect(e.lastCommittedCheck.delta).toMatchObject({lifetimeDelta:25,competitiveDelta:0,consumedSlot:null});
  expect(e.assistance.answerHintUsed).toBe(fromBefore);
  expect(p.personalRecords).toMatchObject({best:{points:5,week:'2026-06-29'},medals:{gold:1,silver:0,bronze:0}});
  expect(after.save.profiles['boundary-summer-other']).toEqual(initial.save.profiles['boundary-summer-other']);
  await info.attach('summer-native',{body:JSON.stringify({sunday,monday,after}),contentType:'application/json'});
  await info.attach('summer-screen',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  await exportObserved(page,info,'monday-export');
});

for (const days of [3,7]) test(`accepted fixture genuine plus ${days} due review`, async ({page},info) => {
  test.setTimeout(90000);
  const date=days===3?'2026-07-06':'2026-07-13', total=days===3?140:200;
  const initial=await importBoundary(page,`review-plus-${days}-ready.json`,`${date}T11:00:00.000Z`,'Review Explorer',info);
  await page.getByRole('button',{name:'Choose some practice',exact:true}).click();
  await expect(page.getByRole('button',{name:'Choose 6 metre plank',exact:true})).toBeVisible();
  const opened=await nativeRoot(page), p=opened.save.profiles['boundary-review'];
  const e:any=Object.values(p.encounters).find((x:any)=>x.learningEpisode.status==='open');
  expect(e).toMatchObject({canonicalQuestionId:'lif.math.bridge.r1.total-12',selectionReason:'due-review',familiar:true,bindingProvenance:null,reviewReference:{dueLocalDate:date}});
  expect(e.opportunityId).not.toBe(days===3?'review-opportunity-3':'review-opportunity-10');
  expect(p.rewards.tracksByCanonical[e.canonicalQuestionId].currentOpportunity.ordinal).toBe(days===3?2:3);
  await bridgeSuccess(page);
  const after=await nativeRoot(page), completed=after.save.profiles['boundary-review'];
  expect(completed.rewards.lifetimePoints).toBe(total);
  expect(after.save.competition.currentScores['boundary-review']).toBe(20);
  expect(slotCount(after.save,'boundary-review')).toBe(1);
  expect(completed.rewards.questReceipts).toEqual(initial.save.profiles['boundary-review'].rewards.questReceipts);
  expect(after.save.competition.archives).toEqual(initial.save.competition.archives);
  expect(completed.learning.evidence.M01.bands.support.reviewDueLocalDate).toBe(days===3?'2026-07-13':'2026-07-20');
  await expect(page.getByRole('button',{name:'Check my idea',exact:true})).toBeDisabled();
  await info.attach('review-native',{body:JSON.stringify({initial,opened,after}),contentType:'application/json'});
  await info.attach('review-screen',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  await exportObserved(page,info,'review-export');
  await page.reload(); await page.getByRole('button',{name:'Review Explorer Choose explorer',exact:true}).click();
  const replay=await nativeRoot(page);
  expect(replay.save.profiles['boundary-review'].rewards).toEqual(completed.rewards);
  expect(replay.save.competition).toEqual(after.save.competition);
  await info.attach('same-week-redisplay',{body:JSON.stringify(replay),contentType:'application/json'});
});

test('published native aborted Check retains draft and retries exact submission once', async ({ page }, info) => {
  await importStarter(page);
  await page.getByRole('button', { name: 'River Boundary Choose explorer', exact: true }).click();
  await page.getByRole('button', { name: 'Resume The Merchant’s Welcome · optional challenge', exact: true }).click();
  await page.getByRole('button', { name: 'Add one apple', exact: true }).click();
  await page.getByRole('button', { name: 'Add one pear', exact: true }).click();
  const before = await nativeRoot(page);
  await page.evaluate(() => {
    const w = window as any, put = IDBObjectStore.prototype.put;
    w.boundaryCandidates = []; let abort = true;
    w.restoreBoundaryPut = () => { IDBObjectStore.prototype.put = put; };
    IDBObjectStore.prototype.put = function (...args) {
      const request = put.apply(this, args);
      if (this.transaction.db.name === 'learning-is-fun:/Learning-is-Fun/:save') {
        w.boundaryCandidates.push(structuredClone(args[0]));
        if (abort) { abort = false; this.transaction.abort(); }
      }
      return request;
    };
  });
  await page.getByRole('button', { name: 'Check my idea', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retry saved action', exact: true })).toBeVisible();
  expect(await nativeRoot(page)).toEqual(before);
  await expect(page.getByRole('status', { name: 'apples count', exact: true })).toHaveText('2');
  await expect(page.getByRole('status', { name: 'pears count', exact: true })).toHaveText('1');
  await page.getByRole('button', { name: 'Retry saved action', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your idea worked!', exact: true })).toBeVisible();
  const after = await nativeRoot(page);
  const candidates = await page.evaluate(() => { const w = window as any; w.restoreBoundaryPut(); return w.boundaryCandidates; });
  expect(candidates).toHaveLength(2); expect(candidates[0]).toEqual(candidates[1]);
  expect(after).toEqual(candidates[1]); expect(after.revision).toBe(before.revision + 1);
  const riverId = Object.keys(before.save.profiles).find(id => before.save.profiles[id].identity.nickname === 'River Boundary')!;
  expect(after.save.profiles[riverId].rewards.lifetimePoints - before.save.profiles[riverId].rewards.lifetimePoints).toBe(5);
  expect(after.save.competition.currentScores[riverId] - before.save.competition.currentScores[riverId]).toBe(5);
  await info.attach('real-native-abort-retry', {body:JSON.stringify({before,after,candidates}),contentType:'application/json'});
});
