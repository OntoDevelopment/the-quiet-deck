let seed,
    turn,
    cards = [],
    card;
const deck = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const seasons = {
    Spring: "&hearts;",
    Summer: "&diamonds;",
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

    // for each season, add the 13 cards as new Card objects to the cards array
    for (const season in seasons) {
        shuffle(deck, seed);
        deck.forEach((value) => {
            cards.push(new Card(value, season));
        });
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
    $('#copied').hide().fadeIn(1000).fadeOut(1000);
}

class Card {
    constructor(value, season) {
        this.value = value;
        this.season = season;
    }
}
