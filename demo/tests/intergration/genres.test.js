const mongoose = require('mongoose');
const request = require('supertest');
const {Genre} = require('../../models/genre');

const {User} = require('../../models/user');

let server;

describe('/api/genres', () => {
    beforeEach(() => {server = require('../../index');})
    afterEach(async ()=> {
        await Genre.deleteMany({});
        await server.close();
    })
    describe('GET /', () => {
        it('should return all genres', async () => {
            Genre.insertMany([
                {name : 'genre1'}, 
                {name: 'genre2'},
            ])

            const res = await request(server).get('/api/genres');
  
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('should return 404 if invalid id is passed', async() => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404 );
        });

        it('should return 404 if no genre with given id exists', async() => {
            const validId = mongoose.Types.ObjectId().toHexString();

            const res = await request(server).get(`/api/genres/${validId}`);

            expect(res.status).toBe(404);
        });

        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);
    
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
    })

    describe('POST /', () => {
        // Define the happy path, and then in each test, we change one parameter  that clearly 
        // aligns with the name of the test.
        let token;
        let name;
        const exec = async() => {
            return await request(server)
            .post(`/api/genres`)
            .set('x-auth-token', token)
            .send({name});
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });


        it('should return 401 if client is not logged in', async() => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if input is less than 3 charaters', async() => {
            name = '12';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if input is more than 50 charaters', async() => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save genre into database if input is valid', async () => {
            await exec();

            const genre = await Genre.find({name:'genre1'})

            expect(genre).not.toBeNull;
        });

        it('should return genre into database if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    })

    describe('PUT /:id', () => {
        let token;
        let newName;
        let id;

        const exec = async() => {
            return await request(server)
            .put(`/api/genres/${id}`)
            .set('x-auth-token', token)
            .send({name : newName})
        };

        beforeEach(async() => {
            const genre = new Genre({name : 'genre1'});
            await genre.save();
            token = new User().generateAuthToken();
            id = genre._id;
            newName = "updateGenre"
        });

        it('should return 401 if the client is not logged in', async() => {
            token ='';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 404 if input is invalid', async () => {
            const res = await request(server).put('/api/genres/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with given id exists', async() => {
            id = mongoose.Types.ObjectId().toHexString();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 400 if input less than 3 characters', async () => {
            newName = "12";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if input less than 3 characters', async () => {
            newName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        
        it('should update genre into database if input is valid', async () => {
            const res = await exec();
            const updatedGenre = await Genre.findById(id);
            expect(res.status).toBe(200);
            expect(updatedGenre.name).toBe(newName);
        });

        it('should return genre into database if input is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        });
    });

    describe('DELETE/:id', () => {
        let token;
        let id;
        let genre;

        const exec = async() => {
            return await request(server)
            .delete(`/api/genres/${id}`)
            .set('x-auth-token', token)
            .send(genre)
        }

        beforeEach(async () => {
            genre = new Genre({name: 'genre1'});
            genre.save();
            isAdmin: true;
            token = new User({isAdmin: true}).generateAuthToken();
            id = genre._id;
        });

        // Check return 401 if the client is not logged in
        it('should return 401 if the client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        // Check return 403 if the client is not admin
        it('should return 403 if the client is not admin', async () => {
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });
        // Check return 404 if input is invalid
        it('should return 404 if input is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });
        // Check return 404 if no genre with given valid id exists
        it('should return 404 if no genre with given valid id exists', async () => {
            id = mongoose.Types.ObjectId().toHexString();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        // Check it should delete genre in db 
        it('should delete genre in db ', async () => {
            await exec();
            const deletedGenre = await Genre.findById(id);
            expect(deletedGenre).toBeNull();
        });
        // Check return deleted genre from database
        it('should delete genre in db ', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
})


