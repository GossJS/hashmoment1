const [{ Server: h1 }, x] = [require('http'), require('express')];
const crypto = require('crypto');

const [Router, SummerRouter] = [x.Router(), x.Router()];
const PORT = 4321;
const { log } = console;
const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':'cors,my,Content-Type,Accept,Access-Control-Allow-Headers'
};
const app = x();
function summer(r, sum) {
      if ('cors' in r.query) r.res.set(CORS);
      r.res.format({
        'text/html': () => r.res.send(`<h2>Сумма:<i>${sum}</i></h2>`),
        'application/json': () => r.res.json({"Сумма:": sum})
      });  
}
Router
  .route('/')
  .get(r => r.res.end('Привет мир!'));
SummerRouter
  .route('/')
  .all(r => {
      const sum = Number(r.query.n1) + Number(r.query.n2);
      return summer(r, sum);
  });
SummerRouter
  .route('/:n1/:n2')
  .all(r => {
      const sum = Number(r.params.n1) + Number(r.params.n2);
      return summer(r, sum);
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







.get('/api/sha1/:src', r => {
    

    const shasum = crypto.createHash('sha1');
    shasum.update(r.params.src);

    const reply = { 'Content-Type': 'application/json' },
    resp = {'sha1': shasum.digest('hex')};

    r.res.set(reply).send(resp);
})

.post('/api2/moment', r => {
  const z = moment().format('DD.MM.YYYY HH:mm:ss');
  r.res
  .set({ 'Content-Type': 'text/plain; charset=utf-8' })
  .send(`Hello, ${r.body.name}, сейчас ${z}`);
})

