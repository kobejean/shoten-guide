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
]

posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, '')
})

export default posts
