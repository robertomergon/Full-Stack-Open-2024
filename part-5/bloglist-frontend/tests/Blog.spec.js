import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
        await page.request.post('http://localhost:3003/api/testing/reset')
        await page.request.post('http://localhost:3003/api/users', {
            data: { // In some versions of Playwright, use `data` instead of `json`.
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

        test('succeeds with correct credentials', async ({ page }) => {
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

        test('fails with wrong password', async ({ page }) => {
            const user = {
                username: 'root',
                password: 'wrong'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')

            await expect(page.getByText('Wrong username or password, please try again')).toBeVisible()
        })

        test('fails with wrong username', async ({ page }) => {
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

})