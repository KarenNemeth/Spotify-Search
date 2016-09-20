$(document).ready(function() {
    var searchTerm;
    var type;
    var encodedSearch;
    var spotify_url;
    var nextList;
    var setTime;

    $('#searchButton').first().on("click", function(){
        $("#message").empty();
        $("#results").empty();
        $('#moreResults').remove();

        $("#resultsContainer").css({"display": "block"});
        searchTerm = $('#searchTerm').val();
        type = $('#select').val();
        console.log(searchTerm);
        console.log(type);
        encodedSearch = encodeURIComponent(searchTerm);
        spotify_url = 'https://api.spotify.com/v1/search?q='+encodedSearch+'&offset=0&type='+type;
        $("#message").html('Results for the ' + type + ' named "' + searchTerm + '"');

        $.ajax({
            url: spotify_url,
            method: 'GET',
            success: function load(data) {
                $.each(data, function(key, value){
                    console.log(data);
                    $.each(this.items, function(id, val){
                        var li = $("<li>").attr('id', 'resultItem').appendTo('#results');
                        if (val.images[0] == undefined) {
                            img = $("<img>").attr('id', 'picture').attr('src', 'record.jpg').appendTo(li);
                        } else {
                            img = $("<img>").attr('id', 'picture').attr('src', val.images[0].url).appendTo(li);
                        }
                        $("<div>").attr('id', 'transparency').appendTo(li);
                        $("<div>").html(val.name).attr('id', 'name').appendTo(li);
                        $(li).on("click", function(){
                            window.location = val.external_urls.spotify;
                        });
                    });
                    nextList = value.next;
                    if (nextList != null) {
                        function callMore() {
                            $.ajax({
                                url: nextList,
                                method: 'GET',
                                success: load,
                                error: function() {
                                    console.log(spotify_url + " could not be found");
                                }
                            });
                        }
                        if (location.search == "?scroll=infinite") {
                            setTime = setInterval(function (){
                                var heights = ($(document).height() - $(window).height() - 250);
                                if ($(document).scrollTop() > heights) {
                                    callMore();
                                }
                            }, 250);
                        } else {
                            $("<button>").html("More Results").attr("id", "moreResults").appendTo('#resultsContainer').on("click", function(){
                                $('#moreResults').remove();
                                callMore();
                            });
                        }
                    }
                    if (nextList == null) {
                        clearTimeout(setTime);
                        console.log("it's null");
                        return;
                    }
                });
            },
            error: function() {
                console.log(spotify_url + " could not be found");
            }
        });
    });
});
