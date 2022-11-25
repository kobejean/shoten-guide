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
]

posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, '')
})

export default posts
