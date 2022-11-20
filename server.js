const express = require('express');
const promMid = require('express-prometheus-middleware');
const app = express();
const cors = require("cors");

app.use(
    cors({
        origin: "http://localhost:3000"
    })
);
const PORT = 9091;
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  authenticate: req => req.headers.authorization === 'mysecrettoken'
  /**
   * Uncomenting the `authenticate` callback will make the `metricsPath` route
   * require authentication. This authentication callback can make a simple
   * basic auth test, or even query a remote server to validate access.
   * To access /metrics you could do:
   * curl -X GET user:password@localhost:9091/metrics
   */
  // authenticate: req => req.headers.authorization === 'Basic dXNlcjpwYXNzd29yZA==',
  /**
   * Uncommenting the `extraMasks` config will use the list of regexes to
   * reformat URL path names and replace the values found with a placeholder value
  */
  // extraMasks: [/..:..:..:..:..:../],
  /**
   * The prefix option will cause all metrics to have the given prefix.
   * E.g.: `app_prefix_http_requests_total`
   */
  // prefix: 'app_prefix_',
  /**
   * Can add custom labels with customLabels and transformLabels options
   */
  // customLabels: ['contentType'],
  // transformLabels(labels, req) {
  //   // eslint-disable-next-line no-param-reassign
  //   labels.contentType = req.headers['content-type'];
  // },
}));

// curl -X GET localhost:9091/hello?name=Chuck%20Norris
app.get('/time', (req, res) => {
  var headers = req.headers;
  console.log( headers["authorization"] );
  if( headers["authorization"] === undefined || headers["authorization"] !== "mysecrettoken")
  {
    res.status(403);
    res.json({
        error: "403 Not Authorized!"
    })
  }
  else
  {
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    res.json({ epoch: { 
                    description: `The current server time, in epoch seconds, at time of processing the request.`,
                    type:  secondsSinceEpoch
                } 
        });
  }
});

app.listen(PORT, () => {
  console.log(`Example api is listening on http://localhost:${PORT}`);
});