
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var about = {
	pageName: "情報ページ",
	welcome: "<b>情報ページ</b>へようこそ！"
};
var home = {
	pageName: "ホームページ",
	welcome: "<b>ホームページ</b>へようこそ！"
};
var locale = {
	en: "English",
	ja: "日本語",
	ko: "한국어"
};
var nav = {
	about: "情報",
	home: "ホーム"
};
var notFound = {
	errorMessage: "ページが見つかりませんでした。",
	linkBackHome: "ホームへ"
};
var ja = {
	about: about,
	home: home,
	locale: locale,
	nav: nav,
	notFound: notFound
};

export default ja;
export { about, home, locale, nav, notFound };
//# sourceMappingURL=ja-485d054a.js.map
