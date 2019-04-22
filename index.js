const http = require('http');
const url = require('url');
const UrlPattern = require('url-pattern');

const { sendResponse, parseBody } = require('./response');
const cats = require('./cats');

http
  .createServer(async function(req, res) {
    const verb = req.method;
    const pathName = url.parse(req.url).pathname;

    const rootPath = new UrlPattern('/cat');
    const idPath = new UrlPattern('/cat/:id');

    if (rootPath.match(pathName) && verb === 'GET') {
      const catsList = await cats.list();
      sendResponse(res, catsList);
    } else if (rootPath.match(pathName) && verb === 'POST') {
      const body = await parseBody(req);
      const cat = await cats.create(body);
      sendResponse(res, cat);
    } else if (idPath.match(pathName) && verb === 'GET') {
      const { id } = idPath.match(pathName);
      const cat = await cats.grab(id);
      sendResponse(res, cat);
    } else if (idPath.match(pathName) && verb === 'PUT') {
      const { id } = idPath.match(pathName);
      const body = await parseBody(req);
      const cat = await cats.update(id, body);
      sendResponse(res, cat);
    } else if (idPath.match(pathName) && verb === 'DELETE') {
      const { id } = idPath.match(pathName);
      const cat = await cats.remove(id);
      sendResponse(res, cat);
    } else {
      sendResponse(res, { message: 'Endpoint not found' }, 404);
    }
  })
  .listen(process.env.PORT || 3000);

console.log('listening on port:', process.env.PORT || 3000);
