var eventToUse = 'tap';
$(document).ready(function() {
    makeTemplates();
    var pathname = window.location.pathname;
    pathname = pathname.slice(1);
    restaurant.getData({}, 'POST', pathname, function(a) {
        $('.loaderContainer').css('visibility', 'collapse')
        $('.mainContainer').css('overflow', 'visible')
        console.log(a)
        if(a.data.fb && a.data.zomato && a.data.foursquare){
          renderFbZomatoFourSquare(a.data)
        }else if (a.data.fb && a.data.zomato) {
            renderFbZomatoData(a.data)
        } else if (a.data.zomato) {
            renderZomatoData(a.data)
        } else if (a.data.fb) {
            renderFbData(a.data)
        } else {
            //no data recieved
        }
        loadFbApi(a.data.fb.picture.data.url)
    })
    $('.restaurantNameBlock').css('float', 'left')
    bind('.readMore', function() {
        $('.readMore').css('visibility', 'hidden')
        $('.aboutDescription').css('height', 'auto')
        $('.aboutDescription').css('max-height', '40rem')
        $('.aboutDescription').css('-webkit-line-clamp', 'initial')
        $('.aboutDescription').css('overflow', 'visible')
    })
    bind('.btnBooking', function() {
        $(".greetingPage").css("visibility", "visible")
        $(".greetingPage").hide()
        $(".greetingPage").fadeIn(500)
        bind(".crossIcon", function() {
            $(".greetingPage").fadeOut(500)
            setTimeout(function() {
                $(".greetingPage").css("visibility", "hidden")
            }, 500)
        })
    })
    loadTwitterApi()
});

function renderFbZomatoData(r) {
  render(".storyPage", "storyPage", {tag:quotes[Math.floor((Math.random() * 5))].tag})
  render(".welcomePageContainer", "welcomePage", {
    image: r.fb.cover.source
  })
    render(".restaurantName", "restaurantName", {
        name: r.fb.name
    });
    render(".headingName", "restaurantName", {
        name: r.fb.name
    });
    if (r.fb.description)
        render(".aboutDescription", "restaurantName", {
            name: r.fb.description
        });
    else
        render(".aboutDescription", "restaurantName", {
            name: r.fb.about
        });
    if ($('.aboutDescription').height() < 88) {
        $('.readMore').css('visibility', 'hidden')
    }
    if (r.fb.hours) {

    } else {

    }
    r.fb.photos = {
        data: []
    }
    if ((r.fb.albums.data[0] && r.fb.albums.data[1] && r.fb.albums.data[0].photos.data.length + r.fb.albums.data[1].photos.data.length > 9) || (r.fb.albums.data[0] && r.fb.albums.data[0].photos.data.length > 9)) {
        var j = 0
        var k = 0
        for (var i = 0; i < 9; i++) {
            if (r.fb.albums.data[0] && r.fb.albums.data[0].photos.data.length > j) {
                r.fb.photos.data.push(r.fb.albums.data[0].photos.data[j])
                j++
            } else if (r.fb.albums.data[1] && r.fb.albums.data[1].photos.data.length > k) {
                r.fb.photos.data.push(r.fb.albums.data[1].photos.data[j])
                k++
            }
        }
    } else {
        r.fb.photos.data.push({
            images: [{
                source: r.zomato.restaurant.featured_image
            }]
        })
        r.fb.photos.data.push({
            images: [{
                source: r.zomato.restaurant.thumb
            }]
        })
    }
    console.log(r);
    render(".paralexPageOneContainer", "paralexPage", {
      image: r.fb.photos.data[0].images[0].source
    })
    render(".paralexPageTwoContainer", "paralexPage", {
      image: r.fb.photos.data[1].images[0].source
    })
    render(".paralexPageThreeContainer", "paralexPageThree", {
      image: r.fb.photos.data[3].images[0].source
    })
    render(".reservationImageSectionContainer", "reservationImageSection", {
      image: r.fb.photos.data[4].images[0].source,
      quote: quotes[Math.floor((Math.random() * 5))].text,
      name: r.fb.name
    })
    render(".imageContainer", "image", r.fb.photos.data);
    renderReviews(r.zomato.reviews)
    r.zomato.address = ''
    r.zomato.street = ''
    r.fb.address = ''
    if (r.zomato.restaurant.location) {
        if (r.zomato.restaurant.location.address) {
            r.zomato.street += r.zomato.restaurant.location.address
        }
        if (r.fb.location && r.fb.location.country) {
            r.fb.address += r.fb.location.country
        }
        if (r.fb.location && r.fb.location.zip) {
            if (r.fb.address != '')
                r.fb.address += ','
            r.fb.address += r.fb.location.zip
        }
        console.log(r.fb);
        render(".addressBlock", "address", {
            address: r.fb.address,
            street: r.zomato.street
        })
        var mapUrl = ''
        if(r.fb.address&&r.zomato.street){
          mapUrl = "https://www.google.com/maps/embed/v1/place?q=" + r.zomato.street + r.fb.address+ "&key=AIzaSyDJWPGhfAQJGwGC3OOELU4kgdABZGs3AeU";
        }else if( r.zomato.restaurant.location.latitude<1&&r.fb.location&&r.fb.location.latitude){
          mapUrl = "https://maps.google.com/maps?q=" + r.fb.location.latitude + "," + r.fb.location.longitude + "&hl=es;z=14&amp;output=embed";
        }else{
        mapUrl = "https://maps.google.com/maps?q=" + r.zomato.restaurant.location.latitude + "," + r.zomato.restaurant.location.longitude + "&hl=es;z=14&amp;output=embed";
      }
      render(".mapPage", "map", {
            src: mapUrl
        })
    }
    if (r.fb.phone)
        render(".contactBlock", "contact", {
            phone: r.fb.phone
        })
    if (r.fb.events)
        renderEvents(r.fb.events.data)
}

function renderZomatoData(r) {
    render(".restaurantName", "restaurantName", {
        name: r.fb.name
    });
    render(".headingName", "restaurantName", {
        name: r.fb.name
    });
    //location zommato
    renderReviews(r.zomato.reviews)
    var mapUrl = "https://maps.google.com/maps?q=" + r.zomato.restaurant.location.latitude + "," + r.zomato.restaurant.location.longitude + "&hl=es;z=14&amp;output=embed"
    render(".mapPage", "map", {
        src: mapUrl
    })
}

function renderFbData(r) {
    render(".restaurantName", "restaurantName", {
        name: r.fb.name
    });
    render(".headingName", "restaurantName", {
        name: r.fb.name
    });
    if (r.fb.description)
        render(".aboutDescription", "restaurantName", {
            name: r.fb.description
        });
    else
        render(".aboutDescription", "restaurantName", {
            name: r.fb.about
        });
    r.fb.photos = {
        data: []
    }
    if ((r.fb.albums.data[0] && r.fb.albums.data[1] && r.fb.albums.data[0].photos.data.length + r.fb.albums.data[1].photos.data.length > 9) || (r.fb.albums.data[0] && r.fb.albums.data[0].photos.data.length > 9)) {
        var j = 0
        var k = 0
        for (var i = 0; i < 9; i++) {
            if (r.fb.albums.data[0] && r.fb.albums.data[0].photos.data.length > j) {
                r.fb.photos.data.push(r.fb.albums.data[0].photos.data[j])
                j++
            } else if (r.fb.albums.data[1] && r.fb.albums.data[1].photos.data.length > k) {
                r.fb.photos.data.push(r.fb.albums.data[1].photos.data[j])
                k++
            }
        }
    } else {
        r.fb.photos.data.push({
            images: [{
                source: r.zomato.restaurant.featured_image
            }]
        })
        r.fb.photos.data.push({
            images: [{
                source: r.zomato.restaurant.thumb
            }]
        })
    }
    render(".imageContainer", "image", r.fb.photos.data);
    if (r.fb.events)
        renderEvents(r.fb.events.data)
    r.fb.address = ''
    r.fb.street = ''
    if (r.fb.location) {
        if (r.fb.location.street) {
            r.fb.street += r.fb.location.street
        }
        if (r.fb.location.city) {
            r.fb.address += r.fb.location.city
        }
        if (r.fb.location.country) {
            if (r.fb.address != '')
                r.fb.address += ','
            r.fb.address += r.fb.location.country
        }
        if (r.fb.location.zip) {
            if (r.fb.address != '')
                r.fb.address += ','
            r.fb.address += r.fb.location.zip
        }
        console.log(r.fb);
        render(".addressBlock", "address", {
            address: r.fb.address,
            street: r.fb.street
        })
        if (r.fb.location.latitude) {
            var mapUrl = "https://maps.google.com/maps?q=" + r.fb.location.latitude + "," + r.fb.location.longitude + "&hl=es;z=14&amp;output=embed";
            render(".mapPage", "map", {
                src: mapUrl
            })
        }
    }
    if (r.fb.phone)
        render(".contactBlock", "contact", {
            phone: r.fb.phone
        })
}
function renderFbZomatoFourSquare(r){
  render(".storyPage", "storyPage", quotes[Math.floor((Math.random() * 5))])
  render(".welcomePageContainer", "welcomePage", {
    image: r.fb.cover.source
  })
    render(".restaurantName", "restaurantName", {
        name: r.fb.name
    });
    render(".headingName", "restaurantName", {
        name: r.fb.name
    });
    if (r.fb.description)
        render(".aboutDescription", "restaurantName", {
            name: r.fb.description
        });
    else
        render(".aboutDescription", "restaurantName", {
            name: r.fb.about
        });
    if ($('.aboutDescription').height() < 88) {
        $('.readMore').css('visibility', 'hidden')
    }
  r.fb.photos = {
      data: []
  }
  if(r.foursquare.photos){
    for(var u of  r.foursquare.photos.groups[0].items){
      console.log("----------");
      console.log(r);
    r.fb.photos.data.push({images:[{source:u.prefix+'800x800'+u.suffix}]})
  }
  }
  var r_length = r.fb.photos.data.length
  if ((r.fb.albums.data[0] && r.fb.albums.data[1] && r.fb.albums.data[0].photos.data.length + r.fb.albums.data[1].photos.data.length > 9) || (r.fb.albums.data[0] && r.fb.albums.data[0].photos.data.length > 9)) {
      var j = 0
      var k = 0
      for (var i = 0; i < 9-r_length; i++) {
          if (r.fb.albums.data[0] && r.fb.albums.data[0].photos.data.length > j) {
              r.fb.photos.data.push(r.fb.albums.data[0].photos.data[j])
              j++
          } else if (r.fb.albums.data[1] && r.fb.albums.data[1].photos.data.length > k) {
              r.fb.photos.data.push(r.fb.albums.data[1].photos.data[j])
              k++
          }
      }
  } else {
      r.fb.photos.data.push({
          images: [{
              source: r.zomato.restaurant.featured_image
          }]
      })
      r.fb.photos.data.push({
          images: [{
              source: r.zomato.restaurant.thumb
          }]
      })
  }
  console.log(r);
  render(".paralexPageOneContainer", "paralexPage", {
    image: r.fb.photos.data[0].images[0].source
  })
  render(".paralexPageTwoContainer", "paralexPage", {
    image: r.fb.photos.data[1].images[0].source
  })
  render(".paralexPageThreeContainer", "paralexPageThree", {
    image: r.fb.photos.data[3].images[0].source
  })
  render(".reservationImageSectionContainer", "reservationImageSection", {
    image: r.fb.photos.data[4].images[0].source,
    quote: quotes[Math.floor((Math.random() * 5))].text,
    name: r.fb.name
  })
  render(".imageContainer", "image", r.fb.photos.data);
  renderReviews(r.zomato.reviews)
  r.zomato.address = ''
  r.zomato.street = ''
  r.fb.address = ''
  if (r.zomato.restaurant.location) {
      if (r.zomato.restaurant.location.address) {
          r.zomato.street += r.zomato.restaurant.location.address
      }
      if (r.fb.location && r.fb.location.country) {
          r.fb.address += r.fb.location.country
      }
      if (r.fb.location && r.fb.location.zip) {
          if (r.fb.address != '')
              r.fb.address += ','
          r.fb.address += r.fb.location.zip
      }
      console.log(r.fb);
      render(".addressBlock", "address", {
          address: r.fb.address,
          street: r.zomato.street
      })
      var mapUrl = ''
      if(r.fb.address&&r.zomato.street){
        mapUrl = "https://www.google.com/maps/embed/v1/place?q=" + r.zomato.street + r.fb.address+ "&key=AIzaSyDJWPGhfAQJGwGC3OOELU4kgdABZGs3AeU";
      }else if( r.zomato.restaurant.location.latitude<1&&r.fb.location&&r.fb.location.latitude){
        mapUrl = "https://maps.google.com/maps?q=" + r.fb.location.latitude + "," + r.fb.location.longitude + "&hl=es;z=14&amp;output=embed";
      }else{
      mapUrl = "https://maps.google.com/maps?q=" + r.zomato.restaurant.location.latitude + "," + r.zomato.restaurant.location.longitude + "&hl=es;z=14&amp;output=embed";
    }
    render(".mapPage", "map", {
          src: mapUrl
      })
  }
  if (r.fb.phone)
      render(".contactBlock", "contact", {
          phone: r.fb.phone
      })
  if (r.fb.events)
      renderEvents(r.fb.events.data)
}
function renderReviews(data) {
    if (data.user_reviews) {
        var i = 0;
        for (var r of data.user_reviews) {
            if (i == 0)
                r.first = 1
            i++
            r.image = r.review.user.profile_image
            r.review_text = r.review.review_text
            r.user = r.review.user.name
        }
        render(".carousalContainer", "review", data);
        bind('.btnViewMore', function() {
            $('.carousalOverlay').css('display', 'block');
            $('.mainContainer').css('overflow-y', 'hidden');
            $(".carousalContainer").get(0).scrollIntoView();
            $('.reviewContainerBlock').scrollTop()
            render('.reviewContainerBlock', 'allReviews', data.user_reviews)
            $('.reviewContainer').addClass('slideUp');
            bind('.crossIcon', function() {
                $('.mainContainer').css('overflow-y', 'visible');
                $(".carousalContainer").get(0).scrollIntoView();
                $('.reviewContainer').removeClass('slideUp');
                $('.carousalOverlay').css('display', 'none');
            })
        });
    }
}

function renderEvents(events) {
    var obj = {
        data: []
    }
    for (var i = 0; i < events.length; i++) {
        if (events[i].cover)
            events[i].image = events[i].cover.source
        events[i].address = ''
        if (events[i].place.location) {
            if (events[i].place.location.street) {
                events[i].address += events[i].place.location.street
            }
            if (events[i].place.location.city) {
                if (events[i].address != '')
                    events[i].address += ','
                events[i].addresss += events[i].place.location.city
            }
            if (events[i].place.location.country) {
                if (events[i].address != '')
                    events[i].address += ','
                events[i].address += events[i].place.location.country
            }
            if (events[i].place.location.zip) {
                if (events[i].address != '')
                    events[i].address += ','
                events[i].address += events[i].place.location.zip
            }
        }
        events[i].start_time = new Date(events[i].start_time);
        events[i].start_time = events[i].start_time.getDate() + ' ' + month[parseInt(events[i].start_time.getMonth())] + ' ' + events[i].start_time.getFullYear();
        obj.data.push(events[i])
        if (i == events.length - 1) {
            console.log(obj);
            render('.eventPage', 'event', obj)
            bind('.btnBookEvent', showConfirmationContainer);
        }
    }
}

function showConfirmationContainer() {
    $('.confirmationContainer').addClass('slideConfirmationScreen');
    $('.carousalOverlay').css('display', 'block');
    $('.mainContainer').css('overflow-y', 'hidden');
    $(".eventContainer").get(0).scrollIntoView();
    bind('.btnConfirm', showThankYouContainer)
}

function showThankYouContainer() {
  console.log("jkgkjgvkjb");
  name = $('.placeholder.name').val();
  number = $('.placeholder.number').val();
    if (name != '' && number != '') {
        $('.thankYouContainer .name').text(name);
        $('.thankYouContainer').addClass('fadeIn');
        $('.target').text('');
        setTimeout(function() {
            $('.confirmationContainer').removeClass('slideConfirmationScreen');
            $('.thankYouContainer').removeClass('fadeIn');
            $('.mainContainer').css('overflow-y', 'visible');
            $('.carousalOverlay').css('display', 'none');
            $(".carousalContainer").get(0).scrollIntoView();
            $('.placeholder').val('');
        }, 1500);
    } else {
        $('.target').text('*Please fill in the all input fields');
    }
}

function loadFbApi(image) {
    window.fbAsyncInit = function() {
        FB.init({
            appId: '1001533829900641',
            status: true,
            cookie: true,
            xfbml: true
        });
    };
    (function() {
        var e = document.createElement('script');
        e.async = true;
        e.src = document.location.protocol +
            '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
    }());
    bind('.facebookBtn', function() {
        var url = window.location.href;
        console.log(image);
        FB.ui({
            method: 'feed',
            name: 'My Custom Website',
            link: url,
            picture: image,
            caption: '',
            description: "Create Your own custom website : " + url,
            message: ''
        });
    })
}

function loadTwitterApi() {
    ! function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + '://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, 'script', 'twitter-wjs');
}
