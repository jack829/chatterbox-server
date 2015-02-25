var app;
$(function() {
  app = {
    //server: 'https://api.parse.com/1/classes/chatterbox/',
    //server: 'http://127.0.0.1:3000/classes/chatterbox/',
    rooms: {},
    friends: {},
    // username: 'anonymous',
    // roomname: 'lobby',
    // lastMessageId: 0,
    // friends: {},
    init : function() {
      app.username= window.location.search.substr(10);
      app.$main = $('#main');
      app.$message = $('#message');
      app.$chats = $('#chats');
      app.$roomSelect = $('#roomSelect');
      app.$send = $('#send');
      

      //$('#send .submit').on('submit', app.handleSubmit());
      app.$chats.on('click', '.username', app.addFriend);
      app.$send.on('submit', app.handleSubmit);
      app.$roomSelect.on('change', app.saveRoom);
      app.fetch();
      setInterval(app.clearMessages, 5000);
      setInterval(app.fetch, 5000);
    },

    fetch : function() {
      $.ajax({
        url: app.server ,
        type: 'GET',
        data: {order: '-createdAt'},
        contentType: 'application/json',
        success: function(data){
          // console.log('chatterbox: message received');
          // console.log(JSON.parse(data));
          var messageData = JSON.parse(data);
          _.each(messageData.results, function(message){
            if( message.roomname === app.$roomSelect.val()){
              app.addMessage(message);
            } else {
              app.addRoom(app.escapeHtml(message.roomname));
              app.addMessage(message);
            }
          });
        },
        error: function(data){
          console.error('chatterbox: failed to receive message');
        },
      });
    },

    send : function(message) {
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent. Data: ');
          console.log(data);
          app.clearMessages();
          app.fetch();
        },
        error: function (data) {
          // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });
    },

    clearMessages : function() {  
      $('.message').remove();
    },

    addMessage : function(message) {
      message.roomname = app.escapeHtml(message.roomname) || 'lobby';

      if(!app.friends[message.username]){
        $('#chats').append('<div class="message"><p><a href="#" class="username">' + app.escapeHtml(message.username) + '</a>: ' + app.escapeHtml(message.text) +'. In room: ' + app.escapeHtml(message.roomname) +'</p><p>' + app.escapeHtml(message.createdAt) + '</p></div>');
      } else {
        $('#chats').append('<div class="message"><p class="friend"><a href="#" class="username">' + app.escapeHtml(message.username) + '</a>: ' + app.escapeHtml(message.text) +'. In room: ' + app.escapeHtml(message.roomname) +'</p><p>' + app.escapeHtml(message.createdAt) + '</p></div>');
      }
    },

    addRoom : function(room) {
      if(!rooms[room]){
        $('#roomSelect').append('<option value="' + room + '">'+ room +'</option>');
        rooms[room] = true;
      }
    },

    saveRoom: function(event){
      app.clearMessages();
      app.fetch();
    },

    addFriend : function(event){
      if(!app.friends[$(event.target).text()]){
        app.friends[$(event.target).text()] = true;
      }
      console.log($(event.target));
      app.clearMessages();
      app.fetch();
    },    

    handleSubmit : function(evt){
      var message = { username: app.username,
                    text: app.$message.val(),
                    roomname: $('#roomname').val() || app.$roomSelect.val() || 'lobby' };
      app.send(message);

      app.addRoom(message.roomname);
      //app.clearMessages();
      //app.fetch();

      evt.preventDefault();
      // $('#send').submit( function(event){
      //   app.send({ "username": window.location.search.substr(10),
      //               "message": $('#message').val(),
      //               "roomname": $('roomname').val() });
      //   app.clearMessages();
      //   app.fetch();
      //   // app.addRoom($('#roomname').val());
      //   // //$('roomSelect').append()
      //   event.preventDefault();
      // });
    },
    escapeHtml : function(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

  };
  }());

// var App = function() { 
//   app.server = 'https://api.parse.com/1/classes/chatterbox';
// };

// App.prototype.init = function() {
//   $('#send .submit').on('submit', app.handleSubmit());
//   $('.username').on('click', this.addFriend());
//   $('#send').on('submit', this.handleSubmit);
//   this.fetch();
//   // setInterval(this.clearMessages.bind(this), 5000);
//   // setInterval(this.fetch.bind(this), 5000);
// };

// App.prototype.fetch = function() {
//   var that = this;
//   $.ajax({
//     url: this.server + '?order=-updatedAt',
//     type: 'GET',
//     contentType: 'application/json',
//     success: function(data){
//       console.log('chatterbox: message received');
//       console.log(data);
//       _.each(data.results, function(message){
//         that.addMessage(message);
//         // $('#main').append('<div class= "message"><p>' + that.escapeHtml(message.username) + ': ' + that.escapeHtml(message.text) +'. In room: ' + that.escapeHtml(message.roomname) +'</p><p>' + that.escapeHtml(message.createdAt) + '</p></div>');
//       });
//       //iterate through all results
//       //assign to div
//       //more readable texts
//     },
//     error: function(data){
//       console.error('chatterbox: failed to receive message');
//     },
//   });
//   //setInterval(this.fetch(), 50000);
// };

// App.prototype.send = function(message) {
//   $.ajax({
//     url: this.server,
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent. Data: ');
//       console.log(data);
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message');
//     }
//   });
// };

// App.prototype.clearMessages = function() {
//   $('.message').remove();
// };

// App.prototype.addMessage = function(message) {
//   message.roomname = message.roomname || 'lobby';
//   $('#chats').append('<div><p><a class="username">' + this.escapeHtml(message.username) + '</a>: ' + this.escapeHtml(message.text) +'. In room: ' + this.escapeHtml(message.roomname) +'</p><p>' + this.escapeHtml(message.createdAt) + '</p></div>');
// };

// App.prototype.addRoom = function(room) {
//   $('#roomSelect').append('<option value="' + room + '">'+ room +'</option>');
// };

// App.prototype.addFriend = function(){
  
// };

// App.prototype.handleSubmit = function(evt){
//   this.send({ "username": window.location.search.substr(10),
//                 "message": $('#message').val(),
//                 "roomname": $('roomname').val() });
//   this.clearMessages();
//   this.fetch();
//   evt.preventDefault();
//   // $('#send').submit( function(event){
//   //   this.send({ "username": window.location.search.substr(10),
//   //               "message": $('#message').val(),
//   //               "roomname": $('roomname').val() });
//   //   this.clearMessages();
//   //   this.fetch();
//   //   // this.addRoom($('#roomname').val());
//   //   // //$('roomSelect').append()
//   //   event.preventDefault();
//   // });
// };

// App.prototype.escapeHtml = function(str) {
//     var div = document.createElement('div');
//     div.appendChild(document.createTextNode(str));
//     return div.innerHTML;
// };

// var app = new App();
// app.init();
//app.send({"username":'Jack and John',"text":"yo","roomname": "lobby"});
//app.fetch();