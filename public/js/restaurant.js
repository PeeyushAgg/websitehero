var restaurant= new function() {
  this.getData = function(x,request_type ,command , callback) {
      x.query = {name: x.name,city : x.city?x.city:'0'};
       x.find = {id: x.id};
      x.data = [];
      execute(command,request_type, {
          query: x.query,
        },
        function(r) {
          x.data = r;
          console.log(r);
          callback(x);
        }, callback);
    }
}
