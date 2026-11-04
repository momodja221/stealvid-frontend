import test from 'node:test';import assert from 'node:assert/strict';
import {platformForUrl,stripeSupportUrl,safeMediaUrl} from '../src/platforms.js';
test('the four supported networks are admitted, including short Facebook shares',()=>{
 const cases=[['https://vm.tiktok.com/abc','tiktok'],['https://www.instagram.com/reel/abc/','instagram'],['https://x.com/MoDjamil/status/123?s=20','x'],['https://www.facebook.com/share/r/1CiTUuYWij/?mibextid=wwXIfr','facebook'],['https://fb.watch/abc/','facebook']];
 for(const [url,id] of cases)assert.equal(platformForUrl(url)?.id,id)
});
test('YouTube and unsafe or lookalike domains are rejected',()=>{for(const url of ['https://youtube.com/shorts/abc','https://youtu.be/abc','http://facebook.com/reel/1','https://facebook.com.evil.example/reel/1','https://user:pass@facebook.com/reel/1','https://facebook.com:8443/reel/1','javascript:alert(1)'])assert.equal(platformForUrl(url),null)});
test('only hosted Stripe payment links are accepted',()=>{assert.equal(stripeSupportUrl('https://buy.stripe.com/example'),'https://buy.stripe.com/example');for(const value of [undefined,'','https://buy.stripe.com.evil.example/a','http://buy.stripe.com/a','https://user:pass@buy.stripe.com/a','javascript:alert(1)'])assert.equal(stripeSupportUrl(value),null)});
test('unsafe thumbnail protocols are rejected',()=>{assert.equal(safeMediaUrl('https://example.com/thumb.jpg'),'https://example.com/thumb.jpg');assert.equal(safeMediaUrl('javascript:alert(1)'),null)});
