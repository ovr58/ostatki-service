let request
let expect
let chai
let chaiHttp
let app

before(async () => {
  chai = await import('chai')
  request = (await import('chai')).request
  expect = (await import ('chai')).expect
  chaiHttp = (await import('chai-http')).default
  app = (await import('../index.js')).default;
  chai.use(chaiHttp);
})

describe('Product Controller', () => {
  it('should create a product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        plu: '12345',
        name: 'Test Product'
      })
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('plu', '12345');
      expect(res.body).to.have.property('name', 'Test Product');
  });

  it('should get products by name', async () => {
    const res = await request(app)
      .get('/products')
      .query({ name: 'Test Product' })
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('name', 'Test Product');
  });

  it('should get products by plu', async () => {
    const res = await request(app)
      .get('/products')
      .query({ plu: '12345' })
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('plu', '12345');
  });

  it('should get products by name and plu', async () => {
    const res = await request(app)
      .get('/products')
      .query({ name: 'Test Product', plu: '12345' })
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('name', 'Test Product');
      expect(res.body[0]).to.have.property('plu', '12345');
  });
});