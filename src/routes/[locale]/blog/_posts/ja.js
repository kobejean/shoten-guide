// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

const posts = [
  {
    title: 'ブログページには何が表示されるのか？',
    slug: 'what-will-be-in-the-blog-section',
    html: `
      <p>イベントプランナーやコミュニティリーダーがイベントを宣伝できるように、ショッピング地区/地域ごとにブログペイジを設ける予定です。これにより、コミュニティ/商店街の精神が育まれ、促進されることを願っています。</p>
    `,
  },
]

posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, '')
})

export default posts
