$(document).ready(() => {

    $.ajax({
        method: "GET",
        url: "/articles"
    }).then((data) => {

        if (data.length > 0) {
        
            $("#articles-list").empty();

            for (let i = 0; i < data.length / 5; i++) {

                var articleCard = $("<div>").addClass("card text-center article-entry").css("width", "1200px");

                var cardHeader = $("<div>").addClass("card-header text-white bg-secondary border-dark").css({"width": "100%", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis"});

                if (data[i].note) {
                    var articleTitle = $("<a>").addClass("text-white").attr("href", data[i].link).html("<h3>" + data[i].title + "<span class='fa fa-sticky-note' style='color: yellow; float: right'></span></h3>");
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
                var saveBtn = $("<a>").addClass("btn btn-md btn-success text-white article-save").attr({"data-id": data[i]._id, "data-saved": data[i].saved}).text("Save Article");
                cardFooter.append(saveBtn);

                articleCard.append(cardHeader, cardBody, cardFooter);

                $("#articles-list").append(articleCard);
                $("#numArticles").text(i + 1);
            }            
        }
    });
});

// Save
$(document).on("click", ".article-save", (e) => {

    var id = $(e.target).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
    }).then(() => {
        alert("Article Saved");
    });
});

// Scrape
$(document).on("click", ".scrape-btn", () => {

    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(() => {
        alert("Articles Scraped");
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