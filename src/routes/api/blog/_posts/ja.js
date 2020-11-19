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
  {
    title: '商店ガイドについて',
    slug: 'what-is-shouten-guide',
    html: `
      <p>商店ガイドは、中小企業がデジタル上の存在感を高めるのを支援するプロジェクトです。 2020年に新型コロナウイルスのパンデミックが日本を襲ったことで、多くの中小企業が苦労しています。 オンライン/デジタルプレゼンスがビジネスの存続に不可欠であることが明らかになりつつあります。 その上、Amazonのような大企業はオンライン小売を支配しており、中小企業の成功を難しくしています。</p>
      
      <p>商店ガイドを使用して、オンラインマップリストと検索エンジン最適化を通じて中小企業の宣伝を支援したいと考えています。 地域のイベントを推進し、日本の商店街を魅力的なコミュニティ精神を育むオンラインプラットフォームを提供したいと考えています。 このプロジェクトは初期段階ですが、将来的に多くの商店街事業の振興と保全に役立つことを願っています。 </p>
    `,
  },
]

posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, '')
})

export default posts
