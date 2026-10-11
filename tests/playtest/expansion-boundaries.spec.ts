import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const build='011d2afe6e8a2215d4bebdd21787cfaa4f7a9fc9-pages-38177521884-1';
const evidenceRoot=resolve(`artifacts/playtests/M2/${build}/boundaries`);
const donorPath=resolve(evidenceRoot,'expanded-observer-export.json');
const river='6d6f8fd7-46a7-438c-8129-71d152f1c0e2';
const moss='7860f109-c161-4b73-8b92-02f5c4fa8338';

// These fresh-context continuations consume a normal UI export from the actual
// upgraded native profile. They do not manufacture an M1 upgrade or fixture state.
async function nativeRoot(page:Page):Promise<any> {
  return page.evaluate(()=>new Promise((resolve,reject)=>{
    const r=indexedDB.open('learning-is-fun:/Learning-is-Fun/:save');r.onerror=()=>reject(r.error);
    r.onsuccess=()=>{const db=r.result,tx=db.transaction('records'),q=tx.objectStore('records').get('root');let value:unknown;
      q.onsuccess=()=>value=q.result;tx.oncomplete=()=>{db.close();resolve(value);};tx.onabort=()=>reject(tx.error);};
  }));
}
async function adult(page:Page) {
  for(const name of ['Grown-ups','For grown-ups','Continue to adult area'])await page.getByRole('button',{name,exact:true}).click();
}
async function importExpanded(page:Page,instant:string) {
  await page.clock.setFixedTime(new Date(instant));
  await page.addInitScript(()=>{const w=window as any,Native=AudioContext;w.expansionAudioContexts=0;
    window.AudioContext=class extends Native{constructor(...args:ConstructorParameters<typeof AudioContext>){super(...args);w.expansionAudioContexts++;}};});
  await page.goto('./');await page.getByRole('button',{name:'Help',exact:true}).click();
  await expect(page.getByText('Game version: '+build,{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Back to my story',exact:true}).click();
  await expect(page.getByText('Ready offline',{exact:true})).toBeVisible({timeout:60000});
  const worker=await page.evaluate(async()=>{
    const r=await navigator.serviceWorker.getRegistration(location.pathname);
    return new Promise<any>(resolve=>{const c=new MessageChannel();c.port1.onmessage=e=>{c.port1.close();resolve(e.data);};
      r!.active!.postMessage({type:'OFFLINE_INVENTORY_PROBE',requestId:'m2-fresh-boundary'},[c.port2]);});
  });
  expect(worker).toMatchObject({buildId:build,complete:true});
  await adult(page);await page.locator('input[type=file]').setInputFiles(donorPath);
  await page.getByRole('button',{name:'Confirm whole-save replacement',exact:true}).click();
  await expect(page.getByRole('button',{name:'River Boundary Choose explorer',exact:true})).toBeVisible();
  const donor=JSON.parse(await readFile(donorPath,'utf8')),imported=await nativeRoot(page);
  expect(imported.save).toEqual(donor.save);expect(imported.revision).toBe(0);
  return {donor,imported,worker,instant};
}

test('M2 expanded normal import reexport and remembered silence',async({page,context},info)=>{
  test.setTimeout(90000);
  const imported=await importExpanded(page,'2026-10-11T22:35:00.000Z');
  await adult(page);const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download current backup',exact:true}).click();
  const path=info.outputPath('expanded-reexport.json');await(await download).saveAs(path);
  expect(JSON.parse(await readFile(path,'utf8')).save).toEqual(imported.donor.save);
  await page.reload();
  await page.getByRole('button',{name:'River Boundary Choose explorer',exact:true}).click();
  await page.getByRole('button',{name:'Resume Shelve the Lost Stories',exact:true}).click();
  await expect(page.getByRole('button',{name:'Check my idea',exact:true})).toBeEnabled();
  const resumed=await nativeRoot(page),original:any=Object.values(imported.donor.save.profiles[river].encounters).find((e:any)=>e.descriptor.authoredKey==='e02-accept-delivery');
  const retained=resumed.save.profiles[river].encounters[original.encounterId];
  expect(retained.opportunityId).toBe(original.opportunityId);expect(retained.validChecks).toBe(1);
  expect(retained.assistance).toEqual(original.assistance);expect(retained.responseDraft).toEqual(original.responseDraft);
  expect(resumed.save.profiles[river].rewards).toEqual(imported.donor.save.profiles[river].rewards);
  expect(resumed.save.profiles[river].creative).toEqual(imported.donor.save.profiles[river].creative);
  expect(resumed.save.profiles[moss]).toEqual(imported.donor.save.profiles[moss]);
  expect(await page.evaluate(()=>(window as any).expansionAudioContexts)).toBe(0);
  await info.attach('normal-expanded-roundtrip',{body:JSON.stringify({build,browser:context.browser()?.version(),viewport:page.viewportSize(),...imported,resumed}),contentType:'application/json'});
  await info.attach('expanded-reexport',{path,contentType:'application/json'});
  await info.attach('roundtrip-render',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});

test('M2 later-week unfinished choice and read-only Festival',async({page,context},info)=>{
  test.setTimeout(90000);const touch=info.project.name.startsWith('T1');
  const press=async(name:string)=>{const b=page.getByRole('button',{name,exact:true});if(touch)await b.tap();else await b.click();};
  const imported=await importExpanded(page,'2026-10-12T11:00:00.000Z');
  await press('River Boundary Choose explorer');
  await expect.poll(async()=>(await nativeRoot(page)).save.competition.latestOpenedWeek).toBe('2026-10-12');
  const monday=await nativeRoot(page);
  expect(monday.save.competition.archives).toHaveLength(1);
  expect(monday.save.competition.archives[0]).toMatchObject({week:'2026-10-05',entries:[{profileId:river,points:105,rank:1,medal:'gold'}]});
  expect(monday.save.profiles[river].rewards).toEqual(imported.donor.save.profiles[river].rewards);
  expect(monday.save.profiles[river].world).toEqual(imported.donor.save.profiles[river].world);
  expect(monday.save.profiles[river].creative).toEqual(imported.donor.save.profiles[river].creative);
  await press('Resume Shelve the Lost Stories');await expect(page.getByRole('button',{name:'Check my idea',exact:true})).toBeEnabled();
  const before=await nativeRoot(page),original:any=Object.values(imported.donor.save.profiles[river].encounters).find((e:any)=>e.descriptor.authoredKey==='e02-accept-delivery');
  await press('Choose accept');await press('Place selected option in word');await press('Check my idea');
  await expect(page.getByRole('heading',{name:'Your idea worked!',exact:true})).toBeVisible();
  const after=await nativeRoot(page),e=after.save.profiles[river].encounters[original.encounterId];
  expect(e).toMatchObject({opportunityId:original.opportunityId,validChecks:2,assistance:original.assistance});
  expect(e.lastCommittedCheck.delta).toMatchObject({lifetimeDelta:25,competitiveDelta:0,consumedSlot:null});
  expect(after.save.profiles[river].rewards.lifetimePoints).toBe(210);
  expect(after.save.profiles[river].world.completedQuestIds).toContain('Q6');
  expect(after.save.competition).toEqual(before.save.competition);
  expect(after.save.profiles[river].personalRecords).toEqual(monday.save.profiles[river].personalRecords);
  await press('Leave activity');const festivalBefore=await nativeRoot(page);
  await press('Visit the Festival');await expect(page.getByRole('heading',{name:'Village Festival',exact:true})).toBeVisible();
  await info.attach('festival-render',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  await press('Skip Festival');await press('Replay the Festival');await page.keyboard.press('Escape');
  expect(await nativeRoot(page)).toEqual(festivalBefore);
  await page.reload();await press('River Boundary Choose explorer');await press('Visit the Festival');
  expect((await nativeRoot(page)).save).toEqual(festivalBefore.save);
  expect(await page.evaluate(()=>(window as any).expansionAudioContexts)).toBe(0);
  await info.attach('calendar-choice-festival',{body:JSON.stringify({build,browser:context.browser()?.version(),viewport:page.viewportSize(),touch,...imported,monday,before,after,festivalBefore,final:await nativeRoot(page)}),contentType:'application/json'});
});
