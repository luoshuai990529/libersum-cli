const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const {execFile}=require('node:child_process');
const exec=require('node:util').promisify(execFile);
const renderer=path.resolve('skills/libersum99-social-publishing/scripts/render.cjs');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
async function fixture(fn){ const dir=await fs.mkdtemp(path.join(os.tmpdir(),'social-render-')); try {await fn(dir);} finally {await fs.rm(dir,{recursive:true,force:true});} }
function html(body){return `<html lang="zh"><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0}.card{width:1080px;height:1440px;padding:60px;overflow:hidden;position:relative}h1{font-size:80px}</style></head><body>${body}</body></html>`;}
test('exports every card at exact size and refuses overwrite',()=>fixture(async dir=>{
 const input=path.join(dir,'index.html'), out=path.join(dir,'result');
 await fs.writeFile(input,html('<div class="card"><h1>第一张</h1></div><div class="card"><h1>第二张</h1></div>'));
 await exec('node',[renderer,'cards',input,out]);
 const result=JSON.parse(await fs.readFile(path.join(out,'report.json'),'utf8'));
 assert.equal(result.pages,2);
 for(const name of ['01.png','02.png']){const b=await fs.readFile(path.join(out,name));assert.equal(b.readUInt32BE(16),1080);assert.equal(b.readUInt32BE(20),1440);}
 await assert.rejects(exec('node',[renderer,'cards',input,out]));
}));
test('broken image and clipped content fail without a success directory',()=>fixture(async dir=>{
 for(const [name,body] of [['image','<img src="missing.png">'],['overflow','<p style="height:1700px">超出内容</p>']]){
 const input=path.join(dir,`${name}.html`),out=path.join(dir,name);
 await fs.writeFile(input,html(`<div class="card">${body}</div>`));
 await assert.rejects(exec('node',[renderer,'cards',input,out]), name === 'image' ? /Missing image/ : /Clipped content/);
 await assert.rejects(fs.access(out));
 }
}));
test('wechat embeds local images without changing article text',()=>fixture(async dir=>{
 const input=path.join(dir,'index.html'),out=path.join(dir,'result');
 await fs.writeFile(path.join(dir,'sample.png'),png);
 await fs.writeFile(input,'<html><head><meta charset="utf-8"></head><body><section><p>只测试了十篇，暂时不能判断谁最好。</p><img src="sample.png"></section></body></html>');
 await exec('node',[renderer,'wechat',input,out]);
 const content=await fs.readFile(path.join(out,'article.html'),'utf8');
 assert.ok(content.includes('data:image/png;base64,'));
 assert.ok(content.includes('只测试了十篇，暂时不能判断谁最好。'));
 assert.equal(JSON.parse(await fs.readFile(path.join(out,'report.json'),'utf8')).platformVerified,false);
}));
