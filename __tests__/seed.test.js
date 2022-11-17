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

  test("400: responds with a 400 error if the path does not exist", () => {
    return request(app)
      .get("/api/reviewz")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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

describe("GET: /api/reviews/:review_id/comments", () => {
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
        expect(body).toEqual([]);
      });
  });

  test("404: valid but non existent review ID", () => {
    return request(app)
      .get("/api/reviews/900/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review ID not found");
      });
  });
});
