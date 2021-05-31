/**
 * This is a implemented integration test of index.ts
 * However, this test cannot execute with the security constraints on the project
 */

// const request = require('supertest');
// const { app } = require('../lib/index');

// let createdGameId = '';

// describe('Integration testing', () => {
//     describe('POST /create', () => {
//         it('Should be OK', () => {
//             request(app)
//             .post('/create')
//             .expect(201)
//             .end(function(err: any, res: any) {
//                 expect(res.text.startsWith('Created a new game: ')).toBeTruthy();
//                 const regexpResult = new RegExp('/(?:"gameId":")(.*)(?:",")/').exec(res.text);
//                 createdGameId = regexpResult === null ? '' : regexpResult[1];
//                 if (err) throw err;
//             });
//         });
//     });
    
//     describe('GET /read/:gameId', () => {
//         it('Should get OK if game exists', () => {
//           request(app)
//             .get(`/read/${createdGameId}`)
//             .expect(200)
//             .end(function(err: any, res: any) {
//                 expect(res.body).toMatchObject(
//                     {
//                         gameId: createdGameId,
//                         rod1: [1,2,3,4],
//                         rod2: [],
//                         rod3: []
//                     })
//                 if (err) throw err;
//             });
//         });
    
//         it('Should send 404 if game not exist', () => {
//           request(app)
//             .get('/read/000000')
//             .expect(404)
//             .end(function(err: any, res: any) {
//                 expect(res.text).toBe('Game session does not exist');
//                 if (err) throw err;
//             });
//         });
//     });
    
//     describe('PUT /update/:gameId', () => {
//         it('Should update OK if 1. request syntax is valid; 2. game exists; 3. attemp move is valid', () => {
//             request(app)
//             .put(`/update/${createdGameId}`)
//             .send({from: 'rod1', to: 'rod2'})
//             .expect(200)
//             .end(function(err: any, res: any) {
//                 const response = res.text;
//                 expect(res.body).toMatchObject(
//                     {
//                         gameId: createdGameId,
//                         rod1: [2,3,4],
//                         rod2: [1],
//                         rod3: []
//                     })
//                 expect(response.indexOf('Is victory: ')).toBeGreaterThan(-1);
//                 if (err) throw err;
//             });
//         });
    
//         it('Should send 400 if request syntax is invalid', () => {
//             request(app)
//             .put(`/update/${createdGameId}`)
//             .send({from: 'rod1', where: 'rod2'})
//             .expect(400)
//             .end(function(err: any, res: any) {
//                 expect(res.text.startsWith('Invalid request: ')).toBeTruthy();
//                 if (err) throw err;
//             });
//         });
    
//         it('Should send 404 if game not exist', () => {
//             request(app)
//             .put('/update/000000')
//             .send({from: 'rod1', to: 'rod3'})
//             .expect(404)
//             .end(function(err: any, res: any) {
//                 expect(res.text).toBe('Game session does not exist');
//                 if (err) throw err;
//             });
//         });
    
//         it('Should send 403 if attempt an invalid move', () => {
//             request(app)
//             .put(`/update/${createdGameId}`)
//             .send({from: 'rod3', to: 'rod1'})
//             .expect(403)
//             .end(function(err: any, res: any) {
//                 expect(res.text).toBe('Intended move is invalid');
//                 if (err) throw err;
//             });
//         });
//     });
    
//     describe('DELETE /delete/:gameId', () => {
//         it('Should delete OK', () => {
//             request(app)
//             .delete(`/delete/${createdGameId}`)
//             .expect(200)
//             .end(function(err: any, res: any) {
//                 expect(res.text).toBe(`Deleted game session: ${createdGameId}`);
//                 if (err) throw err;
//             });
//         });
//     });
// });
