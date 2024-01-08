'use strict';

/**
 * Author: Etana Glushko
 * Contributor: Didier Leonard-Jean Charles
 * Date Created: Jan 1, 2016
 *
 * @name: optiqlyExtension
 * @file_name: app.js
 * @description: OptiQly Chrome extension to help optimize product campaign across a variety of marketplace platforms.
 *                  The first marketplace platform is Amazon
 * @purpose: Main module of the application / extension
 * @owner: OptiQly
 */

(function () {
    var app = angular.module('optiqlyApp', ['optiqlyApp.directive','angular-loading-bar',])
        .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }]);

    app.controller('optiqlyCtrl', ['$scope', '$http', '$rootScope', 'cfpLoadingBar', function($scope, $http, $rootScope, cfpLoadingBar){
        // initializing params and doing basic setup
        $scope.error = false;
        $scope.processError = false;
        $scope.closeAll = true;
        $rootScope.closeAll = true;
        $scope.activeItem = null;

        var d = new Date();
        $scope.asOf = formatDate(d);

        // on initial load of the extension we are always going to the OQ Score tab
        $scope.currentTab = 'oqscore.tpl.html';

        $scope.onClickTab = function (tab) {
            if (tab.name === "competition" && $scope.similars && $scope.similars[0]
                && (!$scope.similars[0].author || !$scope.similars[0].coverImage)) {
                for (var i = 0; i< $scope.similars.length; i++) {
                    sendRequest($scope.similars[i].asin, null, "amazonSim", $http, $scope, $scope.similars[i]);
                }
            }
            $scope.currentTab = tab.url;
            tab.active = true;
        };

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };

        $scope.clickedHere = function(item){};

        $scope.onLeaveItem = function(item){
            if (item) {
                if ($scope.activeItem) {
                    if ($scope.activeItem !== item) {
                        item.showInfo = false;
                    }
                } else {
                    item.showInfo = false;
                }
            }
        };

        $scope.clickedSomewhereElse = function(item){
            if (item) {
                item.showExpl = false;
                item.showExpl2 = false;
                item.showInfo = false;
                $scope.activeItem = null;
            }
        };

        $scope.clickedInfo = function(item){
            if (item) {
                if ($scope.activeItem) {
                    $scope.activeItem.showExpl = false;
                    $scope.activeItem.showExpl2 = false;
                    $scope.activeItem.showInfo = false;
                }
                item.showExpl2 = true;
                $scope.activeItem = item;
            }
        };

        // BEGINNING...
        chrome.tabs.getSelected(null, function(tab) {
            var tablink = tab.url;
            var asin;
            //console.log(tablink);

            // @ToDo: refactor code to perform a regex pattern match against the "preferred domain list"
            // puesdo code:
            //      var preferredDomains = ["amazon.com", "amazon.ca", "amazon.co.uk"];
            //      function isCurrentDomainValid(url):
            // http://stackoverflow.com/questions/29466887/how-to-match-a-string-against-an-array-of-pattern-in-javascript
            // http://www.primaryobjects.com/2012/11/19/parsing-hostname-and-domain-from-a-url-with-javascript/
            if (tablink.indexOf("amazon.") === -1 && tablink.indexOf("_include_") === -1) {
            } else {
                var matched, extra, tw_matched;

                if (tablink.indexOf("ean=") > -1){
                    matched = tablink.match(/\?ean=[a-zA-Z0-9]{13}/);
                    extra = "?ean=";
                    tw_matched = tablink.match(/[a-zA-Z0-9-]*\/[a-zA-Z0-9-]*\?ean=[a-zA-Z0-9]{13}/ig);
                    tw_matched = tw_matched[0].replace(extra,"").replace(/-/g," ");
                    tw_matched = tw_matched.match(/[a-zA-Z0-9- ]*/ig);
                    //console.log(tw_matched);
                } else if (tablink.indexOf("/dp/") > -1) {
                    matched = tablink.match(/\/dp\/[a-zA-Z0-9]{10}/);
                    extra = "/dp/";
                    tw_matched = tablink.match(/[a-zA-Z0-9-]*\/dp\//ig);
                    tw_matched = tw_matched[0].replace(extra,"").replace(/-/g," ");
                    //console.log(tw_matched);
                } else {
                    matched = tablink.match(/\/gp\/product\/[a-zA-Z0-9]{10}/);
                    extra = "/gp/product/";
                    tw_matched = tablink.match(/[a-zA-Z0-9-]*\/gp\/product\//ig);
                    tw_matched = tw_matched[0].replace(extra,"").replace(/-/g," ");
                    //console.log(tw_matched);
                }
                if(matched && matched.length) {
                    $scope.errorMessage = "";
                    $scope.error = false;

                    asin = matched[0].replace(extra, "");
                    if(extra === "?ean="){
                        asin = convertISBN(asin);
                    }

                    $scope.asin = asin;
                    book.asin = asin;

                    // *** Amazon
                    var t1 = performance.now();
                    sendRequest(asin, null, "amazon", $http, $scope, null, book);
                    var t2 = performance.now();
                    oqObj["oqstats"].requests["amazon"].value = t2 - t1;
                    oqObj["oqstats"].requests["amazon"].measure = "milliseconds";

                    // *** Goodreads
                    var t1 = performance.now();
                    sendRequest(asin, null, "goodreads", $http, $scope, null, book);
                    var t2 = performance.now();
                    oqObj["oqstats"].requests["goodreads"].value = t2 - t1;
                    oqObj["oqstats"].requests["goodreads"].measure = "milliseconds";

                    // *** Kadaxis
                    var t1 = performance.now();
                    sendRequest(asin, null, "kadaxis", $http, $scope, null, book);
                    var t2 = performance.now();
                    oqObj["oqstats"].requests["kadaxis"].value = t2 - t1;
                    oqObj["oqstats"].requests["kadaxis"].measure = "milliseconds";

                    // *** Amazon Similarities
                    var t1 = performance.now();
                    sendRequest(asin, null, "amazonSimilarities", $http, $scope, null, book);
                    var t2 = performance.now();
                    oqObj["oqstats"].requests["amazonSimilarities"].value = t2 - t1;
                    oqObj["oqstats"].requests["amazonSimilarities"].measure = "milliseconds";

                    // *** Facebook
                    var t1 = performance.now();
                    sendRequest("https://www.amazon.com"+extra+asin, null, "fb", $http, $scope, null, book);
                    var t2 = performance.now();
                    oqObj["oqstats"].requests["fb"].value = t2 - t1;
                    oqObj["oqstats"].requests["fb"].measure = "milliseconds";

                    // *** Author Rank
                    var t1 = performance.now();
                    sendRequest(asin, null, "authorrank", $http, $scope, null, book);
                    var t2 = performance.now();
                    oqObj["oqstats"].requests["authorrank"].value = t2 - t1;
                    oqObj["oqstats"].requests["authorrank"].measure = "milliseconds";

                    // *** Twitter
                    var t1 = performance.now();
                    sendRequest(encodeURIComponent(tw_matched), null, "twitter", $http, $scope, null, book);
                    var t2 = performance.now();
                    oqObj["oqstats"].requests["twitter"].value = t2 - t1;
                    oqObj["oqstats"].requests["twitter"].measure = "milliseconds";

                    // *** Google Book API
                    /*var t1 = performance.now();
                     sendRequest(asin, null, "google", $http, $scope, null, book);
                     var t2 = performance.now();
                     oqObj["oqstats"].requests["google"].value = t2 - t1;
                     oqObj["oqstats"].requests["google"].measure = "milliseconds";*/

                    // *** Google Search
                    //var t1 = performance.now();
                    //sendRequest(asin, null, "googleSearch", $http, $scope, null, book);
                    //var t2 = performance.now();
                    //oqObj["oqstats"].requests["googleSearch"].value = t2 - t1;
                    //oqObj["oqstats"].requests["googleSearch"].measure = "milliseconds";

                    // *** The Wikipedia calls are being made from the "processData" function
                } else {
                    $scope.errorMessage = "No ASIN number";
                }
            }
        });

        chrome.runtime.onMessage.addListener(function(request, sender) {
            if (request.action == "getSource") {
                processPageData(request.source, $scope);
            }
        });

        var oldOnLoad = window.onload;
        if (typeof window.onload !== 'function') {
            window.onload = onWindowLoad;
        } else {
            window.onload = function () {
                oldOnLoad();
                onWindowLoad();
            };
        }
    }]);
}());
