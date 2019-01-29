$(document).ready(() => {

    $.ajax({
        method: "GET",
        url: "/articles/saved"
    }).then((data) => {

        if (data.length > 0) {
        
            $("#saved-articles-list").empty();

            for (let i = 0; i < data.length; i++) {

                var articleCard = $("<div>").addClass("card text-center article-entry").css("width", "1200px");
                var cardHeader = $("<div>").addClass("card-header text-white bg-secondary border-dark").css({"width": "100%", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis"});
                
                if (data[i].note) {

                    var articleTitle = $("<a>").addClass("text-white").attr("href", data[i].link).html("<h3>" + data[i].title + "<span class='fa fa-sticky-note hasNote' style='color: yellow; float: right' title='" + data[i].note.text.replace(/\'/g, "") + "'></span></h3>");
                    cardHeader.append(articleTitle);
                }
                else {
                    var articleTitle = $("<a>").addClass("text-white").attr("href", data[i].link).html("<h3>" + data[i].title + "</h3>");
                    cardHeader.append(articleTitle);
                }
                  
                var cardBody = $("<div>").addClass("card-body");
                var cardLink = $("<a>").attr("href", data[i].link);
                var cardImage = $("<img>").addClass("img-thumbnail float-left article-img").attr("src", data[i].image).css({"display": "inline", "width": "200px"});
                var cardText = $("<p>").addClass("card-text text-left").text(data[i].description).css({"font-size": "1.25rem", "display": "inline", "margin-left": "10px"});
                cardLink.append(cardImage);
                cardBody.append(cardLink, cardText);
            
                var cardFooter = $("<div>").addClass("card-footer").css("padding", "4px 5px 5px 5px");
                
                if (data[i].note) {
                    var noteBtn = $("<a>").addClass("btn btn-md btn-light text-dark add-note border-dark").attr({"data-id": data[i]._id, "data-note-id": data[i].note._id, "data-toggle": "modal", "data-target": "#addNote"}).text("View/Edit Note");
                    var clearNoteBtn = $("<a>").addClass("btn btn-md btn-dark text-white delete-note").attr({"data-id": data[i]._id, "data-note-id": data[i].note._id}).text("Delete Note");
                }
                else {
                    var noteBtn = $("<a>").addClass("btn btn-md btn-light text-dark add-note border-dark").attr({"data-id": data[i]._id, "data-toggle": "modal", "data-target": "#addNote"}).text("Add/Edit Note");
                    var clearNoteBtn = $("<a>").addClass("btn btn-md btn-dark text-white delete-note disabled").attr("data-id", data[i]._id).text("Delete Note");
                }
                var removeBtn = $("<a>").addClass("btn btn-md btn-danger text-white remove-save").attr({"data-id": data[i]._id, "data-saved": data[i].saved}).text("Remove from Saved");
                cardFooter.append(noteBtn).append("&nbsp;").append(clearNoteBtn).append("&nbsp;").append(removeBtn);

                articleCard.append(cardHeader, cardBody, cardFooter);

                $("#saved-articles-list").append(articleCard);
                $("#numArticles").text(i + 1);
            }            
        }
    });
});

// Remove Save
$(document).on("click", ".remove-save", (e) => {

    var id = $(e.target).attr("data-id");
    var status = $(e.target).attr("data-saved");

    $.ajax({
        method: "POST",
        url: "/saved/" + id,
        data: status
    }).then(() => {
        alert("Article Removed");
        location.reload();
    });
});

// Add/Edit Note
$(document).on("click", ".add-note", (e) => {

    if ($(e.target).attr("data-note-id")) {

        $("#saveNote").text("Update Note");
        $("#closeNote").text("Close");

        var id = $(e.target).attr("data-note-id");

        $.ajax({
            method: "GET",
            url: "/note/" + id
        }).then((data) => {
    
            $("#noteTitle").text(data.title);
            $("#noteBody").text(data.text);

            $("#saveNote").on("click", () => {
    
                $.ajax({
                    method: "POST",
                    url: "/note/update/" + id,
                    data: {
                        title: $("#noteTitle").val().trim(),
                        text: $("#noteBody").val().trim()  
                    }
                }).then((response) => {
                    alert("Note Updated");
                    $("#addNote").modal("toggle");
                    location.reload();
                });
            });
        });
    }
    else {

        $("#saveNote").text("Save Note");

        var id = $(e.target).attr("data-id");
    
        $("#saveNote").on("click", () => {
    
            $.ajax({
                method: "POST",
                url: "/note/" + id,
                data: {
                    title: $("#noteTitle").val().trim(),
                    text: $("#noteBody").val().trim()   
                }
            }).then((response) => {
                alert("Note Added");
                $("#addNote").modal("toggle");
                location.reload();
            });
        });
    }
});

// Delete Note
$(document).on("click", ".delete-note", (e) => {

    var id = $(e.target).attr("data-note-id");

    $.ajax({
        method: "POST",
        url: "/note/delete/" + id
    }).then((data) => {
        alert("Note Deleted");
        location.reload();
    });
});

// Clear
$(document).on("click", "#clear-btn", () => {

    $.ajax({
        method: "GET",
        url: "/articles/clear"
    }).then(() => {
        alert("Articles Cleared");
        location.reload();
    });
});