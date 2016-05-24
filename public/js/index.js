var eventToUse = 'tap';
var left = 0;
var endAnimation = 'webkitAnimationEnd animationend MSAnimationEnd oanimationend';
$(document).ready(function() {
    makeTemplates();
    bind('.btnStarted', selectFbDetails);
});
function selectFbDetails(){
    var resto = {}
    var selection = '0'
    var city = '0'
    $('.detailContainer').css('min-height','50rem')
    $(".detail").html('');
    $('.detail').css('display','block')
    $('.greetingPage').css('visibility','hidden')
    $('.emailContainer').css('visibility','hidden')
    resto.name = $('.searchBox').val();
    $('.navigationBar').addClass('magictime slideUp');
    $('.headerContainer').addClass('magictime slideUp');
    $('.searchContainer').addClass('magictime slideUp');
    $('.mainContainer').css('overflowY','hidden');
    setTimeout(function(){
      $('.detailOverlay').css('visibility','visible');
      $('.searchContainer').css('z-index','3');
      $('.detailOverlay').hide();
      $('.detailOverlay').fadeIn(700);
    },800);
    restaurant.getData(resto,'POST','getFacebookList',function(a){
      if(a.data.length==0){
        selectZomatoDetail(resto,selection,city)
      }
      a.pageType = "Facebook";
      a.image = "../images/fb.png"
      for(var i=0;i<a.data.length;i++){
        a.data[i].address = ''
      if(a.data[i].location){
        if(a.data[i].location.street){
          a.data[i].address += a.data[i].location.street
        }
        if(a.data[i].location.city){
          a.data[i].city = a.data[i].location.city
          if(a.data[i].address!='')
          a.data[i].address += ','
          a.data[i].address += a.data[i].location.city
        }
        if(a.data[i].location.country){
          if(a.data[i].address!='')
          a.data[i].address += ','
          a.data[i].address += a.data[i].location.country
        }
        if(a.data[i].location.zip){
          if(a.data[i].address!='')
          a.data[i].address += ','
          a.data[i].address += a.data[i].location.zip
        }
      }
      $('#circleG').css('visibility','hidden')
      if(i==a.data.length-1)
      render('.detail','suggestion',a);
    }
      console.log(a);
      bind('.card',function(){
        var name = $(this).find('#checkbox').attr('name');
        selection = name;
        $(this).addClass("selected");
        $(this).find('#checkbox').prop('checked', true);
        var data = JSLINQ(a.data)
        .Where(function(x){
          return (x.id == name)
        }).items[0];
        if(data.city){
          city = data.city
        }else{
          city = '0'
        }
        console.log($(this).attr('data-id'));
        for(var r of a.data){
          if(r.id!=name){
            $(".card[data-id='" + r.id + "']").removeClass("selected");
          $("#checkbox[name='" + r.id + "']").prop('checked', false);
        }
        }
      })
      bind('.skipBtn',function(){selectZomatoDetail(resto,'0','0')})
      bind('.nextBtn',function(){selectZomatoDetail(resto,selection,city)})
      console.log(a);
    });
}
function selectZomatoDetail(resto,fbSelection,city){
  var zomatoSelection = '0'
  var currentCity = '0'
  $(".detail").fadeOut(400);
  $('#circleG').css('visibility','visible')
  setTimeout(function(){
    $(".detail").html('');
    $(".detail").fadeIn(300);
    restaurant.getData(resto,'POST','searchZomato',function(a){
      if(a.data.length==0){
        selectFourSquareDetail(resto,fbSelection,zomatoSelection,city)
      }
      a.pageType = "Zomato";
      a.image = "../images/zomato.jpg";
      $('#circleG').css('visibility','hidden')
      render('.detail','suggestion',a);
      bind('.card',function(){
        var name = $(this).find('#checkbox').attr('name');
        var data = JSLINQ(a.data)
        .Where(function(x){
          return (x.id == name)
        }).items[0];
        if(data.city){
          currentCity = data.city
        }
        zomatoSelection = name;
        $(this).addClass("selected");
        $(this).find('#checkbox').prop('checked', true);
        console.log($(this).attr('data-id'));
        for(var r of a.data){
          if(r.id!=name){
            $(".card[data-id='" + r.id + "']").removeClass("selected");
          $("#checkbox[name='" + r.id + "']").prop('checked', false);
        }
        }
      })
      bind('.skipBtn',function(){
        selectFourSquareDetail(resto,fbSelection,'0',city)
      })
      bind('.nextBtn',function(){
        selectFourSquareDetail(resto,fbSelection,zomatoSelection,currentCity)
      })
      console.log(a);
    });
  },300)
}
function selectFourSquareDetail(resto,fbSelection,zomatoSelection,city) {
  var fourSquareSelection = '0';
  $(".detail").fadeOut(400);
  $('#circleG').css('visibility','visible')
  console.log();
  if((fbSelection=='0'&&zomatoSelection=='0')||city=='0'){
    loadWebFunction(fbSelection, zomatoSelection, fourSquareSelection)
  }else{
    resto.city = city
  setTimeout(function(){
    $(".detail").html('');
    $(".detail").fadeIn(300);
    restaurant.getData(resto,'POST','getFourSquareSearch',function(a){
      console.log(a);
      if(a==null){
        loadWebFunction(fbSelection, zomatoSelection, fourSquareSelection)
      }else{
      a.pageType = "FourSquare";
      a.image = "../images/foursquare.png"
      for(var r of a.data){
        r.location = r.location.formattedAddress
      }
      $('#circleG').css('visibility','hidden')
      render('.detail','suggestion',a)
      bind('.card',function(){
        var name = $(this).find('#checkbox').attr('name');
        fourSquareSelection = name;
        $(this).addClass("selected");
        $(this).find('#checkbox').prop('checked', true);
        console.log($(this).attr('data-id'));
        for(var r of a.data){
          if(r.id!=name){
            $(".card[data-id='" + r.id + "']").removeClass("selected");
            $("#checkbox[name='" + r.id + "']").prop('checked', false);
        }
        }
      })
      bind('.skipBtn',function(){
       loadWebFunction(fbSelection, zomatoSelection, fourSquareSelection)
      })
      bind('.nextBtn',function(){
        loadWebFunction(fbSelection, zomatoSelection, fourSquareSelection)
      })
      console.log(a);
    }
    });
  },300)
}
}
function loadWebFunction(fbSelection, zomatoSelection, fourSquareSelection) {
  $(".detail").html('');
  if(fbSelection=='0'&&zomatoSelection=='0'&&fourSquareSelection=='0'){
    $('.detailContainer').css('min-height','28rem')
    $('.emailContainer').css('visibility','visible')
    bind('.sendEmail',function(){
      $('.emailContainer').css('visibility','hidden')
      $('.greetingPage').css('visibility','visible')
    setTimeout(function(){
      $('.navigationBar').removeClass('magictime slideDown')
      $('.headerContainer').removeClass('magictime slideDown')
      $('.searchContainer').removeClass('magictime slideDown')

      $('.detailOverlay').css('visibility','hidden')
      $('.greetingPage').css('visibility','hidden')
      $('.searchContainer').css('z-index','1')
    },2000)
    })
  }else{
    url= 'preview' + '/' +generateUrl(fbSelection) + '-' + generateUrl(zomatoSelection) + '-' + fourSquareSelection
    console.log(url);
    window.location=appUrl+url;
    restaurant.getData({},'GET',url,function(a){
      console.log(a);
    })
  }
}
function generateUrl(fb){
  var url = '';
  for (var i=0; i<fb.length; i++){
    url+=charaters[parseInt(fb[i])];
  }
  return url;
}
