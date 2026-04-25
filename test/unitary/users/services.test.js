import config from "../../../src/config/config.js";
import repository from "../../../src/modules/users/repositories/index.js";
import { expect } from "chai";
import { before, beforeEach, describe } from "mocha";
import * as mocks from "../../mocks/user.mock.js";
import mongoose from "mongoose";

const dbURI = config.db.cs;

describe("user repository testing", function () {
  this.timeout(6000);

  before(async () => {
    await mongoose.connect(dbURI);
  });

  after(async () => {
    // Despues de todos los test cerrar la conexión
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.collections.users.deleteMany({});
  });

  describe("create function", () => {
    it("It should create a user correctly", async () => {
      const response = await repository.create(mocks.commonUser);

      expect(response).to.be.ok;
      expect(response).to.be.an("object");
      expect(response.first_name).to.be.equal(mocks.commonUser.first_name);
      expect(response.email).to.be.equal(mocks.commonUser.email);
    });

    it("It should handle a duplicate data", async () => {
      const response = await repository.create(mocks.commonUser);

      try {
        await repository.create(mocks.commonUser);
      } catch (error) {
        expect(error.message).to.include("duplicate key error");
      }
    });

    it("It should handle a invalid format data", async () => {
      try {
        const response = await repository.create(mocks.invalidFormat_1);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("It should handle a invalid format data", async () => {
      try {
        await repository.create(mocks.invalidFormat_2);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("It should handle a invalid user data", async () => {
      try {
        await repository.create(mocks.invalidUser);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("It should handle a incomplete user data", async () => {
      try {
        await repository.create(mocks.incompleteUser);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("It should handle asynchronous operations correctly", async () => {
      const responsePromise = repository.create(mocks.commonUser);
      expect(responsePromise).to.be.a("Promise");

      const response = await responsePromise;
      expect(response).to.be.an("object");
    });
  });

  describe("getAll function", () => {
    it("It should return an empty array if there are not users", async () => {
      const response = await repository.getAll();

      expect(response).to.be.ok;
      expect(response).to.be.an("array");
      expect(response).to.have.lengthOf(0);
    });

    it("It should return all users", async () => {
      await repository.create(mocks.commonUser);
      const response = await repository.getAll();

      expect(response).to.be.ok;
      expect(response).to.be.an("array");
      expect(response).to.have.lengthOf.at.least(1);
      expect(response[0].email).to.be.equal(mocks.commonUser.email);

      const emailsInResponse = response.map((user) => user.email);
      const expectedEmails = emailsInResponse.map((email) => email);
      expect(emailsInResponse).to.have.deep.equal(expectedEmails);
    });
  });

  describe("getById function", () => {
    it("It should return an object with an user from its id", async () => {
      const userCreated = await repository.create(mocks.commonUser);
      const _id = userCreated._id;

      const response = await repository.getById(_id);
      expect(response).to.be.ok;
      expect(response).to.be.an("object");
      expect(response.nickname).to.be.equal(mocks.commonUser.nickname);
    });

    it("It should return null if id is not found", async () => {
      const nonExistentId = "67edb18cd5c046e90a38acf2";

      const response = await repository.getById(nonExistentId);
      expect(response).to.be.null;
    });

    it("It should handle errors correctly", async () => {
      const invalidId = "invalidId";

      try {
        await repository.getById(invalidId);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
  describe("getByEmail function", () => {
    it("It should return an object with an user from its email", async () => {
      const userCreated = await repository.create(mocks.commonUser);
      const email = userCreated.email;

      const response = await repository.getByEmail(email);
      expect(response).to.be.ok;
      expect(response).to.be.an("object");
      expect(response.nickname).to.be.equal(mocks.commonUser.nickname);
    });

    it("It should return null if email is not found", async () => {
      const nonExistentEmail = "nonExistent@email.com";

      const response = await repository.getByEmail(nonExistentEmail);
      expect(response).to.be.null;
    });

    it("It should handle errors correctly", async () => {
      const invalidEmail = "invalidEmail";

      try {
        await repository.getByEmail(invalidEmail);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("getByUsername function", () => {
    it("It should return an object with an user from its username", async () => {
      const userCreated = await repository.create(mocks.commonUser);
      const username = userCreated.username;

      const response = await repository.getByUsername(username);
      expect(response).to.be.ok;
      expect(response).to.be.an("object");
      expect(response.nickname).to.be.equal(mocks.commonUser.nickname);
    });

    it("It should return null if username is not found", async () => {
      const nonExistentUsername = "nonExistentUsername";

      const response = await repository.getByUsername(nonExistentUsername);
      expect(response).to.be.null;
    });

    it("It should handle errors correctly", async () => {
      const invalidUsername = "invalidUsername";

      try {
        await repository.getByUsername(invalidUsername);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("update function", () => {
    it("It should return null if id is not found", async () => {
      const nonExistentId = "67edb18cd5c046e90a38acf2";

      const response = await repository.update(
        nonExistentId,
        mocks.commonUserUpdated,
      );

      expect(response).to.be.null;
    });

    it("It should handle errors correctly", async () => {
      const invalidId = "invalidId";

      try {
        await repository.update(invalidId, mocks.commonUserUpdated);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("It should return an object with an user updated from its id", async () => {
      const userCreated = await repository.create(mocks.commonUser);
      const _id = userCreated._id;

      const response = await repository.update(_id, mocks.commonUserUpdated);
      expect(response).to.be.ok;
      expect(response).to.be.an("object");
      expect(response).to.be.not.equal(mocks.commonUser);
    });

    it("It should return an object without update the email", async () => {
      const userCreated = await repository.create(mocks.commonUser);
      const _id = userCreated._id;

      const response = await repository.update(
        _id,
        mocks.commonUserUpdatedEmail,
      );
      expect(response).to.be.ok;
      expect(response).to.be.an("object");
      expect(response.email).to.be.equal(mocks.commonUser.email);
    });

    it("It should return an object without update the username", async () => {
      const userCreated = await repository.create(mocks.commonUser);
      const _id = userCreated._id;

      const response = await repository.update(
        _id,
        mocks.commonUserUpdatedNickname,
      );
      expect(response).to.be.ok;
      expect(response).to.be.an("object");
      expect(response.nickname).to.be.equal(mocks.commonUser.nickname);
    });
  });

  describe("eliminate function", () => {
    it("It should return null if id is not found", async () => {
      const nonExistentId = "67edb18cd5c046e90a38acf2";

      const response = await repository.eliminate(nonExistentId);

      expect(response).to.be.null;
    });

    it("It should handle errors correctly", async () => {
      const invalidId = "invalidId";

      try {
        await repository.eliminate(invalidId);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("It should return an object with an user deleted from its id", async () => {
      const userCreated = await repository.create(mocks.commonUser);
      const _id = userCreated._id;

      const response = await repository.eliminate(_id);
      expect(response).to.be.ok;
      expect(response).to.be.an("object");
    });
  });
});
