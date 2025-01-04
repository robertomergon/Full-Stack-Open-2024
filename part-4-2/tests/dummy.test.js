const listHelper = require('../utils/list_helper')
const { emptyList, listWithOneBlog, listWithMultipleBlogs } = require('./dummy.data')

describe.skip("dummy test", () => {
    describe('dummy', () => {
        test('dummy returns one if list is empty', () => {
            const result = listHelper.dummy(emptyList)
            expect(result).toBe(1)
        })

        test('dummy returns one if list is not empty', () => {
            const result = listHelper.dummy(listWithOneBlog)
            expect(result).toBe(1)
        })
    })

    describe('total likes', () => {
        test('when list has only one blog, equals the likes of that', () => {
            const result = listHelper.totalLikes(listWithOneBlog)
            expect(result).toBe(5)
        })
    })

    describe('favorite blog', () => {
        test('when list has only one blog, equals that blog', () => {
            const result = listHelper.favoriteBlog(listWithOneBlog)
            expect(result).toEqual(listWithOneBlog[0])
        })

        test('when list has multiple blogs, equals the blog with most likes', () => {
            const result = listHelper.favoriteBlog(listWithMultipleBlogs)
            expect(result).toEqual(listWithMultipleBlogs[2])
        })
    })

    describe('most blogs', () => {
        test('most blogs of the multiple blogs', () => {
            const result = listHelper.mostBlogs(listWithMultipleBlogs)
            expect(result).toEqual({
                author: "Robert C. Martin",
                blogs: 3
            })
        })

        test('most blogs of the multiple blogs', () => {
            const result = listHelper.mostBlogs(listWithOneBlog)
            expect(result).toEqual({
                author: listWithOneBlog[0].author,
                blogs: 1
            })
        })

        test('most blogs of the empty list', () => {
            const result = listHelper.mostBlogs(emptyList)
            expect(result).toStrictEqual({
                author: undefined,
                blogs: undefined
            })
        })
    })

    describe('most likes', () => {
        test('most likes of the multiple blogs', () => {
            const result = listHelper.mostLikes(listWithMultipleBlogs)
            expect(result).toEqual({
                author: "Edsger W. Dijkstra",
                likes: 17
            })
        })
    })
})