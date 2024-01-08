/**
 * Author: Didier Leonard-Jean Charles
 * Date Created: Nov 25, 2016
 *
 * @name: oq.ea.js
 * @owner: OptiQly
 * @purpose: OQ Extension agent, part 1
 */

chrome.tabs.getSelected(null, function(tab){
    /**
     * There are two main events to track: load and DOMContentLoaded
     *  1) The load event is a general “loading complete” signal
     *  2) The DOMContentLoaded event triggers on document when the page is ready.
     *      It waits for the full HTML and scripts, and then triggers
     * */
    document.addEventListener('readystatechange', function docStateChange(e) {
        //console.log(e);
        //console.log(e.timeStamp);
        oqObj["readystate"] = {};
        oqObj["readystate"].value = e.timeStamp;
        oqObj["readystate"].format = "milliseconds";
    });

    document.addEventListener("DOMContentLoaded", function(event) {
        oqObj["domready"] = {};
        oqObj["domready"].value = Date.now() - timerStart;
        oqObj["domready"].format = "milliseconds";
    }, false);

    // executes when complete page is fully loaded, including all frames, objects and images
    window.addEventListener("load", function(event) {
        oqObj["fullyloaded"] = {};
        oqObj["fullyloaded"].value = Date.now() - timerStart;
        oqObj["fullyloaded"].format = "milliseconds";
        oqObj["extensionrendered"] = "success";

        // I have to force the code to wait 5 seconds before writing the data to Firebase
        setTimeout(function(){ sendToFirebase(oqObj); }, 5000);
    });

    oqObj["dob"] = timerStart;
    oqObj["br_os"] = navigator.userAgent;
    oqObj["lang"] = navigator.language;
    oqObj["platform"] = navigator.platform;
    oqObj["screen"] = {};
    oqObj["screen"].width = screen.width;
    oqObj["screen"].height = screen.height;
    oqObj["ip"] = {};
    oqObj["qs"] = {};
    oqObj["kadaxis"] = {};
    oqObj["oqstats"] = {};
    oqObj["oqstats"].tabs = {};
    oqObj["oqstats"].columns = {};
    oqObj["oqstats"].sections = {};
    oqObj["oqstats"].requests = {};
    oqObj["oqstats"].requests["goodreads"] = {};
    oqObj["oqstats"].requests["amazon"] = {};
    oqObj["oqstats"].requests["kadaxis"] = {};
    oqObj["oqstats"].requests["amazonSimilarities"] = {};
    oqObj["oqstats"].requests["fb"] = {};
    oqObj["oqstats"].requests["authorrank"] = {};
    oqObj["oqstats"].requests["twitter"] = {};
    oqObj["oqstats"].requests["wikipageviews"] = {};
    oqObj["oqstats"].requests["wikiofficialsite"] = {};
    oqObj["extensionrendered"] = "error";
    oqObj["error"] = "null";

    // utility function that converts the URL query string to JSON
    var QueryStringToJSON = function() {
        var pairs = /^[^#?]*(\?[^#]+|)/.exec(tab.url)[1].split('&');

        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return JSON.parse(JSON.stringify(result));
    };

    // if attempt to get the user's public IP address is unsuccessful, simply mark the IP as undefined...
    // @references: http://ip-api.com/docs/
    $.getJSON("http://ip-api.com/json", function (data) {
        oqObj["ip"] = data;
    });

    oqObj["qs"] = QueryStringToJSON();
    if(Object.keys(oqObj["qs"]).length <= 1){
        oqObj["qs"] = {"null":"null"};
    }

    oqObj["tab"] = tab;
    if (oqObj.tab.url.indexOf("amazon.com") === -1) {
    } else {
        if (oqObj.tab.url.indexOf("/dp/") > -1) {
            var matched = oqObj.tab.url.match(/\/dp\/[a-zA-Z0-9]{10}/);
            var extra = "/dp/";
        } else {
            var matched = oqObj.tab.url.match(/\/gp\/product\/[a-zA-Z0-9]{10}/);
            var extra = "/gp/product/";
        }

        if(matched && matched.length) {
            oqObj["asin"] = matched[0].replace(extra, "");
            oqObj["extra"] = extra;
        } else {
            oqObj["asin"] = null;
            oqObj["extra"] = null;
        }
    }
});