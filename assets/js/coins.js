// html variables
var trendingContainer = $("#trendContain");
// coingecko coin list api
function coinsTrendingapi() { // ref line 19
    fetch(`https://api.coingecko.com/api/v3/search/trending`) // fetch url with dynamic endpoint
        .then(function (response) {
            response.json()
                .then(function (data) {
                    console.log(data.coins);
                    trends = data.coins;
                    // setting parameters for the following functions
                    displayTrending(trends);
                })
        });

    return;
}

function displayTrending(trends) { // ref coinpaprikaTweetApi
    trendingContainer.html(`<h3 class="title is-size-1">Trending Coins</h3>`); // section title
    for (var i = 0; i <= trends.length; i++) { // for loop through data ie 'tweets'
        var divEl1 = $(`
        <div class="tile" 
            <div class="tile content">
                <div class="box">
                    <h3 class="title">${trends[i].item.name}</h3>
                    <h4 class="subtitle">${trends[i].item.symbol}</h4>
                </div>
            </div>
        </div>`)
        divEl1.appendTo(trendingContainer) // place inside container already created in html file
}

}
coinsTrendingapi(); // yeet

var searchInputEl = $("#searchInput");
var searchFormEl = $("#searchForm");
var coinDataContainer = $("#coinDataContainer");
var coinPriceEl = $("#coinPrice");

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
                    coinlink3 = data.links.subreddit_url; // subreddit

                    // setting parameters for the following functions
                    displayCurrentData(coinName, coinIcon, coinSymbol, coinDescription, coinHomepage, coinlink3);
                    PriceData(coinId);
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
                    displayCurrentData(coinName, coinIcon, coinSymbol, data[0].current_price, coinDescription, coinHomepage, coinlink3);

                });
        });

    return;
}

function displayCurrentData(coinName, coinIcon, coinSymbol, coinPrice, coinDescription, coinHomepage, coinlink3) { // ref coinsListapi
    $("#coinDataContainer").attr("class", "card is-ghost");// coin data container in html file
    $("#coinName").html(coinName);// coin name
    $("#coinSymbol").html(coinSymbol); // coin symbol
    $("#coinHomepage").attr("href", `${coinHomepage}`) // link to homepage
    $("#icon").attr("src", `${coinIcon}`); //icon
    $("#description").html(coinDescription); //description
    $("#link3").attr("href", `${coinlink3}`); // link to subreddit

    // number formatter.
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    var coinPriceDisp = formatter.format(coinPrice); // display coin price in currency format

    $("#coinPrice").html(coinPriceDisp);// coin price
} 


function start() { // lets get this shit started frfr
    searchFormEl.submit(searchInput)
}

start();