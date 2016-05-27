var eventToUse = 'tap';
var geocoder;
var map;
$(document).ready(function() {
    makeTemplates();
    var pathname = window.location.pathname;
    pathname = pathname.slice(1);
    restaurant.getData({}, 'POST', pathname, function(a) {
        $('.loaderContainer').css('visibility', 'collapse')
        $('.mainContainer').css('overflow', 'visible')
        console.log(a)
        if(a.data.fb && a.data.zomato && a.data.foursquare) {
          fb(a.data,function(r){
            fbFoursquarePhoto(a.data,function(r){
              zomatoFbAddress(a.data,function(r){
                renderReviews(a.data)
                // $(document).on("scroll", onScroll)
                // loadTwitterApi()
                // scrollByMenu()
              })
            })
          })
        } else if (a.data.fb && a.data.zomato) {
          fb(a.data,function(r){
            fbPhoto(a.data,function(r){
              zomatoFbAddress(a.data,function(r){
                renderReviews(a.data)
                $(document).on("scroll", onScroll)
                loadTwitterApi()
                scrollByMenu()
              })
            })
          })
        } else if (a.data.fb && a.data.foursquare) {
          fb(a.data,function(r){
            fbFoursquarePhoto(a.data,function(r){
              fbAddress(a.data,function(r){
                renderReviews(a.data)
                $(document).on("scroll", onScroll)
                loadTwitterApi()
                scrollByMenu()
              })
            })
          })
        } else if(a.data.fb){
          fb(a.data,function(r){
            fbPhoto(a.data,function(r){
              fbAddress(a.data,function(r){
                $(document).on("scroll", onScroll)
                loadTwitterApi()
                scrollByMenu()
              })
            })
          })
        } else{
          //not much available data
        }
        loadFbApi(a.data.fb?a.data.fb.picture.data.url:'')
        loadTwitterApi()
        $('.widgetNew').mouseenter(function(){
            $(this).css('width','13rem');
            $(this).find('.text').removeClass('hide');
        })
        $('.widgetNew').mouseleave(function(){
            $(this).css('width','4rem');
            $(this).find('.text').addClass('hide');
        })
        bind('.personBlock', function showSelectedNumber() {
          $('.personBlock').removeClass('selectedPerson');
          $(this).addClass('selectedPerson');
        });
        bind('.btnClaim', function(){
          $('.signUpContainer').css('display','block');
          $('.carousalOverlay').css('display', 'block');
          $('.mainContainer').css('overflow-y', 'hidden');
          bind('.crossIcon', function(){
            $('.signUpContainer').css('display','none');
            $('.carousalOverlay').css('display', 'none');
            $('.mainContainer').css('overflow-y', 'visible');
            $(".signUpContainer").get(0).scrollIntoView();
          })
        });
        $('.restaurantNameBlock').css('float', 'left')
        bind('.btnReadMore', function() {
            $('.aboutDescription').css('height', 'auto')
            $('.aboutDescription').css('max-height', '40rem')
            $('.btnReadMore').css('visibility', 'hidden')
            $('.btnReadMore').css('height', '0rem')
            $('.aboutDescription').css('overflow', 'visible')
        })
        bind('.btnBooking', function() {
            $(".greetingPage").css("visibility", "visible")
            $(".greetingPage").hide()
            $(".greetingPage").fadeIn(500)
            setTimeout(function() {
                $(".greetingPage").fadeOut(500)
                setTimeout(function() {
                    $(".greetingPage").css("visibility", "hidden")
                }, 500)
            },2000)
        })

    })
});
function foursquarePhoto(r,callback){
  var count = 0
  r.fb = {}
  r.fb.photos = {
      data: []
  }
  if(r.foursquare.photos){
    for(var u of  r.foursquare.photos.groups[0].items){
    r.fb.photos.data.push({images:[{source:u.prefix+'800x800'+u.suffix}],count:count})
    count++
  }
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
  if(r.fb.photos.data.length>12){
    r.fb.photos.data[11].total = r.fb.photos.data.length
  }
  console.log(r.fb.photos.data[11])
  render(".imageContainer", "image", r.fb.photos.data.length<=12?r.fb.photos.data:r.fb.photos.data.slice(0, 12));
  if(r.fb.photos.data.length>12){
  bind('.imageViewerTab', function(){
    $(".imageViewer").css('display','block')
    $('.carousalOverlay').css('display', 'block');
    $('.mainContainer').css('overflow-y', 'hidden');
    $(".imageViewer").get(0).scrollIntoView();
    render(".imageViewer", "imageViewer", {data:r.fb.photos.data});
    render(".imageBlock", "imageViewer", {data:r.fb.photos.data});
    bind('.nextBtn',function(){
      var id = $('.activeImage').attr('data-id')
      if(id<r.fb.photos.data.length-1){
      $('#image'+id).removeClass('activeImage')
      $('#imageImg'+id).removeClass('activeImg')
      id++
      $('#image'+id).addClass('activeImage')
      $('#imageImg'+id).addClass('activeImg')
    }
    })
    bind('.cross', function(){
      $('.imageViewer').css('display','none');
      $('.carousalOverlay').css('display', 'none');
      $('.mainContainer').css('overflow-y', 'visible');
      $(".imageContainer").get(0).scrollIntoView();
    })
    bind('.preBtn',function(){
      var id = $('.activeImage').attr('data-id')
      if(id>0){
      $('#image'+id).removeClass('activeImage')
      $('#imageImg'+id).removeClass('activeImg')
      id--
      $('#image'+id).addClass('activeImage')
      $('#imageImg'+id).addClass('activeImg')
    }
    })
})
}
if(callback)
callback()
}
function fbPhoto(r,callback){
  var count = 0
  r.fb.photos = {
      data: []
  }
  for(var v of r.fb.albums.data){
    if(v&&v.photos&&v.photos.data){
    for(var u of v.photos.data){
      u.count = count
      r.fb.photos.data.push(u)
      count++
    }
  }
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
  if(r.fb.photos.data.length>12){
    r.fb.photos.data[11].total = r.fb.photos.data.length
  }
  console.log(r.fb.photos.data[11])
  render(".imageContainer", "image", r.fb.photos.data.length<=12?r.fb.photos.data:r.fb.photos.data.slice(0, 12));
  bind('.imageBlock',function(){
    var shift = 0
    var windowWidth = ($( window ).width()-80)
    $(".imageViewer").css('display','block')
    $('.carousalOverlay').css('display', 'block');
    $('.mainContainer').css('overflow-y', 'hidden');
    $(".imageViewer").get(0).scrollIntoView();
    render(".imageViewer", "imageViewer", {data:r.fb.photos.data})
    var itemWidth = -$('.bottomImageBlock').width()*r.fb.photos.data.length/10 + 40 + $( window ).width()/20
    $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
    $('#imageImg'+$('.activeImage').attr('data-id')).removeClass('activeImg')
    $('#image'+$('.activeImage').attr('data-id')).removeClass('activeImage')
      $('#image'+$(this).attr('data-id')).addClass('activeImage')
      $('#imageImg'+$(this).attr('data-id')).addClass('activeImg')
      $('#bottomImage'+$('.activeImage').attr('data-id')).addClass('activeBottomImage')
      $( ".bottomImageContainer" ).mousemove(function( event ) {
          var msg = "Handler for .mousemove() called at ";
          msg += event.pageX + ", " + event.pageY;
          console.log($('.bottomImageBlock').height()*r.fb.photos.data.length);
          if(event.pageX > windowWidth && shift > itemWidth){
            shift-=2
            $( ".bottomImageContainer" ).css('left',shift+'rem')
          }
          if(event.pageX > 0 && event.pageX <70 && shift<-2 ){
            shift+=2
            $( ".bottomImageContainer" ).css('left',shift+'rem')
          }
        });
      bind('.bottomImageBlock', function(){
        var id = $(this).attr('data-id')
        $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
        $(this).addClass('activeBottomImage')
        $('#imageImg'+$('.activeImage').attr('data-id')).removeClass('activeImg')
        $('#image'+$('.activeImage').attr('data-id')).removeClass('activeImage')
          $('#image'+id).addClass('activeImage')
          $('#imageImg'+id).addClass('activeImg')
      })
      bind('.nextBtn',function(){
        var id = $('.activeImage').attr('data-id')
        if(id<r.fb.photos.data.length-1){
          $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
        $('#image'+id).removeClass('activeImage')
        $('#imageImg'+id).removeClass('activeImg')
        id++
        $('#bottomImage'+id).addClass('activeBottomImage')
        $('#image'+id).addClass('activeImage')
        $('#imageImg'+id).addClass('activeImg')
      }
      })
      bind('.cross', function(){
        $('.imageViewer').css('display','none');
        $('.carousalOverlay').css('display', 'none');
        $('.mainContainer').css('overflow-y', 'visible');
        $(".imageContainer").get(0).scrollIntoView();
      })
      bind('.preBtn',function(){
        var id = $('.activeImage').attr('data-id')
        if(id>0){
          $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
        $('#image'+id).removeClass('activeImage')
        $('#imageImg'+id).removeClass('activeImg')
        id--
        $('#bottomImage'+id).addClass('activeBottomImage')
        $('#image'+id).addClass('activeImage')
        $('#imageImg'+id).addClass('activeImg')
      }
      })
  })
  if(r.fb.photos.data.length>12){

  bind('.imageViewerTab', function(){
    var shift = 0
    var windowWidth = ($( window ).width()-80)
    $(".imageViewer").css('display','block')
    $('.carousalOverlay').css('display', 'block');
    $('.mainContainer').css('overflow-y', 'hidden');
    $(".imageViewer").get(0).scrollIntoView();
    render(".imageViewer", "imageViewer", {data:r.fb.photos.data})
    var itemWidth = -$('.bottomImageBlock').width()*r.fb.photos.data.length/10 + 40 + $( window ).width()/20
    $( ".bottomImageContainer" ).mousemove(function( event ) {
        var msg = "Handler for .mousemove() called at ";
        msg += event.pageX + ", " + event.pageY;
        console.log($('.bottomImageBlock').height()*r.fb.photos.data.length);
        if(event.pageX > windowWidth && shift > itemWidth){
          shift-=2
          $( ".bottomImageContainer" ).css('left',shift+'rem')
        }
        if(event.pageX > 0 && event.pageX <70 && shift<-2 ){
          shift+=2
          $( ".bottomImageContainer" ).css('left',shift+'rem')
        }

      });
    bind('.bottomImageBlock', function(){
      var id = $(this).attr('data-id')
      $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
      $(this).addClass('activeBottomImage')
      $('#imageImg'+$('.activeImage').attr('data-id')).removeClass('activeImg')
      $('#image'+$('.activeImage').attr('data-id')).removeClass('activeImage')
        $('#image'+id).addClass('activeImage')
        $('#imageImg'+id).addClass('activeImg')
    })

    bind('.nextBtn',function(){
      var id = $('.activeImage').attr('data-id')
      if(id<r.fb.photos.data.length-1){
        $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
      $('#image'+id).removeClass('activeImage')
      $('#imageImg'+id).removeClass('activeImg')
      id++
      $('#bottomImage'+id).addClass('activeBottomImage')
      $('#image'+id).addClass('activeImage')
      $('#imageImg'+id).addClass('activeImg')
    }
    })
    bind('.cross', function(){
      $('.imageViewer').css('display','none');
      $('.carousalOverlay').css('display', 'none');
      $('.mainContainer').css('overflow-y', 'visible');
      $(".imageContainer").get(0).scrollIntoView();
    })
    bind('.preBtn',function(){
      var id = $('.activeImage').attr('data-id')
      if(id>0){
        $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
      $('#image'+id).removeClass('activeImage')
      $('#imageImg'+id).removeClass('activeImg')
      id--
      $('#bottomImage'+id).addClass('activeBottomImage')
      $('#image'+id).addClass('activeImage')
      $('#imageImg'+id).addClass('activeImg')
    }
    })
})
}
if(callback)
callback()
}
function fbFoursquarePhoto(r,callback){
  var count = 0
  r.fb.photos = {
      data: []
  }
  if(r.foursquare.photos){
    for(var u of  r.foursquare.photos.groups[0].items){
    r.fb.photos.data.push({images:[{source:u.prefix+'800x800'+u.suffix}],count:count})
    count++
  }
  }
  for(var v of r.fb.albums.data){
    if(v&&v.photos&&v.photos.data){
    for(var u of v.photos.data){
      u.count = count
      r.fb.photos.data.push(u)
      count++
    }
  }
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
  if(r.fb.photos.data.length>12){
    r.fb.photos.data[11].total = r.fb.photos.data.length
  }
  render(".imageContainer", "image", r.fb.photos.data.length<=12?r.fb.photos.data:r.fb.photos.data.slice(0, 12));
  bind('.imageBlock',function(){
    var shift = 0
    var windowWidth = ($( window ).width()-80)
    $(".imageViewer").css('display','block')
    $('.carousalOverlay').css('display', 'block');
    $('.mainContainer').css('overflow-y', 'hidden');
    $(".imageViewer").get(0).scrollIntoView();
    render(".imageViewer", "imageViewer", {data:r.fb.photos.data})
    var itemWidth = -$('.bottomImageBlock').width()*r.fb.photos.data.length/10 + 40 + $( window ).width()/20
    $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
    $('#imageImg'+$('.activeImage').attr('data-id')).removeClass('activeImg')
    $('#image'+$('.activeImage').attr('data-id')).removeClass('activeImage')
      $('#image'+$(this).attr('data-id')).addClass('activeImage')
      $('#imageImg'+$(this).attr('data-id')).addClass('activeImg')
      $('#bottomImage'+$('.activeImage').attr('data-id')).addClass('activeBottomImage')
      $( ".bottomImageContainer" ).mousemove(function( event ) {
          var msg = "Handler for .mousemove() called at ";
          msg += event.pageX + ", " + event.pageY;
          console.log($('.bottomImageBlock').height()*r.fb.photos.data.length);
          if(event.pageX > windowWidth && shift > itemWidth){
            shift-=2
            $( ".bottomImageContainer" ).css('left',shift+'rem')
          }
          if(event.pageX > 0 && event.pageX <70 && shift<-2 ){
            shift+=2
            $( ".bottomImageContainer" ).css('left',shift+'rem')
          }
        });
      bind('.bottomImageBlock', function(){
        var id = $(this).attr('data-id')
        $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
        $(this).addClass('activeBottomImage')
        $('#imageImg'+$('.activeImage').attr('data-id')).removeClass('activeImg')
        $('#image'+$('.activeImage').attr('data-id')).removeClass('activeImage')
          $('#image'+id).addClass('activeImage')
          $('#imageImg'+id).addClass('activeImg')
      })
      bind('.nextBtn',function(){
        var id = $('.activeImage').attr('data-id')
        if(id<r.fb.photos.data.length-1){
          $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
        $('#image'+id).removeClass('activeImage')
        $('#imageImg'+id).removeClass('activeImg')
        id++
        $('#bottomImage'+id).addClass('activeBottomImage')
        $('#image'+id).addClass('activeImage')
        $('#imageImg'+id).addClass('activeImg')
      }
      })
      bind('.cross', function(){
        $('.imageViewer').css('display','none');
        $('.carousalOverlay').css('display', 'none');
        $('.mainContainer').css('overflow-y', 'visible');
        $(".imageContainer").get(0).scrollIntoView();
      })
      bind('.preBtn',function(){
        var id = $('.activeImage').attr('data-id')
        if(id>0){
          $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
        $('#image'+id).removeClass('activeImage')
        $('#imageImg'+id).removeClass('activeImg')
        id--
        $('#bottomImage'+id).addClass('activeBottomImage')
        $('#image'+id).addClass('activeImage')
        $('#imageImg'+id).addClass('activeImg')
      }
      })
  })
  if(r.fb.photos.data.length>12){
  bind('.imageViewerTab', function(){
    var shift = 0
    var windowWidth = ($( window ).width()-80)
    $(".imageViewer").css('display','block')
    $('.carousalOverlay').css('display', 'block');
    $('.mainContainer').css('overflow-y', 'hidden');
    $(".imageViewer").get(0).scrollIntoView();
    render(".imageViewer", "imageViewer", {data:r.fb.photos.data})
    var itemWidth = -$('.bottomImageBlock').width()*r.fb.photos.data.length/10 + 40 + $( window ).width()/20
    $( ".bottomImageContainer" ).mousemove(function( event ) {
        var msg = "Handler for .mousemove() called at ";
        msg += event.pageX + ", " + event.pageY;
        console.log($('.bottomImageBlock').height()*r.fb.photos.data.length);
        if(event.pageX > windowWidth && shift > itemWidth){
          shift-=2
          $( ".bottomImageContainer" ).css('left',shift+'rem')
        }
        if(event.pageX > 0 && event.pageX <70 && shift<-2 ){
          shift+=2
          $( ".bottomImageContainer" ).css('left',shift+'rem')
        }

      });
    bind('.bottomImageBlock', function(){
      var id = $(this).attr('data-id')
      $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
      $(this).addClass('activeBottomImage')
      $('#imageImg'+$('.activeImage').attr('data-id')).removeClass('activeImg')
      $('#image'+$('.activeImage').attr('data-id')).removeClass('activeImage')
        $('#image'+id).addClass('activeImage')
        $('#imageImg'+id).addClass('activeImg')
    })
    bind('.nextBtn',function(){
      var id = $('.activeImage').attr('data-id')
      if(id<r.fb.photos.data.length-1){
        $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
      $('#image'+id).removeClass('activeImage')
      $('#imageImg'+id).removeClass('activeImg')
      id++
      $('#bottomImage'+id).addClass('activeBottomImage')
      $('#image'+id).addClass('activeImage')
      $('#imageImg'+id).addClass('activeImg')
    }
    })
    bind('.cross', function(){
      $('.imageViewer').css('display','none');
      $('.carousalOverlay').css('display', 'none');
      $('.mainContainer').css('overflow-y', 'visible');
      $(".imageContainer").get(0).scrollIntoView();
    })
    bind('.preBtn',function(){
      var id = $('.activeImage').attr('data-id')
      if(id>0){
        $('#bottomImage'+$('.activeImage').attr('data-id')).removeClass('activeBottomImage')
      $('#image'+id).removeClass('activeImage')
      $('#imageImg'+id).removeClass('activeImg')
      id--
      $('#bottomImage'+id).addClass('activeBottomImage')
      $('#image'+id).addClass('activeImage')
      $('#imageImg'+id).addClass('activeImg')
    }
    })
})
}
if(callback)
callback()
}
function fb(r,callback){
  var  isEvent = 0
  if(r.fb&&r.fb.events){
    isEvent = 1
  }
  render(".welcomePageContainer", "welcomePage", {
    image: r.fb.cover.source,
    isEvent: isEvent
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
        if ($('.aboutDescription').height() < 70) {
            $('.btnReadMore').css('visibility', 'hidden')
        }
        if(callback)
        callback()
}
function fbAddress(r,callback){
  render(".storyPage", "storyPage", {tag:quotes[Math.floor((Math.random() * 5))].tag,name:r.fb.name})
  r.fb.address = ''
  if (r.fb.location) {
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
          street: r.fb.location&&r.fb.location.street?r.fb.location.street:''
      })
      var mapUrl
    if(r.fb.location&&r.fb.location.latitude){
        mapUrl = "https://maps.google.com/maps?q=" + r.fb.location.latitude + "," + r.fb.location.longitude + "&hl=es;z=14&amp;output=embed";
        render(".mapPage", "map", {
              src: mapUrl,
              address: ((r.fb.location)?(r.fb.location.street+','):'')+r.fb.address
          })
      }

  }
  if (r.fb.phone)
      render(".contactBlock", "contact", {
          phone: r.fb.phone
      })
  if (r.fb.events)
      renderEvents(r.fb.events.data)
  if(callback)
  callback()
}
function zomatoFbAddress(r,callback){
  render(".storyPage", "storyPage", {tag:quotes[Math.floor((Math.random() * 5))].tag,name:r.fb.name})
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
      var mapUrl
    if(r.fb.location&&r.fb.location.latitude){
        mapUrl = "https://maps.google.com/maps?q=" + r.fb.location.latitude + "," + r.fb.location.longitude + "&hl=es;z=14&amp;output=embed";
      }else{
      mapUrl = "https://maps.google.com/maps?q=" + r.zomato.restaurant.location.latitude + "," + r.zomato.restaurant.location.longitude + "&hl=es;z=14&amp;output=embed";
    }
    render(".mapPage", "map", {
          src: mapUrl,
          address: ((r.zomato.street==''&&r.fb.location.street)?(r.fb.location.street+','):r.zomato.street)+r.fb.address
      })
  }
  if (r.fb.phone)
      render(".contactBlock", "contact", {
          phone: r.fb.phone
      })
  if (r.fb.events)
      renderEvents(r.fb.events.data)
  if(callback)
  callback()
}
function renderReviews(r) {
  data = {user_reviews:[]}
  if(r.zomato&&r.zomato.reviews)
  data1 = r.zomato.reviews
  data.type = reviewSelecter[Math.floor((Math.random() * 3))].type
  $("."+data.type).css('display','block')
    if (r.zomato&&r.zomato.reviews&&data1.user_reviews) {
        var i = 0;
        for (var u of data1.user_reviews) {
            if (i == 0)
                u.first = 1
            i++
            u.image = u.review.user.profile_image
            u.review_text = u.review.review_text
            u.user = u.review.user.name
            data.user_reviews.push(u)
        }
      }
      if(r.foursquare&&r.foursquare.reviews&&r.foursquare.reviews.groups&&r.foursquare.reviews.groups[1]){
        var i = 0;
        for(var u of r.foursquare.reviews.groups[1].items){
          if(!r.zomato){
          if (i == 0)
              u.first = 1
          i++
          }
          u.image = u.user.photo.prefix+'100x100'+u.user.photo.suffix
          u.review_text = u.text
          u.user = u.user.firstName
          data.user_reviews.push(u)
        }
      }
        if(data.type == 'typeOne'){
          render("."+data.type, "review", data);
        }else{
          render("."+data.type, "review", {type:data.type,user_reviews:data.user_reviews.slice(0,4)});
        }
        bind('.btnViewMore', function() {
            $('.carousalOverlay').css('display', 'block');
            $('.mainContainer').css('overflow-y', 'hidden');
            $(".carousalContainer").get(0).scrollIntoView();
            $('.reviewContainerBlock').scrollTop()
            render('.reviewContainerBlock', 'allReviews', data.user_reviews)
            $('.reviewContainer').addClass('slideUp');
            bind('.carousalOverlay', function() {
                $('.mainContainer').css('overflow-y', 'visible');
                $('.carousalOverlay').css('display', 'none');
                $(".carousalContainer").get(0).scrollIntoView();
                $('.reviewContainer').removeClass('slideUp');
            })
        });
}

function renderEvents(events) {
    var obj = {
        data: []
    }
    for (var i = 0; i < events.length; i++) {
        if (events[i].cover)
            events[i].image = events[i].cover.source
        events[i].address = ''
        if (events[i].place&&events[i].place.location) {
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
            bind('.btnBookEvent', function(){showConfirmationContainer($(this).attr('data-id'),events)});
        }
    }
}

function showConfirmationContainer(id,events) {
  var data = JSLINQ(events)
    .Where(function(x){
      return (x.name == id)
    }).items[0];
  $('.confirmationContainer').addClass('slideConfirmationScreen');
  render('.confirmationContainer','confirmation',data)
  $('.carousalOverlay').css('display', 'block');
  $('.mainContainer').css('overflow-y', 'hidden');
  $(".eventContainer").get(0).scrollIntoView();

  bind('.numberBlock', function showSelectedNumber() {
    $('.numberBlock').removeClass('selectedNumber');
    $(this).addClass('selectedNumber');
  });

  bind('.btnConfirm', showThankYouContainer)
  bind('.carousalOverlay', function(){
    $('.confirmationContainer').removeClass('slideConfirmationScreen');
    $('.mainContainer').css('overflow-y', 'visible');
    $(".eventPage").get(0).scrollIntoView();
    $('.carousalOverlay').css('display', 'none');
  })
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
            $(".eventPage").get(0).scrollIntoView();
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
function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('.option').each(function() {
        var currLink = $(this);
        var refElement = $(currLink.attr("data-link"));
        console.log(refElement.position().top)
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('.option').removeClass("activeNav");
            currLink.addClass("activeNav");
        } else {
            currLink.removeClass("activeNav");
        }
    });
}

function scrollByMenu() {
    $('.option').on('click', function(e) {
        e.preventDefault();
        $(document).off("scroll");
        $('.navTabContainer').removeClass('showNavOption');
        if ($('.navbarHeader').width() > 500) {
            $('.option').each(function() {
                $(this).removeClass('activeNav');
            })
            $(this).addClass('activeNav');
        }
        var target = $(this).attr('data-link'),
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top + 2
        }, 500, 'swing', function() {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
}
