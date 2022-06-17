// html variables
var searchInputEl = $("#searchInput");
var searchFormEl = $("#searchForm");
var tickerContainer = $("#tickerContainer");
var searchHistoryEl = $("#previousSearches");
var searchHistoryContainer = $("#searcHistoryContainer");

//search function
function searchInput(event) { // use the submit event
    event.preventDefault()
    coinTickerApi(searchInputEl.val()) // insert search input in coinsListapi function
}
// coingecko coin list api
function coinTickerApi(coinName) { // ref line 19
    fetch(`https://api.coingecko.com/api/v3/coins/${coinName}?market_data=true`) // fetch url with dynamic endpoint
        .then(function (response) {
            response.json()
                .then(function (data) {
                    coinName = data.name; // ex: {"name: 'Bitcoin'"} the name
                    coinIcon = data.image.small; // ex: {"image: 'small'"} the icon
                    coinSymbol = data.symbol; // ex: {"symbol: 'btc'"} this is the coin's ticker
                    homepage = data.links.homepage[0]; // homepage
                    coinId = data.id; //coin id
                    // setting parameters for the following functions
                    displayCurrentData(coinName, coinIcon, coinSymbol);
                    dispSearchHist(coinId);
                })
        });

    return;
}

function displayCurrentData(coinName, coinIcon, coinSymbol) { // ref coinsListapi
    $("#tickerContainer").attr("class", "box");// coin data container in html file
    $("#coinName").html(coinName);// coin name
    $("#coinSymbol").html(`${coinSymbol}`); // coin symbol
    $("#icon").attr("src", `${coinIcon}`); //icon
    $("#homepage").attr("href", `${homepage}`); // homepage link
}

function dispSearchHist(coinId, initialStart) {
    // search history
    var matchFound = false;
    $("#previousSearches").children("").each(function () {
        if (coinId == $(this).text()) {
            matchFound = true;
            return;
        }
    });
    if (matchFound) { return; }

    var buttonEl = $('<button type="button" class="col s12 m3 btn">' + coinId + '</button>')
    buttonEl.on("click", previousButtonClick);
    buttonEl.prependTo(searchHistoryEl);

    if (!initialStart) { savePreviousData(coinId) };
}

function savePreviousData(coinId) {
    tempItem = JSON.parse(localStorage.getItem("previousSearches"))
    if (tempItem != null) {
        localStorage.setItem("previousSearches", JSON.stringify(tempItem.concat(coinId)))
    } else {
        tempArr = [coinName];
        localStorage.setItem("previousSearches", JSON.stringify(tempArr))
    }
}

function previousButtonClick(event) {
    coinTickerApi(event.target.innerHTML);
}

function start() { // lets get this shit started frfr
    searchFormEl.submit(searchInput)
    tempArr = JSON.parse(localStorage.getItem("previousSearches"))
    if (tempArr != null) {
        for (let i = 1; i < tempArr.length; i++) {
            dispSearchHist(tempArr[i], true);
        }
    }
}

start() // yeet