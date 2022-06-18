// html variables
var searchInputEl = $("#searchInput");
var searchFormEl = $("#searchForm");
var coinDataContainer = $("#coinDataContainer");
var searchHistoryEl = $("#previousSearches");
var coinPriceEl = $("#coinPrice");
var searchHistoryContainer = $("#searcHistoryContainer");
//search function
function searchInput(event) { // use the submit event
    event.preventDefault()
    coinsListapi(searchInputEl.val()) // insert search input in coinsListapi function
}
// coingecko coin list api
function coinsListapi(coinName) { // ref line 19
    fetch(`https://api.coingecko.com/api/v3/coins/${coinName}?market_data=true`) // fetch url with dynamic endpoint
        .then(function (response) {
            response.json()
                .then(function (data) {
                    coinName = data.name; // ex: {"name: 'Bitcoin'"} the name
                    coinId = data.id; // ex: {"id: 'bitcoin'"} the ID, this one matters because if lowercase, the fetch url below will not accept it as a parameter. 
                    coinIcon = data.image.small; // ex: {"image: 'small'"} the icon
                    coinSymbol = data.symbol; // ex: {"symbol: 'btc'"} this is the coin's ticker
                    coinDescription = data.description.en; // ex {"description: en: (some text)"} the description
                    coinHomepage = data.links.homepage[0]; // homepage link
                    coinlink1 = data.links.blockchain_site[0]; // blockchain site
                    coinlink2 = data.links.official_forum_url[0]; // forum site
                    coinlink3 = data.links.subreddit_url; // subreddit

                    // setting parameters for the following functions
                    displayCurrentData(coinName, coinIcon, coinSymbol, coinDescription, coinHomepage, coinlink1, coinlink2, coinlink3);
                    PriceData(coinId);
                    coinPaprikaTweetApi(coinSymbol, coinId);
                })
        });

    return;
}

// fetching price data from coingecko coin market api
function PriceData(coinId) { // ref coinsListapi
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`) // fetch the url with dynamic parameter
        .then(function (response) {
            response.json()
                .then(function (data) {
                    coinPrice = data[0].current_price;
                    coinName = data.name;
                    // set new parameters with current parameters
                    displayCurrentData(coinName, coinIcon, coinSymbol, data[0].current_price, coinDescription, coinHomepage, coinlink1, coinlink2, coinlink3);

                });
        });

    return;
}

function displayCurrentData(coinName, coinIcon, coinSymbol, coinPrice, coinDescription, coinHomepage, coinlink1, coinlink2, coinlink3) { // ref coinsListapi
    $("#coinDataContainer").attr("class", "card cr col s5 hoverable");// coin data container in html file
    $("#coinName").html(coinName);// coin name
    $("#coinSymbol").html(coinSymbol); // coin symbol
    $("#coinHomepage").attr("href", `${coinHomepage}`) // link to homepage
    $("#coinHomepage").attr("class", "btn-floating btn-large pulse"); // icon pulse
    $("#icon").attr("src", `${coinIcon}`); //icon
    $("#description").html(coinDescription); //description
    $("#link1").attr("href", `${coinlink1}`); // link to blockchain site
    $("#link2").attr("href", `${coinlink2}`); // link to coin forum site
    $("#link3").attr("href", `${coinlink3}`); // link to subreddit

    // number formatter.
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    var coinPriceDisp = formatter.format(coinPrice); // display coin price in currency format

    $("#coinPrice").html(coinPriceDisp);// coin price
    dispSearchHist(coinId, false);
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
    coinsListapi(event.target.innerHTML);
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