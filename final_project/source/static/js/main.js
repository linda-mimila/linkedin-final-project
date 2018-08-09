
$(document).ready(function() {
    var $notification = $("#notification");
    var $postList = $(".parent");
    var lastTimeout;

    function setNotification(isSuccess, message) {
        if (lastTimeout) {
            clearTimeout(lastTimeout);
        }

        $notification.removeClass("success error hidden");
        if (isSuccess) {
            $notification.addClass("success");
            lastTimeout = setTimeout(function() {
                $notification.addClass("hidden");
            }, 5000);
        } else {
            $notification.addClass("error");
        }

        $notification.text(message);
    }

    $postList.on({
        mouseenter: function() {
            $(this).find(".actions").removeClass("hidden");
        },
        mouseleave: function() {
            $(this).find(".actions").addClass("hidden");
        }
    }, ".blog-post");

    $(".add-post").click(function(e) {
        e.preventDefault();

        
        var duedate = $("#date").val();
        var description = $("#description").val();
        var title = $("#title").val();
        var data = {"title": title, "description": description, "duedate": duedate, "IsCompleted": true};

        $.ajax({
            url: "/post",
            type: "POST",
            data: data,
            dataType: "json",
            success: function(result) {
                location.reload();
            },
            error: function(status, data) {
                setNotification(false, "You tried to add a bad entry");
            }
        });
    });

    $postList.on("click", ".checkbox", function(e) {
        var isCompleted = $(e.currentTarget)[0].checked;
        var id = $(e.currentTarget)[0].dataset.id;
        var data = JSON.stringify({"IsCompleted": isCompleted});

       $.ajax({
           url: '/post/' + id,
           type: "POST",
           data: data,
           dataType: 'JSON',
           contentType: 'application/json',
           success: function(result) {
               debugger
            location.reload();
        },
        error: function(status, data) {
          debugger
            setNotification(false, "You tried to add a bad entry");
        }
       })
    });

    $postList.on("click", ".save-btn", function(e) {
        e.preventDefault();
        var post_content_elm = $(this).closest(".post-content");
        var new_content = $(this).siblings(".update-content").val();
        var blog_id = $(this).siblings("input[name=blog-id]").val();
        var data = {"blog_content": new_content};

        $.ajax({
            url: "/post/" + blog_id,
            type: "PUT",
            data: data,
            success: function(result) {
                $(post_content_elm).text(new_content);
                setNotification(true, "Successfully updated post");
            },
            error: function(status, data) {
                setNotification(false, "Whoops! Unable to edit the post: " + e.message);
            }
        });
    });

    $postList.on("click", ".delete", function(e) {
        debugger
        var id = $(e.currentTarget)[0].dataset.id;
        $.ajax({
            url: '/post/' + id,
            type: 'DELETE',
            success: function(result) {
                location.reload();
            },
            error: function(e) {
                setNotification(false, "Whoops! Unable to delete the post: " + e.message);
            }
        });
    });
});