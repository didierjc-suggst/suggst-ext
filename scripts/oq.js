/**
 * Author: Etana Glushko
 * Contributor: Didier Leonard-Jean Charles
 * Date Created: Oct 28, 2016
 *
 * @name: oq.js
 * @description: OptiQly Chrome extension to help optimize product campaign across a variety of marketplace platforms.
 *                  The first marketplace platform is Amazon
 * @purpose: a bunch of OQ Javascript utility functions. Globally available
 * @owner: OptiQly
 */

// ***** [START] UTILITY FUNCTIONS
/**
 * generate timestamp in ISO 8601 format
 *
 * Complete date plus hours, minutes, timezone
 * YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)
 * TZD  = time zone designator (Z or +hh:mm or -hh:mm)
 *
 * @return_type: String: "2016-10-28T15%3A24%3A34.000Z";
 */
var generateTimestamp = function() {
    var d = new Date();
    var mon = d.getUTCMonth() + 1;
    mon = (mon < 10) ? ("0" + mon) : mon;
    var date = d.getUTCDate();
    date = (date < 10) ? ("0" + date) : date;
    var hours = d.getUTCHours();
    hours = (hours < 10) ? ("0" + hours) : hours;
    var mins = d.getUTCMinutes();
    mins = (mins < 10) ? ("0" + mins) : mins;
    var secs = d.getUTCSeconds();
    secs = (secs < 10) ? ("0" + secs) : secs;
    var timestamp = d.getUTCFullYear() + "-" + mon + "-" + date + "T" + hours + ":" + mins + ":" + secs + ".000Z";
    timestamp = encodeURIComponent(timestamp);
    return timestamp;
};

/**
 * generate Amazon signature. The signature authenticates your Amazon request
 *  A signature is created by using the request type, domain, the URI, and a sorted string of every parameter in the
 *  request (except the Signature parameter itself) with the following format <parameter>=<value>&. After it's properly
 *  formatted, create a base64-encoded HMAC-SHA256 signature with your AWS secret key.
 *
 * @return_type: String;
 */
var generateSignature = function(params) {
    var test_string =
        "GET\n" +
        "webservices.amazon.com\n" +
        "/onca/xml\n" + params;

    var signature = CryptoJS.HmacSHA256(test_string, amd.secretKey);
    signature = signature.toString(CryptoJS.enc.Base64);
    signature = encodeURIComponent(signature);
    return signature;
};

/**
 * truncates string
 *
 * @return_type: String;
 */
var truncateStr = function (str, n, useWordBoundary){
    if (!str) {
        return "";
    }

    var isTooLong = str.length > n, s_ = isTooLong ? str.substr(0,n-1) : str;
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return isTooLong ? s_ + '...' : s_;
};

var encodingErrors = function(html) {
    var validTags = ["b", "br", "em", "font", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "li", "ol", "p", "pre", "s", "strike", "strong",  "sub", "sup", "u", "ul"];

    var stack = [];
    var i, j, currentTag, stackTag, tagName, forName;
    var tags = html.match(/<[^>]+/ig);
    var validTag;

    if (tags) {
        for (i = 0; i < tags.length; i++) {
            currentTag = tags[i];
            if (currentTag[1] === "/") {
                stackTag = stack.pop();
                if (stackTag) {
                    if(stackTag.split("<")[1] === currentTag.split("/")[1]) {}
                    else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                forName = currentTag.match(/<[a-zA-Z0-9]+/);
                if (forName && forName.length) {
                    tagName = forName[0].replace("<", "").toLowerCase();
                }
                validTag = false;
                for (j=0; j < validTags.length; j++) {
                    if (validTags[j] === tagName) {
                        validTag = true;
                    }
                }

                if (!validTag) {
                    return true;
                }

                if (tagName !== "br" && tagName !== "hr") {
                    stack.push(currentTag);
                }
            }
        }
    }

    if(stack.length === 0) {
        return false;
    }

    return true;
};

var descriptlength = function (text) {
    var words = text.replace(/<[^>]*>/g, "");
    var count = words.split(' ').length;
    return count;
};

var calcWeightValue = function(value, weight) {
    var res = Math.round(value * weight / 100);
    return res;
};

// output formatted date / time: MM/DD/YYYY HH:MM TT
var formatDate = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
};

var processGrXml = function(xmlData) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlData.data, "text/xml");
    //console.log(xmlDoc);
    var obj = xmlToJson(xmlDoc);
    //console.log(obj);
    return obj;
};

var addAction = function (line, invisible) {
    //console.log(line);
    //console.log(invisible);

    if(!invisible && line.class === line.action.displayOn){
        //console.log(line);
        if(oqScore.actions.length) {
            //if(line.score.max > oqScore.actions[0].score.max) {
                //oqScore.actions[1] = oqScore.actions[0];
                //oqScore.actions[0] = line;
            //} else if(!oqScore.actions[1] || line.score.max > oqScore.actions[1].score.max){
                //oqScore.actions[1] = line;
            oqScore.actions[oqScore.actions.length] = line;
            //}
        } else {
            oqScore.actions[0] = line;
        }
    }
};

var calcClass = function(score, obj) {
    var scoreClass = "red"; // bad or below the range
    if (obj.range) {
        if (score >= obj.range.worst && score <= obj.range.best) { // in the range
            scoreClass = "yellow";
        } else if (score > obj.range.best) { // good or above the range
            scoreClass = "green";
        }
    }
    return scoreClass;
};

/*
 * Convert an ISBN-10 to ISBN-13 or ISBN-13 to ISBN-10.
 * Note: At this time only ISBN-13 that start with 978 can be converted to ISBN-10, as ISBN-13 begining with other
 * digits will not result in a unique ISBN-10 (i.e. they are not backward convertible)
 * param: ISBN-10 or ISBN-13
 * return: a string containing the ISBN-10, ISBN-13 or an error message
 */
var convertISBN = function(isbn){
    if (isbn.length === 10 || isbn.length === 13){
        if (isbn.length === 13){
            if (isbn.substring(0, 3) == "978"){
                if(validISBN13(isbn)){
                    var isbn2 = isbn.substring(3, 12);
                    var isbn10 = String(isbn2) + String(genchksum10(isbn2));
                    return isbn10;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        if (isbn.length === 10){
            if(validISBN10(isbn)){
                var isbn2 = "978" + isbn.substring(0, 9);
                var isbn13 = String(isbn2) + String(genchksum13(isbn2));
                return isbn13;
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
};

/*
 * Validate an ISBN-10 using the checkdigit (last digit)
 * param: isbn - ISBN-10
 */
var validISBN10 = function(isbn){
    isbn = isbn.toUpperCase();

    if(genchksum10(isbn.substring(0, 9)) == isbn.substring(9, 10)){
        return true;
    } else {
        return false;
    }
};

/*
 * Validate an ISBN-10 using the checkdigit (last digit)
 * param: isbn - ISBN-13
 */
var validISBN13 = function(isbn){
    if(genchksum13(isbn.substring(0, 12)) == isbn.substring(12, 13)){
        return true;
    } else {
        return false;
    }
};


/**
 * Calculate an ISBN-13 checkdigit from the first 12 digits in an ISBN-13 string
 * param: isbn - the first 12 digits of an ISBN-13.
 * return: checkdigit (last digit) for an ISBN-13
 */
var genchksum13 = function(isbn) {
    var oddNumbs = 0;
    var evenNumbs = 0;
    var check;

    for (var i=1; i<=12; i=i+2){
        oddNumbs = oddNumbs + Number(isbn.charAt(i-1));
    }

    for (var j=2; j<=12; j=j+2){
        evenNumbs = evenNumbs + Number(isbn.charAt(j-1));
    }

    check = (oddNumbs + (evenNumbs*3)) % 10;

    if (check != 0){
        check = 10 - check;
    }

    return check;
};


/**
 * Calculate an ISBN-10 checkdigit from the first 9 digits in an ISBN-10 string
 * param: isbn - the first 9 digits of an ISBN-10.
 * return: checkdigit (last digit) for an ISBN-10
 */
var genchksum10 = function(isbn){
    var checkDigit = 0;

    for(var i=1; i<=9; i++){
        checkDigit += ((10-i + 1) * isbn.charAt(i-1));
    }

    checkDigit = 11 - (checkDigit % 11);
    var check = checkDigit;
    if(checkDigit == 10) {
        check='X';
    } else if(checkDigit==11) {
        check='0';
    }

    return check;
};

/**
 * @purpose: the purpose for this code is to give me the source code of the current page
 * */
var onWindowLoad = function() {
    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "scripts/page.min.js"
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });
};

/**
 * @purpose: Converts an html characterSet into its original character.
 *
 * @return_type: HTML;
 * */
var htmlDecode = function(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
};

// ***** [START] REQUEST FUNCTIONS
/**
 * generate a request. The request can be one of the following:
 *  1- Amazon
 *  2- Similiar products in Amazon
 *
 * @return_type: String;
 */
var generateRequest = function(asin, type) {
    // set default value for "type"
    type = typeof type !== 'undefined' ? type : 'amazon';
    var request = undefined;
    var params = "AWSAccessKeyId=" + amd.accessKey + "&AssociateTag=" + amd.associateTag;

    if(type === "amazon" || type === "amazonSim"){
        params = params + "&IdType=ASIN&ItemId=" + asin +
            "&Operation=ItemLookup&ResponseGroup=Accessories%2CAlternateVersions%2CBrowseNodes%2CEditorialReview%2CImages%2CItemAttributes%2CItemIds%2CLarge%2CMedium%2COfferFull%2COfferListings%2COffers&Service=AWSECommerceService&Timestamp="
            + generateTimestamp();
        request = amd.endPoint + params + "&Signature=" + generateSignature(params);

    }else if(type === "similarities"){
        params = params + "&Item.1.ASIN=" + asin +
            "&Item.1.Quantity=4&Operation=CartCreate&ResponseGroup=CartSimilarities&Service=AWSECommerceService&Timestamp="
            + generateTimestamp() + "&Version=2013-08-01";

        request = amd.endPoint + params + "&Signature=" + generateSignature(params);

    }else if(type === "goodreads"){
        request = "https://www.goodreads.com/book/isbn/" + asin + "?key=" + grd.key;

    }else if(type === "goodreads2"){
        //console.log(type + " was called.");
        request = "https://www.goodreads.com/book/review_counts.json?isbns=";

    }else if(type === "goodreadsauthor"){
        request = "https://www.goodreads.com/author/show.xml?key=" + grd.key + "&id=" + asin;

    }else if(type === "kadaxis"){
        request = "http://api.kadaxis.com/v1.2/keywords/findByASIN?ASIN="+asin;

    }else if(type === "amazonSimilarities"){
        params = "AWSAccessKeyId=" + amd.accessKey +
            "&AssociateTag=" + amd.associateTag +
            "&Item.1.ASIN=" + asin +
            "&Item.1.Quantity=4&Operation=CartCreate&ResponseGroup=CartSimilarities&Service=AWSECommerceService&Timestamp="
            + generateTimestamp() + "&Version=2013-08-01";
        request = amd.endPoint + params + "&Signature=" + generateSignature(params);

    }else if(type === "fb"){
        request = "https://graph.facebook.com/v2.8?emc=rss&fields=og_object{engagement,likes.limit(0).summary(true)},share&access_token=" + fbd.access_token +"&id=" + asin;

    }else if(type === "google") {
        request = gle.endPoint + asin + "&key=" + gle.bookKey;
    }else if(type === "googleSearch") {
        //request = "https://www.google.com/?q=Friends+with+Benefits";
        //request = "https://www.googleapis.com/customsearch/v1?key=AIzaSyD4hk3SrQrbDX3tN5baay1SpLptZ8lepHg&cx=006105635970720037243:ktsztu1u3eg&q=blubber";
    }else if(type == "authorrank"){
        request = "https://www.amazon.com/gp/product/features/entity-teaser/books-entity-teaser-ajax.html?ASIN="+asin+"&PRODUCT_GROUP=book_display_on_website";
    }else if(type === "twitter"){
        request = twt.endPointSearch+asin;
    }else if(type === "wiki"){
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = today.getMonth()+1;
        mm = (mm < 10) ? '0'+mm : mm;
        var lastDD = new Date(yyyy, mm, 0);

        request = wik.endPoint+asin+"/daily/"+yyyy+mm+"01/"+yyyy+mm+lastDD.getDate();
    }else if(type === "wiki2"){
        request = wik.endPoint2+asin;
    }

    return request;
};

var sendRequest = function(asin, addIsbn, type, $http, $scope, origObj, book) {
    // set default value for "type"
    type = typeof type !== "undefined" ? type : "amazon";
    var request = generateRequest(asin, type);
    //console.log("type: "+type);
    //console.log("request: "+request);
    //console.log(book);
    
    if(type === "twitter"){
        $http.defaults.headers.common['Authorization'] = "Bearer " + twt.bearer;
    }

    if (type === "goodreads2") {
        var numbers = asin + "," + addIsbn;
        request = request + numbers + "&key=" + grd.key;
        //console.log(numbers);
        //console.log("request: "+request);
    }

    $http.get(request)
    .then(function succes(response) {
        if(type === "amazon" || type === "amazonSimilarities" || type === "amazonSim"){
            //console.log(response);
            var jObj = xmlToJson(parseXml(response.data));
            if(type === "amazonSim"){
                processSimData(jObj, origObj);
            }else if(type === "amazonSimilarities"){
                processSimilaritiesData(jObj, $scope);
            }else{
                processData(jObj, $http, $scope);
            }
        }else if(type === "goodreads"){
            //console.log(response);
            var obj = processGrXml(response);
            processGoodreadsData(obj, obj.GoodreadsResponse.book.authors, $scope, $http);
        }else if(type === "goodreads2"){
            //console.log(response);
            var bookObj = response.data.books[0];
            processgrRatingsData(bookObj, $scope);
        }else if(type === "goodreadsauthor"){
            //console.log(response);
            var obj = processGrXml(response);
            processGoodreadsAuthorData(obj, $scope);
        }else if(type === "kadaxis"){
            //console.log(response);
            var kadaxisObj = response.data;
            processKadaxisData(kadaxisObj, $scope);
        }else if(type === "fb"){
            //console.log(response);
            processFbData(response.data, $scope);
        }else if(type === "google"){
            //console.log(response);
            if(response.data.totalItems > 0) {
                processGoogleData(response.data.items[0], $scope);
            }else{
                book.googleAverageRating = 0;
                book.googleRatingsCount = 0;
                finalRecup("1", $scope);
            }
        }else if(type === "googleSearch") {
            //console.log(response);
            //processGoogleSearch(response.data, $scope);
        }else if(type === "authorrank"){
            //console.log(response);
            var aRank = response.data.match(/<div class="nodeRank">([\s\S]*?)<\/div>/ig);
            processAuthorRankData(aRank, $scope);
        }else if(type === "twitter"){
            //console.log(response);
            processTwtData(response.data, $scope);
        }else if(type === "wiki"){
            //console.log(response);
            processWikiData(response.data, $scope);
        }else if(type === "wiki2"){
            //console.log(response);
            processWiki2Data(response.data, $scope);
        }
    }).catch(function(response){
        //console.log(response);
        $scope.processError = true;
        // for tracking purposes
        oqObj["extensionrendered"] = "error";
        oqObj["error"] = response.data;
        finalRecup(type+"Fail");

        if(type === "wiki" || type === "wiki2" || type === "goodreads2"){
            // display the contents of the extension even though there was an error with Wikipedia
            $scope.processError = false;
        }

        if(type === "goodreads2"){
            book.grTitleStarRating = 0;
            book.grTitleStarRating_display = 0;
            book.grTitleNumberOfRantings = 0;
            book.grTitleNumberOfRantings_display = 0;
            book.grTitleNumberOfReviews = 0;
            book.grTitleNumberOfReviews_display = 0;
            finalRecup("goodreadsRatingsFail");
        }
    });
};

// ***** [START] PROCESS DATA FUNCTIONS
var processData = function(data, $http, $scope) {
    //console.log("processData");
    //console.log(data);
    //console.log(book);
    document.getElementById("calculating").innerHTML = "Calculating...Amazon";

    var i;
    /*********************** Objects from API ***************************/
    var item = data.ItemLookupResponse.Items.Item; // object
    //console.log(item);
    var attr = item.ItemAttributes; // object
    var reviews = item.EditorialReviews ? item.EditorialReviews.EditorialReview : []; // object or array
    //console.log(reviews);
    var images = [];
    if (item.ImageSets) {
        images = item.ImageSets.ImageSet;
    }
    var salesRank = item.SalesRank; // object

    var discountPercent; // = item.Offers ? item.Offers.Offer.OfferListing.PercentageSaved : "";
    var discountAmount; // = item.Offers ? item.Offers.Offer.OfferListing.AmountSaved : "";
    var inStock; // = item.Offers ? item.Offers.Offer.OfferListing.AvailabilityAttributes.AvailabilityType : "";

    if (item.Offers) {
        if (item.Offers.Offer) {
            discountPercent = item.Offers.Offer.OfferListing.PercentageSaved;
            discountAmount = item.Offers.Offer.OfferListing.AmountSaved;
            inStock = item.Offers.Offer.OfferListing.AvailabilityAttributes.AvailabilityType;
        }
    }

    if(item.ItemAttributes.Binding["#text"] === "Kindle Edition"){
        inStock = new Array();
        inStock["binding"] = "Kindle Edition";
        inStock["#text"] = "now";
    }
    // Item.Offers.OfferOfferListing.PercentageSaved
    /*********************************************************************/

    //console.log(item);
    //console.log(attr);
    var isbnObj = attr.ISBN || attr.EISBN || item.ASIN;
    var isbn = isbnObj ? isbnObj["#text"] : "";
    var addIsbn = book.asin;
    book.isbn = isbn ? isbn : "";
    if (isbn) {
        sendRequest(isbn, addIsbn, "goodreads2", $http, $scope, null, book);
    } else {
        finalRecup("1", $scope);
    }

    book.authors = [];
    if('Author' in attr){
        if(!attr.Author.length){
            book.authors[0] = attr.Author ? attr.Author["#text"] : "";
        }else if (attr.Author.length > 1){
            book.authors[0] = attr.Author[0] ? attr.Author[0]["#text"] : "";
        }
    }else{
        //console.log("No author found!");
        book.authors[0] = null;
    }


    if(book.authors[0]){
        // *** Wikipedia
        var t1 = performance.now();
        var athr = book.authors[0].replace(/ /ig,"_");
        athr = athr.replace(/\./ig,"._");
        athr = athr.replace(/__/ig,"_");
        sendRequest(athr, null, "wiki", $http, $scope, null);
        var t2 = performance.now();
        oqObj["oqstats"].requests["wikipageviews"].value = t2 - t1;
        oqObj["oqstats"].requests["wikipageviews"].measure = "milliseconds";

        // *** Wikipedia 2
        var t1 = performance.now();
        sendRequest(athr, null, "wiki2", $http, $scope, null);
        var t2 = performance.now();
        oqObj["oqstats"].requests["wikiofficialsite"].value = t2 - t1;
        oqObj["oqstats"].requests["wikiofficialsite"].measure = "milliseconds";
    }

    book.title = attr.Title["#text"];
    if (book.title) {
        if (book.title.length > 70) {
            book.shortTitle = truncateStr(book.title, 68, false);
        } else {
            book.shortTitle = book.title;
        }
    }

    if (item.MediumImage && item.MediumImage.URL) {
        book.coverImage = item.MediumImage.URL["#text"];
    }

    book.format = attr.Format ? attr.Format["#text"] : "";
    book.edition = attr.Edition ? attr.Edition["#text"] : "";
    book.publisher = attr.Publisher ? attr.Publisher["#text"] : "";
    if (book.publisher.length + book.edition.length > 50) {
        book.publisherShort = truncateStr(book.publisher, 50-book.edition.length, true);
        // book.editionShort = truncateStr(book.edition, 25, true);
    } else {
        book.publisherShort = book.publisher;
        // book.editionShort = book.edition;
    }
    book.binding = attr.Binding ? attr.Binding["#text"] : "";
    book.publicationDate = attr.PublicationDate ? attr.PublicationDate["#text"] : "";
    if(book.publicationDate) {
        var mydate = new Date(book.publicationDate);
        var month = mydate.getMonth(); // month (in integer 0-11)
        var day = mydate.getDate();
        var year = mydate.getFullYear(); // year
        book.publicationDate = "("+months[month]+ " " + day + ", " + year +")";
    }

    /************************ Product title issues ***********************/
    book.titleCharacterEncoding = !(encodingErrors(book.title));
    var titleNoTags = book.title.replace(/<[^>]*>/g, "");
    book.titleLength = titleNoTags.length;
    /*********************************************************************/

    book.productDescription = "";
    var review, otherReview;
    if (reviews) {
        //console.log(reviews.length);
        if(reviews.length) {
            review = reviews[0];
            if (reviews.length > 1) {
                otherReview = reviews[1];
            }
        } else {
            review = reviews;
            //console.log(review);
        }

        /****************** Product description issues ***********************/
        if (review.Source && review.Source["#text"] === "Product Description") {
            book.productDescription = review.Content["#text"];
            //[DJC] book.descriptionLength = lengthIsValid(book.productDescription);
            book.descriptionLength = descriptlength(book.productDescription);

            var breaks = book.productDescription.match(/<p>|<br[\s\/]*>\s*<br[\s\/]*>/gi);
            book.paragraphBreaks = breaks && breaks.length > 0;

            var strapline = book.productDescription.split("<br>");
            if (strapline[0] == book.productDescription) {
                strapline = book.productDescription.split("<BR>");
            }
            if (strapline[0] == book.productDescription) {
                strapline = book.productDescription.split("</p>");
            }

            // @Todo: this is a bug -- the book.headline piece needs to read it's value from data.js not from within this file
            book.straplinePresence = strapline[0].length < book.productDescription.length;
            book.headline = 0;
            if (book.straplinePresence) {
                book.headline += 10;
            }

            var words2 = strapline[0].replace(/<[^>]*>/g, "");
            book.straplineLength = words2.length <= 200;
            if (book.straplineLength) {
                book.headline += 10;
            }

            book.straplineEmphasis = (strapline[0].indexOf("<b>") > -1) || (strapline[0].indexOf("<strong>") > -1);
            if (book.straplineEmphasis) {
                book.headline += 15;
            }
            book.descriptionCharacterEncoding = !(encodingErrors(book.productDescription));

        }
        /*********************************************************************/
    }

    //console.log(otherReview);
    if (otherReview) {
        book.publisherReviews = otherReview.Content["#text"];
    }

    book.additionalImages = false;
    for (i = 0; i < images.length; i++) {
        if (images[i] && images[i]["@attributes"] && images[i]["@attributes"].Category && images[i]["@attributes"].Category == "variant") {
            book.additionalImages = true;
        }
    }

    /************************ Sales ranks issues ************************/
    book.salesRankOverall = salesRank && salesRank["#text"] ? salesRank["#text"] : false;
    if (book.salesRankOverall) {
        book.salesRankOverall_display = "#" + (book.salesRankOverall.replace(rankRegex, ","));
    }

    /************************ Price issues ************************/
    book.discounting = discountAmount && discountAmount.FormattedPrice && discountAmount.FormattedPrice["#text"] ? discountAmount.Amount["#text"] : false;
    book.discounting_display = discountAmount && discountAmount.FormattedPrice && discountAmount.FormattedPrice["#text"] ? discountAmount.FormattedPrice["#text"] : "";
    book.discountPercentage = discountPercent && discountPercent["#text"] ? discountPercent["#text"] : false;
    book.discountPercentage_display = book.discountPercentage ? book.discountPercentage + "%" : "";
    book.inStock = (inStock && inStock["#text"] === "now") ? true : false;
    /********************************************************************/

    //console.log(book);
    //console.log(attr);
    // for tracking purposes
    oqObj["isbn"] = attr.ISBN ? attr.ISBN["#text"] : "null";
    oqObj["bktitle"] = book.title;

    finalRecup("processData", $scope);
};

var processGoodreadsAuthorData = function(authorObj, $scope) {
    //console.log("processGoodreadsAuthorData");
    //console.log(authorObj);
    //console.log(book);
    document.getElementById("calculating").innerHTML = "Calculating...Goodreads";

    var grAuthor = authorObj.GoodreadsResponse.author ? authorObj.GoodreadsResponse.author : false;

    if (authorObj && book.grAuthorListing) {
        document.getElementById("calculating").innerHTML = "Calculating...Goodreads: Author";

        book.grAuthorBio = grAuthor && grAuthor.about && grAuthor.about["#cdata-section"]
            && grAuthor.about["#cdata-section"].length > 7 ? true : false;
        book.grAuthorFollowerCount = grAuthor.author_followers_count && grAuthor.author_followers_count["#text"] ?
            grAuthor.author_followers_count["#text"] : 0;
    }

    finalRecup("processGoodreadsAuthorData", $scope);
};

var processGoodreadsData = function(bookObj, authorObj, $scope, $http) {
    //console.log("processGoodreadsData");
    //console.log(bookObj);
    //console.log(authorObj.author[0]);
    //console.log(authorObj);
    document.getElementById("calculating").innerHTML = "Calculating...Goodreads";

    var grBook = bookObj.GoodreadsResponse.book;
    //console.log(grBook);

    // depending on the book, there can be more than 1 author...
    var grAuthor = authorObj.author ? authorObj.author : false;
    if(authorObj.author.length > 1){
        var grAuthor = authorObj.author[0] ? authorObj.author[0] : false;
    }
    //console.log(grAuthor);

    if (grBook) {
        document.getElementById("calculating").innerHTML = "Calculating...Goodreads: Book";

        book.grTitleListing = grBook.title ? grBook.title["#cdata-section"] || grBook.title["#text"] : false;
        book.grTitleDescription = grBook.description ? grBook.description["#cdata-section"] : false;
        
        //[DJC] adding Goodreads activity into the mix
        var arrayLength = grBook.popular_shelves.shelf ? grBook.popular_shelves.shelf.length : 0;
        for (var i = 0; i < arrayLength; i++) {
            if(grBook.popular_shelves.shelf[i]["@attributes"].name === "to-read"){
                book.grToReadCount = grBook.popular_shelves.shelf[i]["@attributes"].count;
            }

            if(grBook.popular_shelves.shelf[i]["@attributes"].name === "currently-reading"){
                book.grCurrentlyReadingCount = grBook.popular_shelves.shelf[i]["@attributes"].count;
            }
        }
        //book.grToReadCount = grBook.popular_shelves.shelf[0]["@attributes"].count ? grBook.popular_shelves.shelf[0]["@attributes"].count : 0;
        //book.grCurrentlyReadingCount = grBook.popular_shelves.shelf[2]["@attributes"].count ? grBook.popular_shelves.shelf[2]["@attributes"].count : 0;

        //book.grAuthorListing = grBook.authors && grAuthor.author && grAuthor.author.name ? grAuthor.author.name : false;
        book.grAuthorListing = grAuthor.name;

        var cover = grBook.image_url ? grBook.image_url["#text"] : "";
        book.grTitleCover = (cover && cover.indexOf("nophoto") === -1) ? true : false;
        /*if(book.grTitleDescription) {
            oqScore.oqScoreProductAuthority += 5;
        }
        if(book.grTitleCover) {
            oqScore.oqScoreProductAuthority += 5;
        }*/
    }

    /*
     * for goodreads author info, when there are multiple authors, we are going with the first author only!
     * OQ is well aware of the known error / limitation of vision on our part
     * */
    if (authorObj && book.grAuthorListing) {
        document.getElementById("calculating").innerHTML = "Calculating...Goodreads: Author";

        /*book.grAuthorBio = grAuthor && grAuthor.about && grAuthor.about["#text"]
                            && grAuthor.about["#text"].length > 7 ? true : false;*/
        var photo = grAuthor.image_url || grAuthor.large_image_url || grAuthor.small_image_url;

        book.grAuthorPhoto = photo && photo["#text"] && photo["#text"].indexOf("nophoto") === -1;
        /*book.grAuthorFollowerCount = grAuthor.author_followers_count && grAuthor.author_followers_count["#text"] ?
            grAuthor.author_followers_count["#text"] : 0;*/
        book.grAuthorFollowerCount_display = (book.grAuthorFollowerCount + "").replace(rankRegex, ",");
        book.grWebsiteLink = grAuthor.link && grAuthor.link["#text"] ? grAuthor.link["#text"] : "";
        book.grAuthorStarRating = grAuthor.average_rating && grAuthor.average_rating["#text"] ?
            grAuthor.average_rating["#text"] : 0;
        book.grAuthorNumberOfRatings = grAuthor.ratings_count && grAuthor.ratings_count["#text"] ?
            grAuthor.ratings_count["#text"] : 0;
        book.grAuthorNumberOfReviews = grAuthor.text_reviews_count && grAuthor.text_reviews_count["#text"] ?
            grAuthor.text_reviews_count["#text"] : 0;
    }

    if (grBook.authors.author.length > 1) {
        var id = grBook.authors.author[0].id["#text"];
    } else {
        var id = grBook.authors.author.id["#text"];
    }

    sendRequest(id, null, "goodreadsauthor", $http, $scope, null);
    finalRecup("processGoodreadsData", $scope);
};

var processgrRatingsData = function(grBook, $scope) {
    //console.log("processgrRatingsData");
    //console.log(grBook);
    document.getElementById("calculating").innerHTML = "Calculating...Goodreads Ratings";

    if (grBook) {
        book.grTitleStarRating = grBook.average_rating;
        book.grTitleStarRating_display = book.grTitleStarRating;
        book.grTitleNumberOfRantings = grBook.work_ratings_count;
        book.grTitleNumberOfRantings_display = (book.grTitleNumberOfRantings + "").replace(rankRegex, ",");
        book.grTitleNumberOfReviews = grBook.work_reviews_count;
        book.grTitleNumberOfReviews_display = (book.grTitleNumberOfReviews + "").replace(rankRegex, ",");
    }
    
    finalRecup("processgrRatingsData", $scope);
};

var processKadaxisData = function(data, $scope) {
    //console.log("processKadaxisData");
    //console.log(data);
    document.getElementById("calculating").innerHTML = "Calculating...Kadaxis";

    var i;
    var section = tabs[1].columns[2].sections[0];
    section.lines = section.lines || [];
    if (data.keywords && data.keywords.length) {

        // for tracking purposes
        oqObj["kadaxis"] = data.keywords;

        for (i = 0; i < data.keywords.length; i++) {
            section.lines[i] = {};
            section.lines[i].text = data.keywords[i].keyword;
            section.lines[i].textClass = "lowercase";
            section.lines[i].noValue = true;
        }
        //section.score = 0; // [DJC] at one point this annoying little bugger was 10 -- OMG!
    }

    var section2 = tabs[2].columns[0].sections[1];
    section2.lines = section2.lines || [];
    if (data.book && data.book.bNodes && data.book.bNodes.length) {
        var limit = Math.min(data.book.bNodes.length, 5);
        for (i = 0; i < limit; i++) {
            section2.lines[i] = {};
            section2.lines[i].text = data.book.bNodes[i].name;
            section2.lines[i].textClass = "lowercase";
            section2.lines[i].noValue = true;
        }
    }

    finalRecup("processKadaxisData", $scope);
};

var processSimilaritiesData = function(data, $scope) {
    //console.log("processSimilaritiesData");
    //console.log(data);
    //console.log($scope.similars);
    document.getElementById("calculating").innerHTML = "Calculating...Amazon Similarities";

    var sim;
    if (data && data.CartCreateResponse && data.CartCreateResponse.Cart && data.CartCreateResponse.Cart.SimilarProducts
        && data.CartCreateResponse.Cart.SimilarProducts.SimilarProduct) {
            sim = data.CartCreateResponse.Cart.SimilarProducts.SimilarProduct;
            $scope.similars = [];
            var len = Math.min(sim.length, 4);
            for (var i = 0; i < len; i++) {
                $scope.similars[i] = {};
                $scope.similars[i].asin = sim[i].ASIN['#text'];
                $scope.similars[i].title = sim[i].Title['#text'];
                $scope.similars[i].class = (i%2 === 0) ? "even" : "odd";
                if ($scope.similars[i].title.length > 70) {
                    $scope.similars[i].shortTitle = truncateStr($scope.similars[i].title, 68, false);
                } else {
                    $scope.similars[i].shortTitle = $scope.similars[i].title;
                }

            }
    }

    //console.log(JSON.stringify($scope.similars));
    finalRecup("processSimilaritiesData", $scope);
};

var processFbData = function(data, $scope) {
    //console.log("processFbData");
    //console.log(data);
    document.getElementById("calculating").innerHTML = "Calculating...Facebook";

    if (data && data.share && data.share.share_count) {
        book.fbShareCount = data.share.share_count;
    } else {
        book.fbShareCount = 0;
    }
    book.fbShareCount_display = book.fbShareCount;
    finalRecup("processFbData", $scope);
};

var processTwtData = function(data, $scope) {
    //console.log("processTwtData");
    //console.log(data);
    document.getElementById("calculating").innerHTML = "Calculating...Twitter";

    if (data && data.statuses) {
        book.twtTweets = data.statuses.length;
    } else {
        book.twtTweets = 0;
    }
    finalRecup("processTwtData", $scope);
};

var processGoogleData = function(data, $scope) {
    //console.log("processGoogleData");
    //console.log(data);
    document.getElementById("calculating").innerHTML = "Calculating...Google";

    if (data && data.volumeInfo.averageRating && data.volumeInfo.averageRating) {
        book.googleAverageRating = data.volumeInfo.averageRating;
        book.googleRatingsCount = data.volumeInfo.ratingsCount;
    } else {
        book.googleAverageRating = 0;
        book.googleRatingsCount = 0;
    }

    finalRecup("processGoogleData", $scope);
};

var processGoogleSearch = function(data, $scope) {
    console.log("processGoogleSearch");
    document.getElementById("calculating").innerHTML = "Searching Google...";

    console.log(data);
    //var googleSearch = data.match(/<div(.*) data-async-context=\"query:(.*)\" (.*)>(.*)<\/div>/ig);
    //console.log(googleSearch);
};

var processSimData = function(data, origObj) {
    //console.log("processSimData");
    //console.log(data);
    //console.log(origObj);
    document.getElementById("calculating").innerHTML = "Calculating...";

    var item;
    if (data && data.ItemLookupResponse && data.ItemLookupResponse.Items
        && data.ItemLookupResponse.Items.Item
        && data.ItemLookupResponse.Items.Item.ItemAttributes) {
        item = data.ItemLookupResponse.Items.Item.ItemAttributes;
        origObj.author = item.Author ? item.Author["#text"] : "";
        origObj.binding = item.Binding ? item.Binding["#text"] : "";
        origObj.publisher = item.Publisher ? item.Publisher["#text"] : "";
        origObj.edition = item.Edition ? item.Edition["#text"] : "";
        origObj.publicationDate = item.PublicationDate ? item.PublicationDate["#text"] : "";
        if(origObj.publicationDate) {
            var mydate = new Date(origObj.publicationDate);
            var month = mydate.getMonth(); // month (in integer 0-11)
            var day = mydate.getDate();
            var year = mydate.getFullYear(); // year
            origObj.publicationDate = "("+months[month]+ " " + day + ", " + year +")";
        }

        if (data.ItemLookupResponse.Items.Item.ImageSets
            && data.ItemLookupResponse.Items.Item.ImageSets.ImageSet) {
            var im = data.ItemLookupResponse.Items.Item.ImageSets.ImageSet;
            var img = im.LargeImage || im.MediumImage;
            if (!img) {
                img = im[im.length-1].LargeImage || im[im.length-1].MediumImage;
            }
            origObj.coverImage = img.URL["#text"];
        }
    }
    //console.log(origObj);
};

var processAuthorRankData = function(data, $scope){
    //console.log("processAuthorRankData");
    //console.log(data);
    document.getElementById("calculating").innerHTML = "Calculating...Author Ranking";

    var overallRank = data;
    if (overallRank && overallRank.length) {
        //console.log("book.authorRankOverall: "+overallRank[0].match(/[0-9]+/)[0]);
        book.authorRankOverall = overallRank[0].match(/[0-9]+/)[0];
        if (book.authorRankOverall) {
            book.authorRankOverall_display = "#" + (book.authorRankOverall.replace(rankRegex, ","));
            //console.log("book.authorRankOverall_display: "+book.authorRankOverall_display);

            categoryCont = data;
            if (categoryCont && categoryCont.length) {
                len = Math.min(categoryCont.length, 3);
                for (i = 0; i < len; i++) {
                    book["authorRankCategory" + (i+1)] = categoryCont[i].match(/[0-9]+/)[0];
                    if (book["authorRankCategory" + (i+1)]) {
                        book["authorRankCategory" + (i+1) + "_display"] = "#" + (book["authorRankCategory" + (i+1)].replace(rankRegex, ","));
                    }
                }
            }
        }
    }
};

var processPageData = function(data, $scope) {
    //console.log("processPageData");
    document.getElementById("calculating").innerHTML = "Process data...";

    var str = data;
    str = str.replace(/\s\s/g, "");

    var i, j, len, overallRankCont, overallRank, categoryCont, salesCategoryCont,
        salesCategory, salesCategoryNode, salesCategoryNode2, salesCategoryText,
        greater, category, authorBioArr, authorBio, authorBioCont, byline, lookInside,
        authorPageLink, authorImage, eligibleForKindleUnlimited, reviewsAndRatings,
        keywordsCont, keywords;

    keywordsCont = str.match(/<meta name="keywords"[^>]+>/);
    if (keywordsCont && keywordsCont.length) {
        keywords = keywordsCont[0].replace(/<meta name="keywords" content="/, "");
        keywords = keywords.replace(/">/, "");
        keywords = keywords.split(",");
        book["keywordFieldPresence"] = keywords.length > 0;
        book["keywordFieldQuantity"] = keywords.length;
    }

    /*overallRank = str.match(/<div class="overallRank">(\s)#[0-9]+&nbsp;Overall/);
    if (overallRank && overallRank.length) {
        book.authorRankOverall = overallRank[0].match(/[0-9]+/)[0];
        if (book.authorRankOverall) {
            book.authorRankOverall_display = "#" + (book.authorRankOverall.replace(rankRegex, ","));

            categoryCont = str.match(/<div class="nodeRank">([\s\S]*?)<\/div>/g);
            if (categoryCont && categoryCont.length) {
                len = Math.min(categoryCont.length, 3);
                for (i = 0; i < len; i++) {
                    book["authorRankCategory" + (i+1)] = categoryCont[i].match(/[0-9]+/)[0];
                    if (book["authorRankCategory" + (i+1)]) {
                        book["authorRankCategory" + (i+1) + "_display"] = "#" + (book["authorRankCategory" + (i+1)].replace(rankRegex, ","));
                    }
                }
            }
        }
    }*/

    byline = str.match(/<div id=\"byline\"[^>]*>.*<\/div>/ig);
    if (byline && byline.length) {
        var bylineElement = byline[0].match(/\"a-popover/g);
        if (bylineElement && bylineElement.length) {
            book.authorPagePresence = true;
        }
    }

    var authorInfo = str.match(/Visit Amazon.+Page.+Find all the books, read about the author, and more\./ig);
    if (authorInfo && authorInfo.length) {
        book.authorPagePresence = true;
        book.authorBio = true;
        book.authorPageBio = true;
    }

    var authorImage = str.match(/contributorImageContainer[a-zA-Z0-9]+/ig);
    //console.log(authorImage);
    if (authorImage && authorImage.length) {
        book.authorPageImage = true;
    }

    authorPageLink = str.match(/<div class="author_page_link[^>]+>([\s\S]*?)<\/div>/);
    if(authorPageLink && authorPageLink.length) {
        book.authorPagePresence = true;
    }

    authorImage = str.match(/<div id="authorMainImageBlock"[^>]*>([\s\S]*?)<\/div>/g);
    if(authorImage && authorImage.length) {
        book.authorPageImage = true;
        if (authorImage[0].indexOf("silhouette_teaser") > -1) {
            book.authorPageImage = false;
        }
    }

    eligibleForKindleUnlimited = str.match(/<span>\s*\$[0-9]+\.[0-9]+\s*<\/span>\s*<img id="kuBadge"/);
    if(eligibleForKindleUnlimited && eligibleForKindleUnlimited.length) {
        book.eligibleForKindleUnlimited = true;
    } else {
        eligibleForKindleUnlimited = str.match(/kindle unlimited logo/);
        if(eligibleForKindleUnlimited && eligibleForKindleUnlimited.length) {
            book.eligibleForKindleUnlimited = true;
        }
    }

    /*
     * this is where we create the sales category breadcrumb
     * example: within At Retail: under the Best Seller Rank section...
     *              breadcrumb: Books > > > Women
     * modifications: Jira OQ-211
     * */
    salesCategoryCont = str.match(/<ul class="zg_hrsr">([\s\S]*?)<\/ul>/);
    if (salesCategoryCont && salesCategoryCont.length) {
        var specLines = tabs[2].columns[0].sections[0].lines;
        salesCategoryNode = salesCategoryCont[0].match(/<span class="zg_hrsr_ladder">([\s\S]*?)<\/span>/g) || [];
        salesCategoryText = salesCategoryCont[0].match(/Books|Kindle/g) || [];
        salesCategoryNode2 = salesCategoryCont[0].match(/<b><a[^>]+>[^<]+<\/a><\/b>/gi) || [];
        salesCategory = salesCategoryCont[0].match(/#[0-9]+/g);
        var gr = "";
        var txt = ""; // this variable will capture the actual text for the breadcrumb

        if (salesCategory && salesCategory.length) {
            len = Math.min(salesCategory.length, 3);
            for (i = 0; i < len; i++) {
                book["salesRankCategory" + (i+1)] = salesCategory[i].replace("#", "");
                greater = salesCategoryNode[i] && salesCategoryNode[i].length ? salesCategoryNode[i].match(/&gt;/g).length : 1; //join("").replace(/\s\s/, " ");
                gr = " ";
                for (j = 0; j < greater; j++) {
                    gr += "> ";
                }
                txt = salesCategoryNode[i].replace(/<[^>]+>/ig, "");
                txt = txt.replace(/in&nbsp;/ig,"");
                //console.log(txt);

                specLines[i+1].text = salesCategoryNode2[i] ? salesCategoryNode2[i].replace(/<[^>]+>/ig, "") : "";
                specLines[i+1].text = specLines[i+1].text.replace(/&gt;/g, ">");
                specLines[i+1].text = specLines[i+1].text.replace(/&amp;/g, "&");
                specLines[i+1].text = (salesCategoryText[i] || "") + gr + specLines[i+1].text; //, 20, true);
                //specLines[i+1].title = specLines[i+1].text;
                specLines[i+1].title = htmlDecode(txt);
                specLines[i+1].text = truncateStr(specLines[i+1].text, 18, false);

                if (book["salesRankCategory" + (i+1)]) {
                    book["salesRankCategory" + (i+1) + "_display"] = "#" + (book["salesRankCategory" + (i+1)].replace(rankRegex, ","));
                }
            }
        }
    }

    lookInside = str.match(/<img[^>]*id="(ebooks)?[Ss]itbLogoImg"/);
    if (lookInside && lookInside.length) {
        book.lookInside = true;
    } else {
        book.lookInside = false;
    }

    var starRating = str.match(/<span id="acrPopover"[^>]+>/ig);
    starRating = starRating[0].match(/[0-5]+\.?[0-9]* out of 5 stars/g);
    if (starRating && starRating.length) {
        book.starRating = Number(starRating[0].match(/[0-9]+\.[0-9]+/)[0]);
        book.starRating_display = book.starRating || "";
    }

    //reviewsAndRatings = str.match(/totalReviewCount[^\"]*\"[^>]*>\d+,?\d+</g);
    //reviewsAndRatings = str.match(/<a class="[^>]*product-reviews-link[^>]*">([\s\S]*?)<\/a>/g);
    var reviewsAndRatings_el = str.match(/<span id="acrCustomerReviewText"[^>]+>[^>]+>/ig);
    var div = document.createElement('div');
    div.innerHTML = reviewsAndRatings_el;
    reviewsAndRatings = div.childNodes;
    //console.log(reviewsAndRatings);

    if (reviewsAndRatings && reviewsAndRatings.length) {
        //var numberOfReviews = reviewsAndRatings[0].match(/>\s*[0-9]+(,)?[0-9]+\s*</g);
        var numberOfReviews = reviewsAndRatings[0].innerText.match(/[^A-Za-z ]+/g);

        if (numberOfReviews && numberOfReviews.length) {
            book.numberOfReviews_display = numberOfReviews[0].match(/[0-9]+(,)?[0-9]+/)[0];
            if (book.numberOfReviews_display) {
                book.numberOfReviews = Number(book.numberOfReviews_display.replace(",", ""));
            }
        }
    }

    if(!book.publisherReviews) {
        //console.log(str);
        var descr = str.match(/(<|%3C)h2[^>]*(>|%3E)( |%20)Editorial( |%20)Reviews( |%20)(<|%3C)(%2F|\/)h2(>|%3E).*(<|%3C)h3[^>]*(>|%3E)(From|Review)/);
        if(descr == null){
            var descr = str.match(/(<|%3C)h2[^>]*(>|%3E)Editorial( |%20)Reviews(<|%3C)(%2F|\/)h2(>|%3E).*(<|%3C)h3[^>]*(>|%3E)(From|Review)/);
        }
        //console.log(descr);
        if (descr && descr.length) {
            book.publisherReviews = true;
        }
    }

    finalRecup("processPageData", $scope);
};

var processWikiData = function(data, $scope) {
    //console.log("processWikiData");
    //console.log(data);
    document.getElementById("calculating").innerHTML = "Calculating...Wikipedia";
    book.hasWiki = data.items ? true : false;
    book.wikiPageViews = 0;

    for (var i = 0; i < data.items.length; i++) {
        book.wikiPageViews += data.items[i].views;
    }

    //console.log(book);
    finalRecup("processWikiData", $scope);
};

var processWiki2Data = function(data, $scope) {
    //console.log("processWiki2Data");
    //console.log(data);
    document.getElementById("calculating").innerHTML = "Calculating...Getting Official Website";

    if (typeof data.parse != 'undefined'){
        book.hasOfficialWebsite = data.parse.externallinks[0] ? true : false;
        book.officialWebsite = data.parse.externallinks[0] ? data.parse.externallinks[0] : "";
    }else{
        book.hasOfficialWebsite = false;
        book.officialWebsite = "";
    }
    //console.log(book);
    finalRecup("processWiki2Data", $scope);
};

// ***** [START] PROCESS LINES FUNCTIONS
var processBulleanLine = function (line, book, invisible) {
    //console.log(line);
    document.getElementById("calculating").innerHTML = "Calculating...Lines";

    if (!line.score) {
        line.score = {};
    }
    if (book[line.name]) {
        line.class = "green";
        line.score.real = line.score.max;
        addAction(line, invisible);
    } else {
        line.class = "red";
        line.text = line.redText || line.text;
        line.score.real = line.score.min;
        addAction(line, invisible);
    }
    if (book[line.name + "_display"]) {
        line.displayValue = book[line.name + "_display"];
    }

    if (line.oqResult && line.oqWeight) {
        oqScore[line.oqResult] += calcWeightValue(100, line.oqWeight);
        if (line.oqResult == "oqScoreBrandAuthority") {
            //console.log(line.name + "  " + line.oqWeight + "  " + line.score.real + "  " + oqScore[line.oqResult]);
        }
    }
};

var processRangeLine = function (line, book, invisible) {
    //console.log(line);
    document.getElementById("calculating").innerHTML = "Calculating...Lines";

    if (!line.score) {
        line.score = {};
    }
    var onePercent, percentage;
    if (!book[line.name] || !line.range) {
        line.class = "red";
        if (line.score) {
            line.score.real = line.score.min;
        }
        addAction(line, invisible);
    } else {
        line.value = Number(book[line.name]);
        if (book[line.name + "_display"]) {
            line.displayValue = book[line.name + "_display"];
        }
        if (line.range.best > line.range.worst) { // the bigger the better
            if (line.value >= line.range.worst && line.value <= line.range.best) { // in the range
                line.class = "yellow";
                if (line.percentage) {
                    onePercent = line.onePercent || (line.range.best - line.range.worst)/33;
                    percentage = 33 + Math.round((line.value - line.range.worst)/onePercent);
                    if (line.score) {
                        line.score.real = Math.round(percentage * line.score.max / 100);
                    }
                } else {
                    if (line.score) {
                        line.score.real = Math.round((line.score.max + line.score.min)/2);
                    }
                }
            } else if (line.value >= line.range.best) {
                line.class = "green";
                if (line.percentage) {
                    onePercent = (line.range.best - line.range.worst)/33;
                    percentage =  Math.min(66 + Math.round((line.range.best + line.value)/onePercent), 100);
                    line.score.real = Math.round(percentage * line.score.max / 100);
                } else {
                    line.score.real = line.score.max;
                }
                addAction(line, invisible);
            } else {
                line.class = "red";
                if (line.percentage) {
                    onePercent = (line.range.best - line.range.worst)/33;
                    percentage = 33 - Math.round((line.value - line.range.worst)/onePercent);
                    line.score.real = Math.max(Math.round(percentage * line.score.max / 100), 0);
                } else {
                    line.score.real = line.score.min;
                }
                addAction(line, invisible);
            }
        } else {    // the smaller the better
            if (line.value <= line.range.worst && line.value >= line.range.best) { // in the range
                line.class = "yellow";
                if (line.percentage) {
                    onePercent = (line.range.worst - line.range.best)/33;
                    percentage = 33 + Math.round((line.value - line.range.best)/onePercent);
                    line.score.real = Math.round(percentage * line.score.max / 100);
                } else {
                    line.score.real = Math.round((line.score.max + line.score.min)/2);
                }
            } else if (line.value < line.range.best) {
                line.class = "green";
                if (line.percentage) {
                    onePercent = (line.range.best - 1)/33;
                    percentage =  66 + Math.round((line.range.best - line.value)/onePercent);
                    line.score.real = Math.round(percentage * line.score.max / 100);
                } else {
                    line.score.real = line.score.max;
                }
                addAction(line, invisible);
            } else {
                line.class = "red";
                if (line.percentage) {
                    onePercent = (line.range.worst - line.range.best)/33;
                    percentage = 33 - Math.round((line.value - line.range.worst)/onePercent);
                    line.score.real = Math.max(Math.round(percentage * line.score.max / 100), 0);
                } else {
                    line.score.real = line.score.min;
                }
                addAction(line, invisible);
            }
        }
    }


    if (line.oqResult && line.oqWeight) {
        oqScore[line.oqResult] += calcWeightValue(line.score.real * 100 / line.score.max, line.oqWeight);
        if (line.oqResult == "oqScoreBrandAuthority") {
            //console.log(line.name + "  " + line.oqWeight + "  " + line.score.real + "  " + oqScore.oqScoreBrandAuthority);
        }
    }

    if (line.oqResult2 && line.oqWeight2) {
        oqScore[line.oqResult2] += calcWeightValue(line.score.real * 100 / line.score.max, line.oqWeight2);
        if (line.oqResult2 == "oqScoreBrandAuthority") {
            //console.log(line.name + "  " + line.oqWeight2 + "  " + line.score.real + "  " + oqScore.oqScoreBrandAuthority);
        }
    }
};

// ***** [START] FINALRECUP FUNCTION
/**
 * @purpose: according to Etana: All other "process...Data" functions collect data from different sources and puts it in
 *      the "book" object. "FinalRecup" takes all these fields and updates the "tabs" object. It happens only once, after
 *      all responses are there.
 * */
var finalRecup = function (from, $scope) {
    // set default value for "$scope"
    $scope = typeof $scope !== "undefined" ? $scope : null;

    //console.log(finalRecupCount + "  finalRecup  " + from);
    // counts the number of process calls that were made
    finalRecupCount++;
    if(from === "1") {
        finalRecupCount++;
    }

    var actions = tabs[0].columns[2].sections[0].lines;

    //console.log(finalRecupCount);

    // Only the last one -- the last process data call -- continues the work
    // Because it needs all data to come back...and calculates the OQ Score tab and the Actions
    if (finalRecupCount === 10) {
        //console.log(JSON.stringify(book));
        $scope.book = book;

        //console.log($scope.book);
        //console.log(tabs);

        var oqColumn = 1, dif = 1;
        for (var i = 0; i < tabs.length; i++) {
            processTab(tabs[i], book, $scope);
            if (i > 0 && i < 4) {
                // //console.log(tabs[i].title, tabs[i].lines);
                tabs[0].columns[oqColumn].sections[i-dif] = {};
                tabs[0].columns[oqColumn].sections[i-dif].name = tabs[i].name;
                tabs[0].columns[oqColumn].sections[i-dif].title = tabs[i].title;
                tabs[0].columns[oqColumn].sections[i-dif].class = tabs[i].class;
                tabs[0].columns[oqColumn].sections[i-dif].lines = tabs[i].lines;
            }

            var ind;
            if (i > 0 && i < 4) {
                for (var j = 0; j < tabs[i].actions.length; j++) {
                    //console.log(tabs[i]);
                    ind = actions.length;
                    actions[ind] = {};
                    //actions[ind].text = tabs[i].actions[j].explanation;
                    actions[ind].text = tabs[i].actions[j].action.value;
                    actions[ind].title = actions[ind].text;
                    actions[ind].text = truncateStr(actions[ind].text, 80, true);
                    //actions[ind].class = "red";
                    actions[ind].class = tabs[i].actions[j].action.displayOn;
                    actions[ind].displayOnOQScoreTab = true;
                }
            }
        }

        //console.log(actions);
        //console.log(tabs[0]);
        processOqScoreTab(tabs[0]);
        //console.log(tabs);
        //console.log(JSON.stringify(tabs));

        $scope.tabs = tabs;
    }
};

// ***** [START] PROCESS TAB > COLUMN > SECTION FUNCTIONS
var processOqScoreTab = function(tab) {
    //console.log(tab);
    document.getElementById("calculating").innerHTML = "Calculating...OQ Score";

    var scorableLines = tab.columns[0].sections[0].lines;
    tab.score = 0;
    for (var i = 0; i < scorableLines.length; i++) {
        scorableLines[i].score.real = oqScore[scorableLines[i].name];
        scorableLines[i].scoreClass = calcClass(scorableLines[i].score.real, scorableLines[i]);
        tab.score += calcWeightValue(scorableLines[i].score.real, scorableLines[i].weight);
        tab.scoreClass = calcClass(tab.score, tab);
    }

    // for tracking purposes
    oqObj["oqstats"].tabs.oqscore = tab.score;
    if(tab.columns[0]){
        oqObj["oqstats"].sections["oqscoreproductauthority"] = tab.columns[0].sections[0].lines[0].score.real;
        oqObj["oqstats"].sections["oqscorebrandauthority"] = tab.columns[0].sections[0].lines[1].score.real;
    }
};

var processTab = function (tab, book, $scope) {
    //console.log(tab);
    document.getElementById("calculating").innerHTML = "Calculating...Tab";

    var i;
    var tabName = tab.name;
    if (tab.columns) {
        oqScore.actions = [];
        tab.lines = [];
        for (i = 0; i < tab.columns.length; i++) {
            processColumn(tab.columns[i], book, $scope);
            tab.score += Math.round(tab.columns[i].score * (tab.columns[i].weight || 100) / 100);
            tab.lines[i] = {};
            tab.lines[i].text = tab.columns[i].title;
            tab.lines[i].class = tab.columns[i].scoreClass;
            tab.lines[i].explClass = tab.columns[i].explClass;
            tab.lines[i].addText = tab.columns[i].addText;
            tab.lines[i].displayOnOQScoreTab = tab.columns[i].displayOnOQScoreTab;
            //console.log(tab.lines[i]);
        }
    }

    //console.log(tab);
    //console.log(oqScore.actions);
    tab.actions = oqScore.actions;
    if (tab.range) {
        if (tab.score >= tab.range.worst && tab.score <= tab.range.best) { // in the range
            tab.scoreClass = "yellow";
        } else if (tab.score > tab.range.best) {
            tab.scoreClass = "green";
        } else {
            tab.scoreClass = "red";
        }
    } else {
        tab.scoreClass = "red";
    }

    // for tracking purposes
    oqObj["oqstats"].tabs[tabName.toLowerCase()] = tab.score;
};

var processColumn = function (column, book, $scope) {
    //console.log(column);
    document.getElementById("calculating").innerHTML = "Calculating...Column";

    var i;
    var columnName = column.name;
    if (column.sections) {
        for (i = 0; i < column.sections.length; i++) {
            processSection (column.sections[i], book, $scope);
            column.score += column.sections[i].score;
        }

        // for tracking purposes
        oqObj["oqstats"].columns[columnName.toLowerCase()] = column.score ? column.score : 0;

        column.scoreClass = calcClass(column.score, column);
        if (column.oqResult && column.oqWeight) {
            oqScore[column.oqResult] += calcWeightValue(column.score, column.oqWeight);
            if (column.oqResult == "oqScoreBrandAuthority") {
                //console.log(column.name + "  " + column.oqWeight + "  " + column.score + "  " + oqScore.oqScoreBrandAuthority);
            }
        }
        if (column.oqResult2 && column.oqWeight2) {
            oqScore[column.oqResult2] += calcWeightValue(column.score, column.oqWeight2);
            if (column.oqResult2 == "oqScoreBrandAuthority") {
                //console.log(column.name + "  " + column.oqWeight2 + "  " + column.score + "  " + oqScore.oqScoreBrandAuthority);
            }
        }
    }
};

var processSection = function (section, book, $scope) {
    //console.log(section);
    document.getElementById("calculating").innerHTML = "Calculating...Section";

    var i;
    var sectionName = section.name;
    $scope[sectionName] = [];
    if (section.lines) {
        for (i = 0; i < section.lines.length; i++) {
            if (section.lines[i].range) {
                processRangeLine(section.lines[i], book, section.invisible);
            } else if (section.lines[i].name) {
                processBulleanLine(section.lines[i], book, section.invisible);
            }
            if (section.lines[i].score && section.lines[i].score.real) {
                section.score += section.lines[i].score.real;
            }
        }

        // for tracking purposes
        oqObj["oqstats"].sections[sectionName.toLowerCase()] = section.score;
    }

    if (section.oqResult && section.oqWeight) {
        oqScore[section.oqResult] += calcWeightValue(section.score, section.oqWeight);
        if (section.oqResult == "oqScoreBrandAuthority") {
            //console.log(section.name + "  " + section.oqWeight + "  " + section.score + "  " + oqScore.oqScoreBrandAuthority);
        }
    }
    if (section.oqResult2 && section.oqWeight2) {
        oqScore[section.oqResult2] += calcWeightValue(section.score, section.oqWeight2);
        if (section.oqResult2 == "oqScoreBrandAuthority") {
            //console.log(section.name + "  " + section.oqWeight2 + "  " + section.score + "  " + oqScore.oqScoreBrandAuthority);
        }
    }

    if (section.weight) {
        section.score = Math.round(section.score * section.weight / 100);
    }
};