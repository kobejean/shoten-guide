
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var about = {
	pageName: "About Page",
	welcome: "Welcome to the <b>About Page</b>!"
};
var home = {
	pageName: "Home Page",
	welcome: "Welcome to the <b>Home Page</b>!"
};
var locale = {
	en: "English",
	ja: "日本語",
	ko: "한국어"
};
var nav = {
	about: "About",
	home: "Home"
};
var notFound = {
	errorMessage: "Sorry this page could not be found.",
	linkBackHome: "Back to Home"
};
var en = {
	about: about,
	home: home,
	locale: locale,
	nav: nav,
	notFound: notFound
};

export default en;
export { about, home, locale, nav, notFound };
//# sourceMappingURL=en-750d0d02.js.map
