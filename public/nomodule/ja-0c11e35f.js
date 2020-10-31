
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
System.register('app', [], function (exports) {
    'use strict';
    return {
        execute: function () {

            var about = exports('about', {
            	pageName: "情報ページ",
            	welcome: "<b>情報ページ</b>へようこそ！"
            });
            var home = exports('home', {
            	pageName: "ホームページ",
            	welcome: "<b>ホームページ</b>へようこそ！"
            });
            var locale = exports('locale', {
            	en: "English",
            	ja: "日本語",
            	ko: "한국어"
            });
            var nav = exports('nav', {
            	about: "情報",
            	home: "ホーム"
            });
            var notFound = exports('notFound', {
            	errorMessage: "ページが見つかりませんでした。",
            	linkBackHome: "ホームへ"
            });
            var ja = exports('default', {
            	about: about,
            	home: home,
            	locale: locale,
            	nav: nav,
            	notFound: notFound
            });

        }
    };
});
//# sourceMappingURL=ja-0c11e35f.js.map
