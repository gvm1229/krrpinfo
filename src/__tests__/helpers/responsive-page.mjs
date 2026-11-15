import { createServer } from 'node:http';
const body =
  '<!doctype html><html lang="ko"><meta charset="utf-8"><title>CMS 모바일 검증</title><style>body{background:#eceef4;font-family:sans-serif;margin:20px}main{display:flex;gap:24px}iframe{width:390px;height:760px;border:1px solid #bbb;border-radius:8px;background:white}h1{font-size:20px}h2{font-size:15px}</style><h1>390px 모바일 화면 검증</h1><main><section><h2>공개 사이트</h2><iframe title="모바일 공개 화면" src="http://localhost:3000/"></iframe></section><section><h2>관리자 화면</h2><iframe title="모바일 관리자 화면" src="http://localhost:3000/admin"></iframe></section></main></html>';
createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(body);
}).listen(55435, '127.0.0.1', () => console.log('Responsive test PID ' + process.pid));
