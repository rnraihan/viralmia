@echo off
cd /d "%~dp0"
echo Starting local preview server for Viral Mia at http://localhost:4173 ...
start "" "http://localhost:4173"
node -e "const http=require('http'),fs=require('fs'),path=require('path'),root=path.join(process.cwd(),'dist'),mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};http.createServer((req,res)=>{const clean=decodeURIComponent((req.url||'/').split('?')[0]);let f=path.join(root,clean);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)&&fs.existsSync(f+'.html'))f+='.html';if(!fs.existsSync(f)){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);}).listen(4173,()=>console.log('Preview running at http://localhost:4173 (Press Ctrl+C to stop)'));"
