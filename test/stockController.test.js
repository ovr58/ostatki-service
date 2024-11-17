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

describe('Stock Controller', () => {
    it('should create a stock', async () => {
      const res = await request(app)
        .post('/stocks')
        .send({
          quantityOnShelf: 10,
          quantityInOrder: 5,
          productId: 1,
          shopId: 1
        })
      
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
    });
  
    it('should update a stock', async () => {
      const res = await request(app)
        .put('/stocks/1')
        .send({
          quantityOnShelf: 15,
          quantityInOrder: 3
        })
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
    });
  
    it('should increase a stock', async () => {
      const res = await request(app)
        .post('/stocks/1/increase')
        .send({ quantity: 5 })
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
    });
  
    it('should decrease a stock', async () => {
      const res = await request(app)
        .post('/stocks/1/decrease')
        .send({ quantity: 2 })
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
    });
  });