// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

const posts = [
  {
    title: 'What will be in the blog section?',
    slug: 'what-will-be-in-the-blog-section',
    html: `
			<p>The plan is to have a blog section for each shopping district/region so that event planners and community leaders can promote their events. We hope this will foster and promote community/shotengai spirit.</p>
    `,
  },
  {
    title: 'What is Shouten Guide?',
    slug: 'what-is-shouten-guide',
    html: `
			<p>Shouten Guide is a project to help small businesses increase their digital presence. With the coronavirus pandemic hitting Japan in 2020 many small businesses are struggling. It's becoming apparent that an online/digital presence is crucial for a business to survive. On top of that big corporations like Amazon are dominating online retail and making it harder for small businesses to succeed.</p>

      <p>With Shouten Guide we would like to help small businesses promote themselves through online map listings and search engine optimization. We would like to provide an online platform to promote local events and foster community spirit which makes shopping districts in Japan so charming. This project is in its early stage but we hope it will help promote and preserve many shoutengai businesses in the future.</p>
    `,
  },
]

posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, '')
})

export default posts
