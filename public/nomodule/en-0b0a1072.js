
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
System.register('app', [], function (exports) {
    'use strict';
    return {
        execute: function () {

            var about = exports('about', {
            	pageName: "About Page",
            	welcome: "Welcome to the <b>About Page</b>!"
            });
            var home = exports('home', {
            	pageName: "Home Page",
            	welcome: "Welcome to the <b>Home Page</b>!"
            });
            var locale = exports('locale', {
            	en: "English",
            	ja: "日本語",
            	ko: "한국어"
            });
            var nav = exports('nav', {
            	about: "About",
            	home: "Home"
            });
            var notFound = exports('notFound', {
            	errorMessage: "Sorry this page could not be found.",
            	linkBackHome: "Back to Home"
            });
            var en = exports('default', {
            	about: about,
            	home: home,
            	locale: locale,
            	nav: nav,
            	notFound: notFound
            });

        }
    };
});
//# sourceMappingURL=en-0b0a1072.js.map
