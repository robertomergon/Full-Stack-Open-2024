const collection = require('lodash/collection')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, blog) => favorite.likes > blog.likes ? favorite : blog, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const authorCounts = collection.countBy(blogs, 'author');
    const authors = Object.keys(authorCounts);
    const authorWithMostBlogs = authors.reduce((max, author) => authorCounts[max] > authorCounts[author] ? max : author, authors[0]);
    return {
        author: authorWithMostBlogs,
        blogs: authorCounts[authorWithMostBlogs]
    };
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
    const likesByAuthor = collection.groupBy(blogs, 'author');
    const authors = Object.keys(likesByAuthor);
    const authorWithMostLikes = authors.reduce((max, author) => totalLikes(likesByAuthor[max]) > totalLikes(likesByAuthor[author]) ? max : author, authors[0]);
    return {
        author: authorWithMostLikes,
        likes: totalLikes(likesByAuthor[authorWithMostLikes])
    };
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}