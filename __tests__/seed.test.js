const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  test("200: should respond with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const categories = res.body.categories;
        expect(categories.length).toBeGreaterThan(0);

        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  test("400: should respond with a 400 error if the path does not exist", () => {
    return request(app)
      .get("/api/not-a-path")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/reviews", () => {
  test("200: responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const reviews = res.body.reviews;
        expect(reviews.length).toBeGreaterThan(0);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("200: responds with an array of review objects sorted by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const reviews = res.body.reviews;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: responds with an array of objects correctly sorted by custom sort query, in descending order by default", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(200)
      .then((res) => {
        const reviews = res.body.reviews;

        expect(reviews).toBeSortedBy("review_id", { descending: true });
      });
  });

  test("200: responds with an array of objects sorted by custom query, in ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=title&order=asc")
      .expect(200)
      .then((res) => {
        const reviews = res.body.reviews;

        expect(reviews).toBeSortedBy("title", { ascending: true });
      });
  });

  test("400: responds with a 400 error if the path does not exist", () => {
    return request(app)
      .get("/api/reviewz")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: responds with a 404 error if given an invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=asdc")
      .expect(404)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("Not Found");
      });
  });

  test("404: responds with a 404 error if given an invalid sort query", () => {
    return request(app)
      .get("/api/reviews?sort_by=name")
      .expect(404)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("Not Found");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("Happy path", () => {
    test("200: responds with a review object that corresponds to the submitted ID", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((res) => {
          expect(res.body.review).toMatchObject({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 1,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          });
        });
    });
  });
  describe("Errors", () => {
    test("404: responds with a 404 if given an ID that doesnt exist", () => {
      return request(app)
        .get("/api/reviews/89")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review ID not found");
        });
    });
    test("400: invalid ID (wrong data type)", () => {
      return request(app)
        .get("/api/reviews/eight")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid - wrong data type");
        });
    });
    test("400: responds with a 404 when given an invalid file path", () => {
      return request(app)
        .get("/api/reviewzz/9")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("GET: /api/reviews/:review_id/comments", () => {
  describe("Happy path", () => {
    test("200: responds with an array of comments for the given review_id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          body.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 2,
            });
          });
        });
    });

    test("200: respond with empty array if there are no comments for that ID", () => {
      return request(app)
        .get("/api/reviews/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    test("200: orders the comments newest first by default", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("Errors", () => {
    test("404: valid but non existent review ID", () => {
      return request(app)
        .get("/api/reviews/900/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Value not found");
        });
    });

    test("400: invalid ID (wrong data type)", () => {
      return request(app)
        .get("/api/reviews/notvalid/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid - wrong data type");
        });
    });
  });
});

describe("POST: /api/reviews/:review_id/comments", () => {
  describe("Happy path", () => {
    test("201: sends an object in the request and responds with the posted comment for the given review_id", () => {
      const newComment = {
        username: "dav3rid",
        body: "This is my first comment",
      };
      return request(app)
        .post("/api/reviews/4/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            author: "dav3rid",
            body: "This is my first comment",
          });
        });
    });
  });
  describe("Errors", () => {
    test("404: responds with an error if the username does not exist in users database", () => {
      const newComment = {
        username: "unknownUser",
        body: "test comment",
      };
      return request(app)
        .post("/api/reviews/4/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("404: valid but non existent review ID", () => {
      const newComment = {
        username: "dav3rid",
        body: "This is my first comment",
      };
      return request(app)
        .post("/api/reviews/99/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    test("400: invalid ID (wrong data type)", () => {
      const newComment = {
        username: "dav3rid",
        body: "This is my first comment",
      };
      return request(app)
        .post("/api/reviews/not-a-path/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid - wrong data type");
        });
    });
  });
});

describe("GET: /api/users", () => {
  describe("Happy path", () => {
    test("200: should respond with an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);

          body.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });

  describe("Errors", () => {
    test("400: should respond with a 400 error if the path does not exist", () => {
      return request(app)
        .get("/api/user")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
