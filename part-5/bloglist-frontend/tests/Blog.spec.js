import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
        await page.request.post('http://localhost:3003/api/testing/reset')
        await page.request.post('http://localhost:3003/api/users', {
            data: { 
                username: "root",
                name: "root",
                _id: "6776f8b2749f64a011d65504",
                password: "root",
            }
        });

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await page.waitForSelector('form')

        const form = await page.$('form')
        expect(form).not.toBeNull()

        const content = await form?.textContent()
        expect(content).toContain('username')
        expect(content).toContain('password')
    })

    test.describe('Log in', () => {

        test('user can login', async ({ page }) => {
            const user = {
                username: 'root',
                password: 'root'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')
            const text = (await page.waitForSelector('p'))
            expect(text).not.toBeNull()
            expect(await text.textContent()).toContain('Logged in as ', user.username)
        })

        test('login fails with wrong password', async ({ page }) => {
            const user = {
                username: 'root',
                password: 'wrong'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')

            await expect(page.getByText('Wrong username or password, please try again')).toBeVisible()
        })

        test('login fails with wrong username', async ({ page }) => {
            const user = {
                username: 'wrong',
                password: 'root'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')

            await expect(page.getByText('Wrong username or password, please try again')).toBeVisible()
        })
    })

    test.describe('When logged in', () => {
        test.beforeEach(async ({ page }) => {
            const user = {
                username: 'root',
                password: 'root'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')
            await page.waitForSelector('p')
        })

        test('A blog can be created', async ({ page }) => {
            await page.click('button', { text: 'create new blog' })

            await page.getByRole('textbox', { name: 'title' }).fill('A blog created by test')
            await page.getByRole('textbox', { name: 'author' }).fill('test author')
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com')

            await page.getByRole('button', { name: 'Create' }).click()

            await page.waitForSelector('.blog', { text: 'A blog created by test' })
            const blogLocator = await page.locator('.blog', { hasText: 'A blog created by test' })
            await expect(blogLocator).toBeVisible()
        })

        test('A blog can be liked', async ({ page }) => {
            await page.click('button', { text: 'create new blog' })

            await page.getByRole('textbox', { name: 'title' }).fill('A blog created by test')
            await page.getByRole('textbox', { name: 'author' }).fill('test author')
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com')

            await page.getByRole('button', { name: 'Create' }).click()
            await page.waitForSelector('.blog', { text: 'A blog created by test' })

            await page.getByRole('button', { name: 'view' }).click()
            await page.waitForSelector('.likeButton')

            await expect(page.locator('.likeButton')).toBeVisible()
            await expect(page.getByText('0 likes')).toBeVisible()

            await page.click('.likeButton')

            await expect(page.getByText('1 likes')).toBeVisible()
            
        })
    })
})