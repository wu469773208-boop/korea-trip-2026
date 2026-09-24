import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { gzipSync } from 'node:zlib';
const html=fs.readFileSync('public/index.html','utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(code);
const elements=new Map();
const el=id=>{
 if(!elements.has(id))elements.set(id,{textContent:'',href:'',addEventListener(){},classList:{add(){},remove(){}}});
 return elements.get(id);
};
const ctx=vm.createContext({
 document:{documentElement:{dataset:{}},getElementById:el,querySelectorAll:()=>[],addEventListener(){}},
 Date,Intl,setInterval(){},setTimeout(){},console
});
vm.runInContext(code,ctx);
const evaluate=s=>vm.runInContext(s,ctx);
assert.equal(evaluate('EVENTS.length'),84);
assert.equal(evaluate('EVENTS.every((e,i,a)=>i===0||Date.parse(e.at)>Date.parse(a[i-1].at))'),true,'events chronological');
assert.equal(evaluate('EVENTS.every(e=>/[+]0[89]:00$/.test(e.at))'),true,'explicit UTC offsets');
assert.equal(evaluate('Date.parse("2026-10-01T14:00:00+08:00")'),Date.parse('2026-10-01T06:00:00Z'));
assert.equal(evaluate('Date.parse("2026-10-07T09:15:00+09:00")'),Date.parse('2026-10-07T00:15:00Z'));
assert.equal(evaluate('getNextEvent(Date.parse("2026-10-03T03:59:59Z")).title'),'KTX-EUM 883 · 清凉里 → 正东津');
assert.equal(evaluate('getNextEvent(Date.parse("2026-10-07T03:59:59Z")).title'),'抵达香港 T1');
assert.equal(evaluate('getNextEvent(Date.parse("2026-10-07T04:00:00Z"))'),null);
assert.equal(evaluate('JSON.stringify(countdownParts(90061000))'),'[1,1,1,1]');
assert.equal(evaluate('JSON.stringify(countdownParts(-1000))'),'[0,0,0,0]');
assert.equal(evaluate('themeForHour(7)'),'light');assert.equal(evaluate('themeForHour(19)'),'dark');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'unique anchors');
for(const m of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(m[1]),`broken anchor ${m[1]}`);
assert(!/<(?:script|img|iframe)[^>]+src=["']https?:/i.test(html),'no remote runtime assets');
assert(!/<link[^>]+rel="stylesheet"/i.test(html));
assert(!/\bfetch\(|XMLHttpRequest|sessionStorage/.test(html),'no network-backed or session-only state');
assert(html.includes("const TODO_STORAGE_KEY='korea-trip-2026-checklist-v1'"),'persistent checklist storage');
assert(html.includes("box.type='checkbox'"),'interactive checklist controls');
for(const sensitive of ['17503069257','ZHANG/XINXIN','WU/XIAOSHUANG','EJ*****68','EE*****98','7–9A','7–9B'])assert(!html.includes(sensitive),'no private ticket data');
const routeLinks=[...html.matchAll(/href="(https:\/\/www.google.com\/maps\/dir\/\?[^\"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&')));
for(const u of routeLinks){
 assert.equal(u.searchParams.get('api'),'1');assert(u.searchParams.get('destination'));
 const waypoints=u.searchParams.get('waypoints');if(waypoints)assert(waypoints.split('|').length<=9);
}
assert.equal((html.match(/class="day paper"/g)||[]).length,7);
assert.equal((html.match(/class="event"/g)||[]).length,84);
console.log(`PASS: ${process.env.TZ||'system timezone'}; 84 timed events, 7 days, ${routeLinks.length} map links, static/offline integrity; ${Buffer.byteLength(html)} bytes, gzip ${gzipSync(html).length} bytes.`);
