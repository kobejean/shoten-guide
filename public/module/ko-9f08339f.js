
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var about = {
	pageName: "정보 페이지",
	welcome: "<b>정보 페이지</b>에 오신 것을 환영합니다!"
};
var home = {
	pageName: "홈 페이지",
	welcome: "<b>홈 페이지</b>에 오신 것을 환영합니다!"
};
var locale = {
	en: "English",
	ja: "日本語",
	ko: "한국어"
};
var nav = {
	about: "페이지",
	home: "홈"
};
var notFound = {
	errorMessage: "죄송합니다,이 페이지를 찾을 수 없습니다.",
	linkBackHome: "홈으로"
};
var ko = {
	about: about,
	home: home,
	locale: locale,
	nav: nav,
	notFound: notFound
};

export default ko;
export { about, home, locale, nav, notFound };
//# sourceMappingURL=ko-9f08339f.js.map