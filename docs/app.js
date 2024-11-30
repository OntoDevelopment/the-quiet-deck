let seed, turn, card, cards = [];
const seasons = {
    Spring: "&hearts;",
    Summer: "&#x25C6;",
    Autumn: "&clubs;",
    Winter: "&spades;",
};

$(document).ready(function () {
    if (appSetup()) {
        $(".seed").text(seed);
        $(".turn").text(turn);

        $(".season").text(card.season);
        $(".suit").html(seasons[card.season]);
        $(".value").text(card.value);

        for(const idx in card.options){
            if(idx > 0){
                $(".card-text").append($("<or />"));
            }
            $(".card-text").append($("<div>").addClass("option").html(card.options[idx]));
        }

        $("#share").val(window.location.href);

        if (hasNextTurn()) {
            $("#next").attr("href", nextTurnUrl());
        } else {
            $("#next").remove();
        }

        if (hasPrevTurn()) {
            $("#back").attr("href", buildURL({ seed: seed, turn: turn - 1 }));
        } else {
            $("#back").remove();
        }

        $("#loading").hide();
        $("#app").show();
    }
});

function appSetup() {
    seed = getSeed();
    if (!seed) {
        seed = makeSeed();
        window.location.href = window.location.href + "?seed=" + seed;
        return false;
    }
    turn = getTurn();

    // shuffle the season and 
    for (const season in window.all_cards) {
        shuffle(window.all_cards[season], seed);
        for(const idx in window.all_cards[season]) {
            window.all_cards[season][idx].season = season;
            cards.push(window.all_cards[season][idx]);
        }
    }

    card = cards[turn - 1];

    return true;
}

/**
 * @see https://github.com/yixizhang/seed-shuffle
 */
function shuffle(array, seed) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    seed = seed || 1;
    let random = function () {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function makeSeed() {
    return Math.floor(Math.random() * 10000);
}

function getUrlParam(name, defaultValue) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
        window.location.href
    );
    if (results == null) {
        return defaultValue;
    } else {
        return results[1] || 0;
    }
}

function getSeed() {
    return getUrlParam("seed", false);
}

function getTurn() {
    return parseInt(getUrlParam("turn", 1));
}

function nextTurnUrl() {
    return buildURL({ seed: seed, turn: turn + 1 });
}

function hasNextTurn() {
    return turn < 52;
}

function hasPrevTurn() {
    return turn > 1;
}

function buildURL(params) {
    return (
        window.location.href.split("?")[0] +
        "?" +
        Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
    );
}

function copyurl() {
    var share = document.getElementById("share");
    share.select();
    share.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(share.value);
    $("#copied").hide().fadeIn(1000).fadeOut(1000);
}