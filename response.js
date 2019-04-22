module.exports.sendResponse = (res, body, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

module.exports.parseBody = async req => {
  return new Promise((resolve, reject) => {
    let body = [];
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString());
        console.log('body:', body);
        resolve(body);
      });
  });
};
