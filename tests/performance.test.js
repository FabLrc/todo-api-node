const autocannon = require("autocannon");
const app = require("../app");

/**
 * Performance test suite
 * Validates response times stay under acceptable thresholds
 */
describe("Performance tests", () => {
  let server;
  const PORT = 0; // random port

  beforeAll((done) => {
    server = app.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it(
    "GET /health should handle 100 requests/sec with p99 < 500ms",
    (done) => {
      const address = server.address();
      const instance = autocannon(
        {
          url: `http://localhost:${address.port}/health`,
          connections: 10,
          duration: 5,
          pipelining: 1,
        },
        (err, result) => {
          expect(err).toBeNull();
          expect(result.non2xx).toBe(0);
          expect(result.errors).toBe(0);
          // p99 latency should be under 500ms
          expect(result.latency.p99).toBeLessThan(500);
          // Should handle at least 50 req/s
          expect(result.requests.average).toBeGreaterThan(50);
          done();
        }
      );
      // Prevent autocannon from printing to stdout
      autocannon.track(instance, { renderProgressBar: false });
    },
    15000
  );

  it(
    "GET /todos should handle load with p99 < 500ms",
    (done) => {
      const address = server.address();
      const instance = autocannon(
        {
          url: `http://localhost:${address.port}/todos`,
          connections: 10,
          duration: 5,
          pipelining: 1,
        },
        (err, result) => {
          expect(err).toBeNull();
          expect(result.non2xx).toBe(0);
          expect(result.errors).toBe(0);
          expect(result.latency.p99).toBeLessThan(500);
          done();
        }
      );
      autocannon.track(instance, { renderProgressBar: false });
    },
    15000
  );
}, 60000);
