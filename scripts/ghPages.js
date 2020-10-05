const ghpages = require('gh-pages');

ghpages.publish(
    '__sapper__/export/shouten-guide',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/kobejean/shouten-guide.git',
        user: {
            name: 'Jean Atsumi Flaherty',
            email: 'kobejean@me.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)