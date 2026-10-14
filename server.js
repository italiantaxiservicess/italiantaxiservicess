const http=require('http'),fs=require('fs'),path=require('path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  const dir=path.join(__dirname,p);
  if(!p.endsWith('/')&&!path.extname(p)&&fs.existsSync(dir)&&fs.statSync(dir).isDirectory()){res.writeHead(301,{Location:p+'/'});return res.end();}
  if(p.endsWith('/'))p+='index.html';
  const f=path.join(__dirname,p);
  if(!f.startsWith(__dirname)){res.writeHead(403);return res.end();}
  fs.readFile(f,(e,d)=>{ if(e){res.writeHead(404);return res.end('Not found');}
    res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(d);});
}).listen(3000,()=>console.log('Open: http://localhost:3000'));
