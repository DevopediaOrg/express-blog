var express = require('express');
var router = express.Router();
var article = require('../models/article');
var fs = require('fs');
var epm = require('express-promise-middleware');

router.use(epm.promiseMiddleware(function countByTopic (req, res, next) {
  return article.countByTopic().
    then(function (data) {
      // TODO Aggregate in model rather than here
      // Count articles by topic
      let counts = {};
      data.forEach((item) => {
        const key = item.topicId.title;
        if (key in counts) counts[key]++;
        else counts[key] = 1;
      });

      // Sort by topic name
      let topics = [];
      let keys = Object.keys(counts).sort();
      keys.forEach((key) => {
        topics.push({title: key, num_posts: counts[key]});
      });

      req.topics = topics;
    });
}));

router.use(epm.promiseMiddleware(function countByAuthor (req, res, next) {
  return article.countByAuthor().
    then(function (data) {
      // TODO Aggregate in model rather than here
      // Output format: [{key: state, values: [{label: author, value: count}]}
      let counts = {};
      data.forEach((item) => {
        if (!(item.state in counts)) counts[item.state] = [];
        const key = `${item.authorId.firstname} ${item.authorId.lastname}`;
        if (key in counts[item.state]) counts[item.state][key]++;
        else counts[item.state][key] = 1;
      });
      console.log(counts);
      req.authors = counts;
    });
}));

router.use(function topicsPieChart (req, res, next) {
  // Reformat as expected by charting
  let data = [];
  req.topics.forEach((topic) => {
    data.push({'label': topic.title, 'value': topic.num_posts});
  });

  // Write to JSON file
  req.chart1File = 'tmp/topics.json';
  fs.writeFile('public/'+req.chart1File, JSON.stringify(data), function(err) {
    if(err) {
      return console.log(err);
    }
  });

  next();
});

router.use(function authorsBarChart (req, res, next) {
  // Reformat as expected by charting
  let data = [];
  req.topics.forEach((topic) => {
    data.push({'label': topic.title, 'value': topic.num_posts});
  });

  // Write to JSON file
  req.chart1File = 'tmp/topics.json';
  fs.writeFile('public/'+req.chart1File, JSON.stringify(data), function(err) {
    if(err) {
      return console.log(err);
    }
  });

  next();
});

/* Pie chart of posts by topics
basedir = os.path.dirname(os.path.abspath(__file__)) + '/static/'
context['chart1'] = 'tmp/topics.json'
data = [{"label":k, "value":v} for k,_,v in context['topics']]
with open(basedir + context['chart1'],'w') as f:
    json.dump(data, f)
*/


/* GET home page. */
router.get('/', function(req, res, next) {
  article.listPubLatest().
    then(function (latest) {
      req.latest = latest;
      return article.listPubFeatured();
    }).
    then(function (featured) {
      req.featured = featured;

      res.render('home', {
        posts: req.latest,
        featured_posts: req.featured,
        topics: req.topics,
        chart1: req.chart1File,
        chart2: req.chart2File
      });
    }).
    catch(function (err) {
      console.error(err);
    });
});

router.get('/okkkk', function(req, res, next) {
  article.listPubLatest().
    then(function (latest) {
      req.latest = latest;
      return article.listPubFeatured();
    }).
    then(function (featured) {
      res.render('home', {
        posts: req.latest,
        featured_posts: featured
      });
    }).
    catch(function (err) {
      console.error(err);
    });
});

module.exports = router;
