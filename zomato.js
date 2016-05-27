var portNumber = 25000;
var serverName = '192.168.8.201/';
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var request = require('request');
var url = require('url');
var user_key = "b7b54ece20fead34c8c9156027a1cfb2";
var host = "https://developers.zomato.com/api/v2.1";
var accessToken = 'EAAOO48QpaWEBAD03lwkfdFPHFD7cuiiZAE6ZAIz6Lnv2QUAYFrqOZAtPqZARVgGlzph1vM4pSpI8u5XSiN7iOwjZAY6DrD1y7qJZCZBLZB8ZCEFZBFd1ma1WKC2XK0vS9cF2Yguan50qx8xTJjo92NDgJSO2SkYMGPtPcZD';
var fourSquare = 'https://api.foursquare.com/v2/venues/search?'
var fourSquareToken = 'H445FQVNTXFYNKVK4K0ZNOZ5ICYT2JU4IREJDALICOSAKRZK'
var decodeNumbers = {
  'A' : '0',
  'B' : '1',
  'C' : '2',
  'D' : '3',
  'E' : '4',
  'F' : '5',
  'G' : '6',
  'H' : '7',
  'I' : '8',
  'J' : '9'
}
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/home', function(req, res) {
    res.sendFile(__dirname + "/public/views/index.html")
});
app.get('/preview/:id', function(req, res) {
  res.sendFile(__dirname + "/public/views/website.html")
});
app.post('/preview/:id',function(req, res){
  var id = req.params.id
  console.log(id)
  decodeUrl(id,function(r){
    if(r[0]!='0'&&r[1]!='0'&&r[2]!='0'){
      getFbPageDetails(r[0],function(r1){
        var data = {}
        data.fb = r1
        getZomatoPageDetails(r[1],function(r2){
        data.zomato = r2
        getFourSquareVenueDetail(r[2], function(r3){
        data.foursquare = r3
        res.json(data)
      })
      })
      })
    } else if(r[0]!='0'&&r[1]!='0'&&r[2]=='0'){
      getFbPageDetails(r[0],function(r1){
        var data = {}
        data.fb = r1
        getZomatoPageDetails(r[1],function(r2){
        data.zomato = r2
          res.json(data)
      })
      })
    } else if(r[0]!='0'&&r[1]=='0'&&r[2]=='0'){
      getFbPageDetails(r[0],function(r){
        res.json({fb:r})
      })
    } else if(r[0]=='0'&&r[1]!='0'&&r[2]=='0'){
      getZomatoPageDetails(r[1],function(r){
      res.json({zomato:r})
      })
    } else if(r[0]=='0'&&r[1]=='0'&&r[2]!='0'){
      getFourSquareVenueDetail(r[2], function(r){
        res.json({foursquare:r})
    })
    } else if(r[0]=='0'&&r[1]!='0'&&r[2]!='0'){
      getZomatoPageDetails(r[1],function(r1){
        var data = {}
        data.zomato = r1
      getFourSquareVenueDetail(r[2], function(r2){
        data.foursquare = r2
        res.json(data)
    })
      })
    } else if(r[0]!='0'&&r[1]=='0'&&r[2]!='0'){
      getFbPageDetails(r[0],function(r1){
        var data = {}
        data.fb = r1
        getFourSquareVenueDetail(r[2], function(r2){
          data.foursquare = r2
          res.json(data)
      })
      })
    } else {
      //invalid
    }
  })
})
app.post('/searchZomato', function(req, response, next) {
    var r = req.body;
    var url = host + '/search';
    var query = r.query.name;
    var search = '?q=' + query + '&count=30';
    var options = {
        url: url + search,
        headers: {
            'user-key': user_key,
            'content-type': 'application/json'
        }
    };
    request(options, function(req, res, error) {
      if(res){
        r = JSON.parse(res.body);
      }else{
        r = {'error':error}
      }
        console.log(r.restaurants[0].restaurant.location);
        var data = []
        for( var i=0; i< r.restaurants.length;i++){
        var obj = {
          id:r.restaurants[i].restaurant.id,
          name:r.restaurants[i].restaurant.name,
          location:r.restaurants[i].restaurant.location.address,
          city:r.restaurants[i].restaurant.location.city,
          rating:r.restaurants[i].restaurant.user_rating.aggregate_rating
        }
        data.push(obj);
        if(i==r.restaurants.length-1)
        response.json(data)
      }
    });
});
app.post('/getFourSquareSearch',function(req, res) {
  var r = req.body
  fetchFourSquare(r.query.city,r.query.name,function(r){
    res.json(r)
  })
})
app.post('/getFacebookList', function(req, res) {
    console.log('getRestaurant');
    var r = req.body;
    fetchFacebookData(r.query.name,function(r){
      res.json(r);
      console.log(r);
    });
});
function fetchFacebookData(name,callback){
  var options = {
      url: 'https://graph.facebook.com/search?q='+name+'&type=page&fields=id,name,likes,category,location&access_token='+accessToken
  };
  request(options, function(req, res, error) {
    if(res){
      r = JSON.parse(res.body);
    }else{
      r = {'error':error}
    }
      if(r.data){
      filterPages(r.data,function(r){
          if(callback)
          callback(r)
      });
    }else{
      return []
    }
  });
}
function filterPages(data,callback){
  var objs = [];
  for(var r of data){
      if(r.location&&r.location.country=='India')
        objs.push(r)
      else if(r.location == undefined||r.location.country == undefined){
        objs.push(r)
      }
  }
  objs.sort(function(a,b) {return (a.likes > b.likes) ? 1 : ((b.likes > a.likes) ? -1 : 0);});
  if(callback)
  callback(objs.reverse());
}
function fetchFourSquare(city,query,callback){
  console.log(city+query);
  var today = new Date()
  var dd = today.getDate()
  var mm = today.getMonth() + 1 //January is 0!
  var yyyy = today.getFullYear()
  var returned = 0
  if (dd < 10)
      dd = '0' + dd
  if (mm < 10)
      mm = '0' + mm
  var date = yyyy + '' + mm + '' + dd
  var url = fourSquare + 'near=' + city + '&query=' + query + '&oauth_token=' + fourSquareToken + '&v=' + date
  console.log(url);
  var options = {
      url: url,
      headers: {
          'user-key': user_key,
          'content-type': 'application/json'
      }
  };
  request(options, function(req, res, error) {
    var obj =[]
    if(res){
      r = JSON.parse(res.body);
      r=r.response.venues
      for(var u of r){
        obj.push({id:u.id,name:u.name,checkin:u.stats.checkinsCount,location:u.location,hasMenu:(u.hasMenu&&u.hasMenu==true)?true:false})
      }
    }else{
      obj = [{'error':error}]
    }
      if(callback)
      callback(obj)
  });
}
function decodeUrl(id,callback){
  var url = id.split('-')
  var fb = convertToId(url[0])
  var zomato = convertToId(url[1])
  var foursquare = url[2]
  if(callback&&fb&&zomato&&foursquare)
  callback([fb,zomato,foursquare])
}
function convertToId(value){
  var id = '';
  for( var i = 0;i<value.length; i++){
    id+=decodeNumbers[value[i]];
  }
  return id;
}
function getFbPageDetails(id,callback){
    var options = {
        url: 'https://graph.facebook.com/'+id+'/?fields=name,id,likes,link,about,phone,hours,description,albums.limit(6){photos.limit(10).height(300){images}},restaurant_services,cover.height(800),picture,events.limit(6){cover,name,start_time,place},posts.limit(6){message,full_picture,description},location&access_token='+accessToken
    };
    request(options, function(req, res, error) {
      var r;
      if(res){
        r = JSON.parse(res.body);
      }else{
        r = {'error':error}
      }
      if(callback)
      callback(r);
    });

}
function getZomatoPageDetails(id,callback){
  console.log(id);
  getRestaurantDetails(id,'restaurant',function(r){
    var obj = {};
    obj.restaurant = r;
    getRestaurantDetails(id,'reviews',function(r){
      obj.reviews = r;
        if(callback)
      callback(obj)
    })
  })
}
function getRestaurantDetails(id,detailType,callback){
  var url = host + '/' + detailType;
  var search = '?res_id=' + id;
  if(detailType == 'reviews')
  search += '&count=20';
  console.log(url+search);
  var options = {
      url: url + search,
      headers: {
          'user-key': user_key,
          'content-type': 'application/json'
      }
  };
  request(options, function(req, res, error) {
    if(res){
      r = JSON.parse(res.body);
    }else{
      r = {'error':error}
    }
      if(callback)
      callback(r)
  });
}
function getFourSquareVenueDetail(id,callback){
      var today = new Date()
      var dd = today.getDate()
      var mm = today.getMonth() + 1 //January is 0!
      var yyyy = today.getFullYear()
      var returned = 0
      if (dd < 10)
          dd = '0' + dd
      if (mm < 10)
          mm = '0' + mm
      var date = yyyy + '' + mm + '' + dd
      var url = 'https://api.foursquare.com/v2/venues/' + id + '?oauth_token=' + fourSquareToken + '&v=' + date
      var options = {
          url: url,
          headers: {
              'user-key': user_key,
              'content-type': 'application/json'
          }
      }
      request(options, function(req, res, error) {
        var obj = {}
        if(res){
          r = JSON.parse(res.body);
          console.log(r)
          if(r.response.venue){
            r = r.response.venue
            obj._id  = id
            obj.name = r.name
            obj.contact = r.contact
            obj.location = r.location
            obj.link = r.canonicalUrl
            obj.stats = r.stats
            obj.likes = r.likes
            obj.rating = r.rating
            obj.photos = r.photos
            obj.reviews = r.tips
            obj.bestPhoto = r.bestPhoto
          }else{
            obj = {'error':error}
          }
        }else{
          obj = {'error':error}
        }
          if(callback)
          callback(obj)
      })
}
app.listen(portNumber, function() {
    console.log('server listening at ' + portNumber);
});
