/**
 * Author: Etana Glushko
 * Contributor: Didier Leonard-Jean Charles
 * Date Created: Jan 1, 2016
 *
 * @name: directive.js
 * @description: OptiQly Chrome extension to help optimize product campaign across a variety of marketplace platforms.
 *                  The first marketplace platform is Amazon
 * @purpose: AngularJS lets you extend HTML with new attributes called Directives.
 *              AngularJS has a set of built-in directives which offers functionality to your applications. AngularJS
 *              directives are extended HTML attributes with the prefix "ng-". AngularJS also lets you define your own
 *              directives.
 * @owner: OptiQly
 */

(function () {
    var utilsDirective = angular.module('optiqlyApp.directive', []);

    utilsDirective.directive('tabContent', function () {
        // Runs during compile
        return {
            restrict: 'E',
            scope: {
                tab: '=',
                leavei: '&',
                clickedh: '&',
                clickede: '&',
                clickedi: '&'
            },
            templateUrl: '/views/tab-content.html'
        };
    });

    utilsDirective.directive('oqScoreContent', function () {
        // Runs during compile
        return {
            restrict: 'E',
            scope: {
                tab: '=',
                leavei: '&',
                clickedh: '&',
                clickede: '&',
                clickedi: '&'
            },
            templateUrl: '/views/oq-score-content.html'
        };
    });

    utilsDirective.directive('competitionContent', function () {
        // Runs during compile
        return {
            restrict: 'E',
            scope: {
                similars: '=',
                leavei: '&',
                clickedh: '&',
                clickede: '&',
                clickedi: '&'
            },
            templateUrl: '/views/competition-content.html'
        };
    });

    utilsDirective.directive('clickAnywhereButHere', function($document){
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.bind('click', function(e) {
                    e.stopPropagation();
                });
                $document.bind('click', function() {
                    scope.$apply(attr.clickAnywhereButHere);
                });
            }
        };
    });
}());