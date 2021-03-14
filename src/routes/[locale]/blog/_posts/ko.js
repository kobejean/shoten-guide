// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

const posts = [
  {
    title: '블로그 섹션에는 무엇이 포함됩니까?',
    slug: 'what-will-be-in-the-blog-section',
    html: `
      <p>계획은 각 쇼핑 지구 / 지역에 대한 블로그 섹션을 만들어 이벤트 기획자와 커뮤니티 리더가 이벤트를 홍보 할 수 있도록하는 것입니다. 이것이 커뮤니티 / 쇼 텐가이 정신을 촉진하고 촉진하기를 바랍니다. </p>
    `,
  },
  {
    title: '상가 가이드는 무엇입니까?',
    slug: 'what-is-shoten-guide',
    html: `
      <p>상가 가이드는 중소기업이 디지털 인지도를 높이는 데 도움이되는 프로젝트입니다. 2020 년 코로나 바이러스가 일본을 강타하면서 많은 중소기업들이 어려움을 겪고 있습니다. 비즈니스가 살아남 으려면 온라인 / 디지털 존재가 중요하다는 것이 분명 해지고 있습니다. 그 외에도 Amazon과 같은 대기업이 온라인 소매점을 장악하고 있으며 소규모 기업의 성공을 어렵게 만들고 있습니다. </p>
      
      <p>상가 가이드를 통해 소기업이 온라인지도 목록 및 검색 엔진 최적화를 통해 자신을 홍보 할 수 있도록 돕고 싶습니다. 우리는 지역 행사를 홍보하고 일본의 쇼핑 지구를 매력적으로 만드는 커뮤니티 정신을 육성하기위한 온라인 플랫폼을 제공하고자합니다. 이 프로젝트는 초기 단계에 있지만 앞으로 많은 상가 비즈니스를 홍보하고 보존하는 데 도움이되기를 바랍니다. </p>
    `,
  },
]

posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, '')
})

export default posts
