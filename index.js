const [{ Server: h1 }, x] = [require('http'), require('express')];
const crypto = require('crypto');
const moment = require('moment');

const [Router, ApiRouter, Api2Router] = [x.Router(), x.Router(), x.Router()];
const PORT = 4321;
const { log } = console;
const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':'cors,my,Content-Type,Accept,Access-Control-Allow-Headers'
};
const app = x();

Router
  .route('/')
  .get(r => r.res.end('Привет мир!'));

ApiRouter
  .route('/sha1/:src')
  .all(r => {
    const shasum = crypto.createHash('sha1');
    shasum.update(r.params.src);

    const reply = { 'Content-Type': 'application/json' },
    resp = {'sha1': shasum.digest('hex')};

    r.res.set(reply).send(resp);
  });

Api2Router
  .route('/moment')
  .all(r => {
    const z = moment().format('DD.MM.YYYY HH:mm:ss');
    r.res
    .set({ 'Content-Type': 'text/plain; charset=utf-8' })
    .send(`Hello, ${r.body.name}, сейчас ${z}`);
  });

app
  .use('/summer', ApiRouter)
  .use((r, rs, n) => rs.status(200).set(hu) && n())
  .use(x.static('.'))
  .use('/', Router)
  .use('/api2', Api2Router)
  .use(({ res: r }) => r.status(404).set(hu).send('Пока нет!'))
  .use((e, r, rs, n) => rs.status(500).set(hu).send(`Ошибка: ${e}`))
  /* .set('view engine', 'pug') */
  .set('x-powered-by', false);
module.exports = h1(app)
  .listen(process.env.PORT || PORT, () => log(process.pid));


 

