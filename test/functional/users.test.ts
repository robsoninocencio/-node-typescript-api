import { User } from '@src/models/user';

describe('Users functional tests', () => {
  beforeAll(async () => await User.deleteMany({}));

  describe('When creating a new user', () => {
    it('should create a user with success', async () => {
      const newUser = {
        name: 'Robson Inocêncio',
        email: 'robson.inocencio@gmail.com',
        password: '123',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      //Object containing matches the keys and values, even if includes other keys such as id.
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    it('Should return 422 when there is a validation error', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('Should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.',
      });
    });

    // it.skip('should return 500 when there is any error other than validation error', async () => {
    //   //TODO think in a way to throw a 500
    // });
  });
});
