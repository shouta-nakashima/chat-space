$(function(){  
     function buildHTML(message){
      if ( message.image ) {
        var html = 
         `<div class="message-list__chat-box" data-message-id=${message.id}>
            <div class="message-list__chat-box__user-box">
              <p class="message-list__chat-box__user-box__user-name">
                ${message.user_name}
              </p>
              <p class="message-list__chat-box__user-box__time">
                ${message.created_at}
              </p>
            </div>
            <p class="message-list__chat-box__chat-message">
            </p>
            <p class="lower-message__content">
              ${message.content}
            </p>
            <p></p>
            <img src=${message.image} >
          </div>`
        return html;
      } else {
        var html = 
         `<div class="message-list__chat-box" data-message-id=${message.id}>
            <div class="message-list__chat-box__user-box">
              <p class="message-list__chat-box__user-box__user-name">
                ${message.user_name}
              </p>
              <p class="message-list__chat-box__user-box__time">
                ${message.created_at}
              </p>
            </div>
              <p class="message-list__chat-box__chat-message">
              </p>
              <p class="lower-message__content">
              ${message.content}
              </p>
              <p></p>
          </div>`
        return html;
      };
    }
    $('#new_message').on('submit', function(e){
      e.preventDefault();
      var formData = new FormData(this);
      var url = $(this).attr('action');
      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function(data){
        var html = buildHTML(data);
        $('.message-list').append(html);
        $('form')[0].reset();
        $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      })
      .fail(function() {
        alert("メッセージ送信に失敗しました");
      })
      .always(function() {
        $(".contents__button").prop("disabled", false);
      });
    })

      function reloadMessages() {
        last_message_id = $('.message-list__chat-box:last').data("message-id");
        $.ajax({
          url: "api/messages",
          type: 'get',
          dataType: 'json',
          data: {id: last_message_id}
        })
        .done(function(messages) {
          if (messages.length !== 0) {
            var insertHTML = '';
            $.each(messages, function(i, message) {
              insertHTML += buildHTML(message)
            });
            $('.message-list').append(insertHTML);
            $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
          }
        })
        .fail(function() {
          alert('自動更新に失敗しました')
        });
      };

    if (document.location.href.match(/\/groups\/\d+\/messages/)) {
      setInterval(reloadMessages, 7000);
    }
});